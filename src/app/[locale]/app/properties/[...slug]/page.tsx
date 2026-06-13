import { notFound, redirect } from "next/navigation";
import { createServerAdminClient } from "@/lib/supabase/serverAdminClient";
import { createSSRClient } from "@/lib/supabase/server";

import AppContentTemplate from "@/components/templates/app-content";
import PropertyNameTitle from "@/components/atoms/property-name-title";
import PropertyDataBoard from "@/components/molecules/property-data-board";
import { PropertyDataBySubCategory } from "@/components/templates/property-data";

import { getPropertySubCategoryCounts } from "@/utils/get-property-subcategory-counts";
import PropertyCountsBootstrap from "@/components/providers/PropertyCountsBootstrap";

import { CATEGORIES_SUB_CATEGORIES } from "@/config/config-constants";
import type { PropertyDetailRow } from "@/types/property-details";

import type { Tables } from "@/lib/types";

type FullProperty = Tables<"properties">;
type SubCategoryForPage = Pick<
    Tables<"sub_categories">,
    "name" | "type" | "category_id"
>;

type PageProps = {
    params: Promise<{ slug: string[] }>;
};

export default async function Property({ params }: PageProps) {
    const { slug } = await params;
    const [propertyId, categoryId, subCategoryId] = slug;

    const isExploreDetails =
        subCategoryId ===
        CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.EXPLORE_DETAILS.id;

    const ssrClient = await createSSRClient();
    const {
        data: { user },
        error: authError,
    } = await ssrClient.auth.getUser();

    if (authError || !user) redirect("/auth/login");

    const supabase = await createServerAdminClient();

    const { data: property, error: propErr } = await supabase
        .from("properties")
        .select(
            "id,name,slug,image_url,address,latitude,longitude,check_in_date,check_in_time,check_out_date,check_out_time,user_id",
        )
        .eq("id", propertyId)
        .single()
        .overrideTypes<FullProperty & { user_id: string }, { merge: false }>();

    if (propErr || !property?.id) notFound();

    if (property.user_id !== user.id) notFound();

    const [
        { data: propertyData, error: propertyDataErr },
        { data: subCategory, error: subCategoryErr },
        counts,
        { data: propertyDetails },
    ] = await Promise.all([
        supabase
            .from("property_data")
            .select(
                "id,name,description,image_url,type,latitude,longitude,featured,address,must_visit",
            )
            .eq("property_id", propertyId)
            .eq("sub_category_id", subCategoryId)
            .order("featured", { ascending: false })
            .order("must_visit", { ascending: false })
            .order("name", { ascending: true }),
        supabase
            .from("sub_categories")
            .select("name,type,category_id")
            .eq("id", subCategoryId)
            .single()
            .overrideTypes<SubCategoryForPage, { merge: false }>(),
        getPropertySubCategoryCounts(propertyId),
        isExploreDetails
            ? supabase
                  .from("property_details")
                  .select(
                      "id,name,instructions,guidelines,image_url,predefined_key,order_index",
                  )
                  .eq("property_id", propertyId)
                  .order("order_index", { ascending: true })
                  .overrideTypes<PropertyDetailRow[]>()
            : Promise.resolve({ data: [] as PropertyDetailRow[], error: null }),
    ]);

    if (propertyDataErr || subCategoryErr || !subCategory) notFound();

    if (subCategory.category_id !== categoryId) notFound();

    if (property.latitude == null || property.longitude == null) notFound();

    return (
        <AppContentTemplate
            sidebar="PROPERTY"
            categoryId={categoryId}
            subCategoryId={subCategoryId}
            subcategoryGroupId={subCategoryId}
            propertyId={propertyId}
        >
            <PropertyCountsBootstrap counts={counts} />
            <PropertyDataBoard
                propertyName={property.name}
                propertyAddress={property.address}
                propertyCheckInDate={property.check_in_date ?? ""}
                propertyCheckInTime={property.check_in_time ?? ""}
                propertyCheckOutDate={property.check_out_date ?? ""}
                propertyCheckOutTime={property.check_out_time ?? ""}
                propertyId={propertyId}
                categoryId={categoryId}
                subCategoryId={subCategoryId}
            />

            <div className="p-4 pt-0 font-roboto flex flex-col grow gap-4 rounded-lg overflow-hidden">
                <PropertyNameTitle subCategoryName={subCategory.name} />
                <PropertyDataBySubCategory
                    propertyId={propertyId}
                    subCategoryId={subCategoryId}
                    categoryId={categoryId}
                    type={subCategory.type ?? "location"}
                    propertyData={propertyData ?? []}
                    lat={property.latitude}
                    lng={property.longitude}
                    propertyDetails={propertyDetails ?? []}
                />
            </div>
        </AppContentTemplate>
    );
}
