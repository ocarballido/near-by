import { notFound, redirect } from "next/navigation";

import MagicFinderForm from "@/components/organisms/form/magic-finder";
import { createSSRClient } from "@/lib/supabase/server";
import AppContentTemplate from "@/components/templates/app-content";

type PageProps = {
    params: Promise<{ magicFinderSlug: string[] }>;
};

export default async function LocationPage({ params }: PageProps) {
    const { magicFinderSlug } = await params;
    const [propertyId, lat, lng, categoryId, subCategoryId] = magicFinderSlug;

    if (
        !propertyId ||
        !lat ||
        !lng ||
        !categoryId ||
        !subCategoryId ||
        !magicFinderSlug
    ) {
        return notFound();
    }

    if (magicFinderSlug.length > 6) {
        return notFound();
    }

    // ✅ Auth (cookie-based)
    const supabase = await createSSRClient();
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) redirect("/auth/login");

    // ✅ Ownership guard (RLS should ensure only your properties are readable)
    const { data: property, error: propErr } = await supabase
        .from("properties")
        .select("id")
        .eq("id", propertyId)
        .single()
        .overrideTypes<{ id: string }, { merge: false }>();

    if (propErr || !property?.id) return notFound();

    return (
        <AppContentTemplate showSidebar={false}>
            <div className="p-1.5 font-roboto flex flex-col grow items-center gap-3 py-6">
                <MagicFinderForm
                    propertyId={propertyId}
                    categoryId={categoryId}
                    subCategoryId={subCategoryId}
                    lat={lat}
                    lng={lng}
                />
            </div>
        </AppContentTemplate>
    );
}
