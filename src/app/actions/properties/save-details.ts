"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { createSSRClient } from "@/lib/supabase/server";
import { createServerAdminClient } from "@/lib/supabase/serverAdminClient";
import { trackEvent } from "@/lib/analytics/mixpanel";
import { z } from "zod";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert, TablesUpdate } from "@/lib/types";

import { translateAndStoreDetails } from "@/lib/translations/translateAndStoreDetails";

// ==============================
// Schema
// ==============================
const DetailItemSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(1, "El nombre es obligatorio"),
    instructions: z.string().nullable(),
    guidelines: z.string().nullable(),
    predefined_key: z.string().nullable(),
    order_index: z.number().int().min(0),
});

const SaveDetailsSchema = z.object({
    property_id: z.string().uuid(),
    details: z.array(DetailItemSchema),
});

export type SaveDetailsState = {
    errors?: {
        server?: string[];
    };
    success?: boolean;
    message?: string;
};

// ==============================
// Action
// ==============================
export async function saveDetails(
    propertyId: string,
    details: z.infer<typeof DetailItemSchema>[],
): Promise<SaveDetailsState> {
    try {
        // 1) Auth
        const ssrClient = await createSSRClient();
        const {
            data: { user },
            error: authError,
        } = await ssrClient.auth.getUser();

        if (authError || !user) {
            return {
                errors: {
                    server: ["No has iniciado sesión o tu sesión ha expirado"],
                },
            };
        }

        // 2) Validar input
        const parsed = SaveDetailsSchema.safeParse({
            property_id: propertyId,
            details,
        });
        if (!parsed.success) {
            return { errors: { server: ["Datos inválidos."] } };
        }

        const supabase = await createServerAdminClient();
        const db = supabase as unknown as SupabaseClient<Database>;

        // 3) Verificar ownership
        const { data: property } = await db
            .from("properties")
            .select("user_id")
            .eq("id", propertyId)
            .single()
            .overrideTypes<{ user_id: string }, { merge: false }>();

        if (!property || property.user_id !== user.id) {
            return {
                errors: {
                    server: ["No tienes permisos para editar esta propiedad"],
                },
            };
        }

        const { details: validatedDetails } = parsed.data;

        // 4) Separar nuevos de existentes
        const toUpdate = validatedDetails.filter((d) => d.id !== undefined);
        const toInsert = validatedDetails.filter((d) => d.id === undefined);

        // 5) IDs que el propietario quiere conservar
        const keepIds = toUpdate.map((d) => d.id as string);

        // 6) Eliminar los que ya no están en el listado
        if (keepIds.length > 0) {
            await db
                .from("property_details")
                .delete()
                .eq("property_id", propertyId)
                .not("id", "in", `(${keepIds.join(",")})`);
        } else {
            await db
                .from("property_details")
                .delete()
                .eq("property_id", propertyId);
        }

        // Valores guardados antes de actualizar: solo se retraducen los campos
        // que cambian (cada traducción consume cuota del anfitrión)
        type DetailText = {
            id: string;
            name: string;
            instructions: string | null;
            guidelines: string | null;
        };
        const { data: previous, error: previousErr } = await db
            .from("property_details")
            .select("id, name, instructions, guidelines")
            .eq("property_id", propertyId)
            .overrideTypes<DetailText[], { merge: false }>();

        // Sin valores previos todo cuenta como cambiado: se retraduce todo
        if (previousErr) {
            console.error(
                "[saveDetails] Error leyendo detalles previos:",
                previousErr,
            );
        }
        const previousById = new Map(
            (previous ?? []).map((detail) => [detail.id, detail]),
        );

        // 7) Actualizar existentes. Guardamos los ids realmente actualizados:
        // un id de otra propiedad no actualiza nada y no debe traducirse
        const updatedIds = new Set<string>();
        for (const detail of toUpdate) {
            const { data: updated } = await db
                .from("property_details")
                .update({
                    name: detail.name,
                    instructions: detail.instructions,
                    guidelines: detail.guidelines,
                    predefined_key: detail.predefined_key,
                    order_index: detail.order_index,
                    updated_at: new Date().toISOString(),
                } satisfies TablesUpdate<"property_details">)
                .eq("id", detail.id as string)
                .eq("property_id", propertyId)
                .select("id")
                .overrideTypes<{ id: string }[], { merge: false }>();

            updated?.forEach((row) => updatedIds.add(row.id));
        }

        // 8) Insertar nuevos. El select devuelve exactamente las filas
        // insertadas (buscarlas después por nombre arrastraba detalles
        // existentes con el mismo nombre)
        let inserted: DetailText[] = [];
        let insertFailed = false;
        if (toInsert.length > 0) {
            const { data, error: insertErr } = await db
                .from("property_details")
                .insert(
                    toInsert.map(
                        (detail) =>
                            ({
                                property_id: propertyId,
                                name: detail.name,
                                instructions: detail.instructions,
                                guidelines: detail.guidelines,
                                predefined_key: detail.predefined_key,
                                order_index: detail.order_index,
                            }) satisfies TablesInsert<"property_details">,
                    ),
                )
                .select("id, name, instructions, guidelines")
                .overrideTypes<DetailText[], { merge: false }>();

            if (insertErr) {
                console.error(
                    "[saveDetails] Error insertando detalles:",
                    insertErr,
                );
                insertFailed = true;
            }
            inserted = data ?? [];
        }

        // 9) Traducir con after(): tras responder, sin bloquear al anfitrión.
        // Nuevos: todos sus campos.
        // Actualizados: solo los que cambiaron; su traducción antigua se borra
        // antes, porque en la guía tiene prioridad sobre el original.
        const translatableFields = [
            "name",
            "instructions",
            "guidelines",
        ] as const;

        const detailsToTranslate: {
            detail: DetailText;
            changed: readonly (typeof translatableFields)[number][];
        }[] = inserted.map((detail) => ({
            detail,
            changed: translatableFields,
        }));

        for (const detail of toUpdate) {
            const id = detail.id as string;
            if (!updatedIds.has(id)) continue;

            const before = previousById.get(id);
            const changed = translatableFields.filter(
                (field) => (before?.[field] ?? "") !== (detail[field] ?? ""),
            );
            if (changed.length === 0) continue;

            const { error: deleteTrErr } = await db
                .from("property_details_translations")
                .delete()
                .eq("property_detail_id", id)
                .in("field_key", changed);

            if (deleteTrErr) {
                console.error(
                    "[saveDetails] Error borrando traducciones:",
                    deleteTrErr,
                );
            }

            detailsToTranslate.push({
                detail: {
                    id,
                    name: detail.name,
                    instructions: detail.instructions,
                    guidelines: detail.guidelines,
                },
                changed,
            });
        }

        for (const { detail, changed } of detailsToTranslate) {
            const fields = changed.flatMap((fieldKey) => {
                const value = detail[fieldKey];
                return value ? [{ fieldKey, value }] : [];
            });

            if (fields.length > 0) {
                after(() =>
                    translateAndStoreDetails(
                        detail.id,
                        { type: "user", userId: user.id },
                        fields,
                    ).catch((err) =>
                        console.error("[saveDetails] Error en traducción:", err),
                    ),
                );
            }
        }

        // Los existentes ya se actualizaron (y se traducen arriba): se refresca
        // la vista, pero el guardado no está completo
        if (insertFailed) {
            revalidatePath("/app");
            return {
                errors: {
                    server: ["No se han podido guardar los detalles nuevos"],
                },
            };
        }

        // 10) Track
        await trackEvent({
            event: "property_details_saved",
            distinctId: user.id,
            props: {
                property_id: propertyId,
                details_count: validatedDetails.length,
                predefined_count: validatedDetails.filter(
                    (d) => d.predefined_key !== null,
                ).length,
                custom_count: validatedDetails.filter(
                    (d) => d.predefined_key === null,
                ).length,
                updated_count: toUpdate.length,
                inserted_count: toInsert.length,
            },
        });

        revalidatePath("/app");

        return {
            success: true,
            message: "Detalles guardados correctamente",
        };
    } catch (error: unknown) {
        console.error("Error inesperado en saveDetails:", error);
        return {
            errors: {
                server: [
                    error instanceof Error
                        ? error.message
                        : "Error interno del servidor",
                ],
            },
        };
    }
}
