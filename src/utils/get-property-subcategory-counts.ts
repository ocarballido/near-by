"use server";

import { createServerAdminClient } from "@/lib/supabase/serverAdminClient";
import { CATEGORIES_SUB_CATEGORIES } from "@/config/config-constants";

export async function getPropertySubCategoryCounts(
    propertyId: string,
): Promise<Record<string, number>> {
    const supabase = await createServerAdminClient();

    const [{ data, error }, { count: detailsCount }] = await Promise.all([
        supabase
            .from("property_data")
            .select("sub_category_id")
            .eq("property_id", propertyId)
            .overrideTypes<{ sub_category_id: string | null }[]>(),
        (supabase as any)
            .from("property_details")
            .select("id", { count: "exact", head: true })
            .eq("property_id", propertyId),
    ]);

    const counts = (data ?? []).reduce<Record<string, number>>((acc, row) => {
        const id = row.sub_category_id;
        if (!id) return acc;
        acc[id] = (acc[id] ?? 0) + 1;
        return acc;
    }, {});

    if (detailsCount && detailsCount > 0) {
        counts[
            CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.EXPLORE_DETAILS.id
        ] = detailsCount;
    }

    return counts;
}
