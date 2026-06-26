"use server";

import { revalidatePath } from "next/cache";
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

        // 7) Actualizar existentes
        for (const detail of toUpdate) {
            await db
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
                .eq("property_id", propertyId);
        }

        // 8) Insertar nuevos
        if (toInsert.length > 0) {
            await db.from("property_details").insert(
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
            );
        }

        // 9) Traducir — fire and forget
        const allSavedDetails = [
            ...toUpdate.map((d) => ({
                id: d.id as string,
                name: d.name,
                instructions: d.instructions,
                guidelines: d.guidelines,
            })),
        ];

        // Para los insertados necesitamos sus IDs recién creados
        if (toInsert.length > 0) {
            const insertedNames = toInsert.map((d) => d.name);
            const { data: inserted } = await db
                .from("property_details")
                .select("id, name, instructions, guidelines")
                .eq("property_id", propertyId)
                .in("name", insertedNames);

            if (inserted) {
                allSavedDetails.push(...inserted);
            }
        }

        for (const detail of allSavedDetails) {
            const fields: {
                fieldKey: "name" | "instructions" | "guidelines";
                value: string;
            }[] = [];

            if (detail.name)
                fields.push({ fieldKey: "name", value: detail.name });
            if (detail.instructions)
                fields.push({
                    fieldKey: "instructions",
                    value: detail.instructions,
                });
            if (detail.guidelines)
                fields.push({
                    fieldKey: "guidelines",
                    value: detail.guidelines,
                });

            if (fields.length > 0) {
                translateAndStoreDetails(detail.id, fields).catch((err) =>
                    console.error("[saveDetails] Error en traducción:", err),
                );
            }
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
