import { useTranslations } from "next-intl";
import { PropertyDataItem } from "../property-data-public";
import Typography from "@/components/atoms/typography";
import Button from "@/components/molecules/button";
import ButtonLink from "@/components/molecules/button-link";
import IconEdit from "@/components/atoms/icon/edit";

export interface PropertyInfo {
    id: string;
    name: string;
    address: string;
    description?: string;
    image_url: string;
    latitude?: number;
    longitude?: number;
    type?: string;
    featured?: boolean;
    mustSee?: boolean;
}

interface PropertyInfoProps {
    infos: PropertyDataItem[];
    sub_category_name?: string;
    categoryId?: string;
    subCategoryId?: string;
    propertyId?: string;
}

export function PropertyInfoContent({
    infos,
    sub_category_name,
    categoryId,
    subCategoryId,
    propertyId,
}: PropertyInfoProps) {
    const t = useTranslations();

    let info;

    if (infos) {
        info = infos[0];
    }

    return (
        <>
            {info?.description && (
                <>
                    {sub_category_name && (
                        <Typography component="h2" size="lg">
                            {t(sub_category_name)}
                        </Typography>
                    )}
                    <div className="flex justify-start">
                        <ButtonLink
                            label={t("Editar")}
                            iconLeft={<IconEdit />}
                            color="primary"
                            href={`/app/info/${propertyId}/${categoryId}/${subCategoryId}`}
                        />
                    </div>
                    <div className="font-medium whitespace-pre-wrap">
                        {info?.description}
                    </div>
                </>
            )}
        </>
    );
}
