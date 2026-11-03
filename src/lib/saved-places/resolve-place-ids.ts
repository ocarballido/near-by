import "server-only";

import { createServerAdminClient } from "@/lib/supabase/serverAdminClient";

// De una lista de ids (ya validados como UUID), los que son sitios de tipo
// location de la guía, en el orden recibido: descarta los de otras guías y
// los que el anfitrión haya borrado. null si la consulta falla (no se sabe
// cuáles son válidos). Cliente admin, como el resto de la guía pública: el
// rol anónimo no puede leer property_data. Solo lectura
export async function resolvePlaceIds(
    propertyId: string,
    placeIds: string[],
): Promise<string[] | null> {
    if (placeIds.length === 0) return [];

    const supabase = await createServerAdminClient();

    const { data, error } = await supabase
        .from("property_data")
        .select("id")
        .eq("property_id", propertyId)
        .eq("type", "location")
        .in("id", placeIds)
        .overrideTypes<{ id: string }[], { merge: false }>();

    if (error) {
        console.error("[resolvePlaceIds] error:", error.message);
        return null;
    }

    const valid = new Set((data ?? []).map((row) => row.id));
    return placeIds.filter((id) => valid.has(id));
}
