import { PropertyDataPublicBySubCategory } from "@/components/templates/property-data-public";
import type { fetchSubcategoryPageData } from "./_data";

type Props = {
    data: Awaited<ReturnType<typeof fetchSubcategoryPageData>>;
    categoryId: string;
    subCategoryId: string;
    lat: number;
    lng: number;
};

// Los datos llegan resueltos desde el Promise.all de la página
export default function SubcategorySection({
    data,
    categoryId,
    subCategoryId,
    lat,
    lng,
}: Props) {
    return (
        <section className="p-4 md:p-5">
            <PropertyDataPublicBySubCategory
                propertyData={data.propertyData}
                type={data.categoryType.type ?? "location"}
                lat={lat}
                categoryId={categoryId}
                subCategoryId={subCategoryId}
                lng={lng}
                sub_category_name={data.subCategory.name}
                hasTranslations={data.hasTranslations}
            />
        </section>
    );
}
