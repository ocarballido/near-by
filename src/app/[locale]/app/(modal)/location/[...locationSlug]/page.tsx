import { notFound, redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

import AddPlaceForm from "@/components/organisms/form/place";
import { getPlaceRecommendations } from "@/app/actions/locations/get-recommendations";
import { createSSRClient } from "@/lib/supabase/server";
import AppContentTemplate from "@/components/templates/app-content";

export default async function LocationPage({ params }: PageProps) {
    const { locationSlug } = await params;
    const [propertyId, categoryId, subCategoryId] = locationSlug;

    if (!propertyId || !categoryId || !subCategoryId || !locationSlug) {
        return notFound();
    }

    if (locationSlug.length > 3) {
        return notFound();
    }

    // Auth (cookie-based)
    const supabase = await createSSRClient();
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) redirect("/auth/login");

    // Ownership guard (RLS must allow reading ONLY your own properties)
    const { data: property, error: propErr } = await supabase
        .from("properties")
        .select("id")
        .eq("id", propertyId)
        .single()
        .overrideTypes<{ id: string }, { merge: false }>();

    if (propErr || !property?.id) return notFound();

    const locale = await getLocale();

    const recoRes = await getPlaceRecommendations(
        propertyId,
        subCategoryId,
        locale,
    );
    const initialRecos = recoRes?.success ? recoRes.data : [];

    return (
        <AppContentTemplate showSidebar={false}>
            <div className="p-1.5 font-roboto flex flex-col grow items-center gap-3 py-6">
                <AddPlaceForm
                    propertyId={propertyId}
                    categoryId={categoryId}
                    subCategoryId={subCategoryId}
                    initialRecos={initialRecos}
                />
            </div>
        </AppContentTemplate>
    );
}

type PageProps = {
    params: Promise<{ locationSlug: string[] }>;
};
