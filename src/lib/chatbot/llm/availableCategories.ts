import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types";

export interface CategoryCandidate {
    subCategoryId: string;
    name: string;
    type: "info" | "location";
}

export interface PropertyDetailCandidate {
    id: string;
    name: string;
}

export interface AvailableCategories {
    candidates: CategoryCandidate[];
    details: PropertyDetailCandidate[];
    hasFeatured: boolean;
    hasMustVisit: boolean;
}

const EMPTY_RESULT: AvailableCategories = {
    candidates: [],
    details: [],
    hasFeatured: false,
    hasMustVisit: false,
};

/**
 * Lo que esta propiedad tiene REALMENTE configurado — nunca se ofrece al
 * clasificador una opción vacía. Dos fuentes de datos distintas, cada una
 * con su propia forma: property_data (subcategorías con texto libre o
 * ubicaciones) y property_details (elementos individuales tipo Barbacoa,
 * Piscina..., ya redactados con voz de anfitrión, sin subcategoría).
 * SCHEDULE tampoco vive en ninguna de las dos — está en `properties`, y se
 * añade aparte en schema.ts.
 */
export async function fetchAvailableCategories(
    db: SupabaseClient<Database>,
    propertyId: string,
): Promise<AvailableCategories> {
    const [propertyDataResult, detailsResult] = await Promise.all([
        db
            .from("property_data")
            .select("sub_category_id, type, featured, must_visit")
            .eq("property_id", propertyId),
        db
            .from("property_details")
            .select("id, name")
            .eq("property_id", propertyId),
    ]);

    if (detailsResult.error) {
        console.error("chatbot property_details error:", detailsResult.error);
    }
    const details: PropertyDetailCandidate[] = (detailsResult.data ?? []).map(
        (d) => ({ id: d.id, name: d.name }),
    );

    const { data: rows, error } = propertyDataResult;

    if (error || !rows || rows.length === 0) {
        if (error) console.error("chatbot available categories error:", error);
        return { ...EMPTY_RESULT, details };
    }

    const subCategoryIds = new Set<string>();
    let hasFeatured = false;
    let hasMustVisit = false;

    for (const row of rows) {
        if (row.sub_category_id) subCategoryIds.add(row.sub_category_id);
        if (row.featured) hasFeatured = true;
        if (row.must_visit) hasMustVisit = true;
    }

    if (subCategoryIds.size === 0) {
        return { candidates: [], details, hasFeatured, hasMustVisit };
    }

    const { data: subCategories, error: subCategoriesError } = await db
        .from("sub_categories")
        .select("id, name, type")
        .in("id", Array.from(subCategoryIds));

    if (subCategoriesError || !subCategories) {
        console.error("chatbot sub_categories error:", subCategoriesError);
        return { candidates: [], details, hasFeatured, hasMustVisit };
    }

    const candidates: CategoryCandidate[] = subCategories
        .filter(
            (sc): sc is typeof sc & { type: "info" | "location" } =>
                sc.type === "info" || sc.type === "location",
        )
        .map((sc) => ({
            subCategoryId: sc.id,
            name: sc.name,
            type: sc.type,
        }));

    return { candidates, details, hasFeatured, hasMustVisit };
}
