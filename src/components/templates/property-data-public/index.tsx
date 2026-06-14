"use client";

import PublicLocationContent from "../public-location-content";

export type PropertyDataItem = {
    id: string;
    name: string;
    address: string;
    description?: string;
    image_url?: string;
    latitude?: number;
    longitude?: number;
    type?: "info" | "location";
    featured?: boolean;
    must_visit?: boolean;
    sub_category_name?: string;
    category_id?: string | null;
    icon?: string | null;
};

export function PropertyDataPublicBySubCategory({
    propertyData,
    sub_category_name,
    categoryId,
    subCategoryId,
    hasTranslations,
    showBadge,
}: {
    propertyData: PropertyDataItem[];
    type: string;
    sub_category_name?: string;
    categoryId?: string;
    subCategoryId?: string;
    lat: number;
    lng: number;
    hasTranslations?: boolean;
    showBadge?: boolean;
}) {
    return (
        <PublicLocationContent
            locations={propertyData}
            sub_category_name={sub_category_name}
            categoryId={categoryId}
            subCategoryId={subCategoryId}
            hasTranslations={hasTranslations}
            showBadge={showBadge}
        />
    );
}
