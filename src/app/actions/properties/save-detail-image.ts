"use server";

import { revalidatePath } from "next/cache";
import { createSSRClient } from "@/lib/supabase/server";
import { createServerAdminClient } from "@/lib/supabase/serverAdminClient";
import { checkPropertyOwner } from "@/lib/properties/check-property-owner";
import { removePublicImages } from "@/lib/storage/remove-public-images";
import { uploadDetailImage } from "@/lib/storage/upload-detail-image";
import { z } from "zod";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesUpdate } from "@/lib/types";

// La imagen va en una llamada aparte de saveDetails: cada petición lleva una
// sola imagen y no se acerca al límite de 1 MB de las Server Actions.
// Los errores son claves de messages/*.json: los traduce el editor
const SaveDetailImageSchema = z.object({
    detail_id: z.string().uuid(),
    image_action: z.preprocess(
        (v) => (v === "remove" ? "remove" : null),
        z.enum(["remove"]).nullable(),
    ),
});

export type SaveDetailImageState = {
    error?: string;
    imageUrl?: string | null;
};

export async function saveDetailImage(
    detailId: string,
    formData: FormData,
): Promise<SaveDetailImageState> {
    try {
        // 1) Auth
        const ssrClient = await createSSRClient();
        const {
            data: { user },
            error: authError,
        } = await ssrClient.auth.getUser();

        if (authError || !user) return { error: "detailImageSaveError" };

        // 2) Validar input: o un fichero nuevo o la acción "remove"
        const parsed = SaveDetailImageSchema.safeParse({
            detail_id: detailId,
            image_action: formData.get("image_action"),
        });

        const file = formData.get("image");
        const imageFile = file instanceof File && file.size > 0 ? file : null;

        if (!parsed.success || (!imageFile && !parsed.data.image_action)) {
            return { error: "detailImageSaveError" };
        }

        const supabase = await createServerAdminClient();
        const db = supabase as unknown as SupabaseClient<Database>;

        // 3) Leer el detalle y verificar que su propiedad es del usuario,
        // antes de subir nada a Storage o escribir en BD
        type ExistingDetail = Pick<
            Tables<"property_details">,
            "property_id" | "image_url"
        >;

        const { data: existing, error: fetchErr } = await db
            .from("property_details")
            .select("property_id, image_url")
            .eq("id", parsed.data.detail_id)
            .maybeSingle()
            .overrideTypes<ExistingDetail, { merge: false }>();

        if (fetchErr || !existing) return { error: "detailImageSaveError" };

        const owner = await checkPropertyOwner(
            db,
            existing.property_id,
            user.id,
        );
        if (!owner.ok) return { error: "detailImageSaveError" };

        // 4) Imagen — prioridad: archivo nuevo > acción "remove".
        // Sin imagen se guarda null (no ""): las tarjetas caen al placeholder
        let imageUrl: string | null = null;
        if (imageFile) {
            const uploadRes = await uploadDetailImage({
                db,
                userId: user.id,
                imageFile,
            });
            if (!uploadRes.ok) return { error: uploadRes.error };

            imageUrl = uploadRes.imageUrl;
        }

        // 5) Update, filtrando también por la propiedad verificada y por la
        // imagen leída en el paso 3: si entretanto se ha borrado el detalle
        // o ha cambiado su imagen (otra pestaña), no actualiza ninguna fila
        const updateQuery = db
            .from("property_details")
            .update({
                image_url: imageUrl,
                updated_at: new Date().toISOString(),
            } satisfies TablesUpdate<"property_details">)
            .eq("id", parsed.data.detail_id)
            .eq("property_id", existing.property_id);

        const { data: updated, error: updateErr } = await (
            existing.image_url === null
                ? updateQuery.is("image_url", null)
                : updateQuery.eq("image_url", existing.image_url)
        )
            .select("id")
            .overrideTypes<{ id: string }[], { merge: false }>();

        if (updateErr || !updated?.length) {
            if (updateErr) {
                console.error(
                    "[saveDetailImage] Error actualizando:",
                    updateErr,
                );
            }
            // Ninguna fila apunta a lo recién subido: no dejarlo huérfano
            await removePublicImages(db, "property-images", user.id, [
                imageUrl,
            ]);
            return { error: "detailImageSaveError" };
        }

        // 6) Storage después de la BD: la imagen anterior ya no la
        // referencia ninguna fila, y ninguna fila apunta a un fichero borrado
        if (imageUrl !== existing.image_url) {
            await removePublicImages(db, "property-images", user.id, [
                existing.image_url,
            ]);
        }

        revalidatePath("/app");

        return { imageUrl };
    } catch (error: unknown) {
        console.error("Error inesperado en saveDetailImage:", error);
        return { error: "detailImageSaveError" };
    }
}
