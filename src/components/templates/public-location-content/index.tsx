import { useTranslations } from "next-intl";
import PlacePublic from "@/components/molecules/card/place-public";
import Typography from "@/components/atoms/typography";

import { PropertyDataItem } from "../property-data-public";

const PublicLocationContent = ({
    sub_category_name,
    categoryId,
    subCategoryId,
    locations = [],
    hasTranslations,
    showBadge = false,
}: {
    locations: PropertyDataItem[];
    sub_category_name?: string;
    categoryId?: string;
    subCategoryId?: string;
    hasTranslations?: boolean;
    showBadge?: boolean;
}) => {
    const t = useTranslations();

    const seoText = subCategoryId
        ? t.has(`seoSubCategory.${subCategoryId}`)
            ? t(`seoSubCategory.${subCategoryId}`)
            : null
        : null;

    return (
        <div className="flex flex-col gap-3">
            {sub_category_name && (
                <Typography component="h2" size="lg">
                    {t(sub_category_name)}
                </Typography>
            )}
            {seoText && <Typography>{seoText}</Typography>}
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 auto-rows-min">
                {locations.map((loc) => (
                    <PlacePublic
                        key={loc.id}
                        name={loc.name}
                        categoryId={loc.category_id ?? categoryId ?? undefined}
                        icon={loc.icon ?? undefined}
                        showBadge={showBadge}
                        sub_category_name={
                            loc.sub_category_name ?? sub_category_name
                        }
                        description={loc.description}
                        latitude={loc.latitude}
                        longitude={loc.longitude}
                        address={loc.address}
                        featured={loc.featured}
                        mustSee={loc.must_visit}
                        image={loc.image_url}
                    />
                ))}
            </div>
            {hasTranslations && (
                <p className="text-xs text-gray-400 text-center mt-2">
                    🌐 {t("Traducido automáticamente")}
                </p>
            )}
        </div>
    );
};

export default PublicLocationContent;
