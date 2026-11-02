"use server";

import { revalidatePath } from "next/cache";
import { createSSRClient } from "@/lib/supabase/server";
import { createServerAdminClient } from "@/lib/supabase/serverAdminClient";
import { trackEvent } from "@/lib/analytics/mixpanel";
import { removePublicImages } from "@/lib/storage/remove-public-images";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types";

// Los errores son claves de messages/*.json: los traduce la vista
export async function deleteDetail(
    detailId: string,
): Promise<{ success?: boolean; error?: string }> {
    try {
        const ssrClient = await createSSRClient();
        const {
            data: { user },
            error: authError,
        } = await ssrClient.auth.getUser();

        if (authError || !user) {
            return { error: "No has iniciado sesión o tu sesión ha expirado" };
        }

        const supabase = await createServerAdminClient();
        const db = supabase as unknown as SupabaseClient<Database>;

        const { data: detail } = await db
            .from("property_details")
            .select("property_id")
            .eq("id", detailId)
            .single()
            .overrideTypes<{ property_id: string }, { merge: false }>();

        if (!detail) return { error: "detailNotFound" };

        const { data: property } = await db
            .from("properties")
            .select("user_id")
            .eq("id", detail.property_id)
            .single()
            .overrideTypes<{ user_id: string }, { merge: false }>();

        if (!property || property.user_id !== user.id) {
            return { error: "detailsNoPermission" };
        }

        // .select() devuelve la fila borrada: su imagen sale del mismo
        // delete, sin una lectura previa que pueda quedar desfasada si otra
        // pestaña la cambia entretanto
        const { data: deleted, error: deleteErr } = await db
            .from("property_details")
            .delete()
            .eq("id", detailId)
            .eq("property_id", detail.property_id)
            .select("image_url")
            .overrideTypes<{ image_url: string | null }[], { merge: false }>();

        // Si el delete falla, la fila sigue apuntando a la imagen: no se toca
        if (deleteErr) {
            console.error("[deleteDetail] Error borrando detalle:", deleteErr);
            return { error: "detailDeleteError" };
        }

        // Storage después de la BD: ninguna fila apunta ya a la imagen
        await removePublicImages(
            db,
            "property-images",
            user.id,
            (deleted ?? []).map((row) => row.image_url),
        );

        await trackEvent({
            event: "property_detail_deleted",
            distinctId: user.id,
            props: {
                detail_id: detailId,
                property_id: detail.property_id,
            },
        });

        revalidatePath("/app");

        return { success: true };
    } catch (error: unknown) {
        // El detalle queda en el log; a la vista le llega un error genérico
        console.error("Error inesperado en deleteDetail:", error);
        return { error: "detailDeleteError" };
    }
}
