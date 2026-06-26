"use server";

import { revalidatePath } from "next/cache";
import { createSSRClient } from "@/lib/supabase/server";
import { createServerAdminClient } from "@/lib/supabase/serverAdminClient";
import { trackEvent } from "@/lib/analytics/mixpanel";

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

        const { data: detail } = await supabase
            .from("property_details")
            .select("property_id")
            .eq("id", detailId)
            .single()
            .overrideTypes<{ property_id: string }, { merge: false }>();

        if (!detail) return { error: "Detalle no encontrado" };

        const { data: property } = await supabase
            .from("properties")
            .select("user_id")
            .eq("id", detail.property_id)
            .single()
            .overrideTypes<{ user_id: string }, { merge: false }>();

        if (!property || property.user_id !== user.id) {
            return { error: "No tienes permisos para eliminar este detalle" };
        }

        await supabase.from("property_details").delete().eq("id", detailId);

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
        return {
            error:
                error instanceof Error
                    ? error.message
                    : "Error interno del servidor",
        };
    }
}
