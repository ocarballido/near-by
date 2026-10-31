import { getTranslations } from "next-intl/server";

import { CATEGORIES_SUB_CATEGORIES } from "@/config/config-constants";

import PropertyInfo, {
    type PropertyStatus,
} from "@/components/molecules/property-info";
import ButtonLink from "@/components/molecules/button-link";
import IconArrowRightAlt from "@/components/atoms/icon/arrow-right-alt";

const MAX_PROPERTIES = 3;

type MyPropertiesItem = {
    id: string;
    name: string;
    image: string | null;
    status: PropertyStatus;
};

type MyPropertiesProps = {
    properties: MyPropertiesItem[];
};

const MyProperties = async ({ properties }: MyPropertiesProps) => {
    const t = await getTranslations();

    return (
        <div className="flex flex-col gap-4 items-start p-4 rounded-2xl bg-white shadow-xs">
            <h2 className="font-heading font-bold text-sm leading-4 text-gray-800">
                {t("Mis propiedades")}
            </h2>

            <ul className="flex flex-col gap-1 w-full mb-auto">
                {properties.slice(0, MAX_PROPERTIES).map((property) => (
                    <li key={property.id}>
                        <PropertyInfo
                            image={property.image}
                            name={property.name}
                            status={property.status}
                            href={`/app/properties/${property.id}/${CATEGORIES_SUB_CATEGORIES.LODGING.id}/${CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.MANUAL.id}`}
                        />
                    </li>
                ))}
            </ul>

            <ButtonLink
                label={t("Mis propiedades")}
                href="/app/properties"
                color="white"
                iconRight={<IconArrowRightAlt />}
            />
        </div>
    );
};

export default MyProperties;
