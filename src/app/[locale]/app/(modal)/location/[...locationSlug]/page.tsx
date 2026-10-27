import { notFound, redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

import AddPlaceForm, {
    type EditLocationInitialValues,
} from "@/components/organisms/form/place";
import { getPlaceRecommendations } from "@/app/actions/locations/get-recommendations";
import { createSSRClient } from "@/lib/supabase/server";
import AppContentTemplate from "@/components/templates/app-content";

import type { Tables } from "@/lib/types";

export default async function LocationPage({
    params,
    searchParams,
}: PageProps) {
    const { locationSlug } = await params;
    const { edit } = await searchParams;
    const locationId = typeof edit === "string" ? edit : undefined;
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

    // Modo edición (?edit=<locationId>): el sitio tiene que pertenecer a
    // esta propiedad y subcategoría (RLS ya limita a las propias)
    if (locationId) {
        type LocationRow = Pick<
            Tables<"property_data">,
            | "name"
            | "address"
            | "description"
            | "image_url"
            | "featured"
            | "must_visit"
        >;

        const { data: location, error: locErr } = await supabase
            .from("property_data")
            .select("name,address,description,image_url,featured,must_visit")
            .eq("id", locationId)
            .eq("property_id", propertyId)
            .eq("sub_category_id", subCategoryId)
            .eq("type", "location")
            .maybeSingle()
            .overrideTypes<LocationRow, { merge: false }>();

        if (locErr || !location) return notFound();

        const initialValues: EditLocationInitialValues = {
            name: location.name ?? "",
            address: location.address ?? "",
            description: location.description ?? "",
            image_url: location.image_url ?? null,
            featured: location.featured ?? false,
            must_visit: location.must_visit ?? false,
        };

        return (
            <AppContentTemplate showSidebar={false}>
                <div className="font-roboto flex flex-col grow items-center gap-3 sm:py-6">
                    <AddPlaceForm
                        propertyId={propertyId}
                        categoryId={categoryId}
                        subCategoryId={subCategoryId}
                        locationId={locationId}
                        initialValues={initialValues}
                    />
                </div>
            </AppContentTemplate>
        );
    }

    const locale = await getLocale();

    const recoRes = await getPlaceRecommendations(
        propertyId,
        subCategoryId,
        locale,
    );
    const initialRecos = recoRes?.success ? recoRes.data : [];

    return (
        <AppContentTemplate showSidebar={false}>
            <div className="font-roboto flex flex-col grow items-center gap-3 sm:py-6">
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
    searchParams: Promise<{ edit?: string | string[] }>;
};
