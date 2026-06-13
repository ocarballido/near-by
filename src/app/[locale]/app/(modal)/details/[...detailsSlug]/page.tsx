import { notFound, redirect } from "next/navigation";
import { createSSRClient } from "@/lib/supabase/server";
import { createServerAdminClient } from "@/lib/supabase/serverAdminClient";
import ExploreDetailsEditor from "@/components/organisms/explore-details-editor";
import { PropertyDetailRow } from "@/types/property-details";
import type { DetailFieldsetState } from "@/components/molecules/explore-detail-fieldset";

type PageProps = {
    params: Promise<{ detailsSlug: string[] }>;
};

function rowToFieldset(row: PropertyDetailRow): DetailFieldsetState {
    return {
        localId: row.id,
        dbId: row.id,
        name: row.name,
        instructions: row.instructions ?? "",
        guidelines: row.guidelines ?? "",
        predefinedKey: row.predefined_key,
        orderIndex: row.order_index,
        isDirty: false,
    };
}

export default async function DetailsPage({ params }: PageProps) {
    const { detailsSlug } = await params;
    const [propertyId, categoryId, subCategoryId] = detailsSlug ?? [];

    if (!propertyId || !categoryId || !subCategoryId) return notFound();

    const ssrClient = await createSSRClient();
    const {
        data: { user },
        error: authError,
    } = await ssrClient.auth.getUser();

    if (authError || !user) redirect("/auth/login");

    const supabase = await createServerAdminClient();

    const { data: property } = await supabase
        .from("properties")
        .select("user_id")
        .eq("id", propertyId)
        .single()
        .overrideTypes<{ user_id: string }, { merge: false }>();

    if (!property || property.user_id !== user.id) return notFound();

    const { data } = await supabase
        .from("property_details")
        .select(
            "id,property_id,name,instructions,guidelines,image_url,predefined_key,order_index,created_at,updated_at",
        )
        .eq("property_id", propertyId)
        .order("order_index", { ascending: true })
        .returns<PropertyDetailRow[]>();

    const initialFieldsets = (data ?? []).map(rowToFieldset);

    return (
        <ExploreDetailsEditor
            propertyId={propertyId}
            categoryId={categoryId}
            subCategoryId={subCategoryId}
            initialFieldsets={initialFieldsets}
        />
    );
}
