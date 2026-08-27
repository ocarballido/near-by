import { useTranslations } from "next-intl";

import { GOOGLE_MAPS_DIRECTION_URL } from "@/config/config-constants";

import Image from "next/image";
import IconDirections from "@/components/atoms/icon/directions";
import ButtonLink from "../../button-link";
import Typography from "@/components/atoms/typography";
import IconLocationOn from "@/components/atoms/icon/location-on";
import IconModeHeat from "@/components/atoms/icon/mode-heat";
import IconFavorite from "@/components/atoms/icon/favorite";
import IconInfo from "@/components/atoms/icon/info";

import IconApartment from "@/components/atoms/icon/apartment";
import IconHealing from "@/components/atoms/icon/healing";
import IconForkSpoon from "@/components/atoms/icon/fork-spoon";
import IconMuseum from "@/components/atoms/icon/museum";
import IconNature from "@/components/atoms/icon/nature";
import IconLocalAtm from "@/components/atoms/icon/local-atm";
import IconTrain from "@/components/atoms/icon/train";
import IconNightLife from "@/components/atoms/icon/nightlife";
import IconComedyMask from "@/components/atoms/icon/comedy-mask";
import IconEmergency from "@/components/atoms/icon/e911-emergency";
import IconFamilyRestroom from "@/components/atoms/icon/family-restroom";
import IconPets from "@/components/atoms/icon/pets";
import IconInterests from "@/components/atoms/icon/interests";
import IconShoppingBag from "@/components/atoms/icon/shopping-bag";

import { CATEGORIES_SUB_CATEGORIES } from "@/config/config-constants";

type CategoryKey = keyof typeof CATEGORIES_SUB_CATEGORIES;
type CategoryId = (typeof CATEGORIES_SUB_CATEGORIES)[CategoryKey]["id"];

const {
    HEALTH_AND_WELLNESS,
    FOOD_AND_DRINK,
    ARTS_AND_CULTURE,
    PARKS_AND_NATURE,
    SHOPPING,
    SERVICES,
    TRANSPORTATION,
    ENTERTAINMENT_AND_NIGHTLIFE,
    ATTRACTIONS_AND_TOURISM,
    SECURITY_AND_EMERGENCIES,
    FAMILY_AND_KIDS,
    PETS,
} = CATEGORIES_SUB_CATEGORIES;

const DEFAULT_PLACEHOLDER =
    "/static/img/place-placeholder/place_placeholder_04.webp";

const CATEGORY_PLACEHOLDER = {
    [HEALTH_AND_WELLNESS.id]:
        "/static/img/place-placeholder/place_placeholder_01.webp",
    [FOOD_AND_DRINK.id]:
        "/static/img/place-placeholder/place_placeholder_09.webp",
    [ARTS_AND_CULTURE.id]:
        "/static/img/place-placeholder/place_placeholder_04.webp",
    [PARKS_AND_NATURE.id]:
        "/static/img/place-placeholder/place_placeholder_08.webp",
    [SHOPPING.id]: "/static/img/place-placeholder/place_placeholder_12.webp",
    [SERVICES.id]: "/static/img/place-placeholder/place_placeholder_05.webp",
    [TRANSPORTATION.id]:
        "/static/img/place-placeholder/place_placeholder_11.webp",
    [ENTERTAINMENT_AND_NIGHTLIFE.id]:
        "/static/img/place-placeholder/place_placeholder_07.webp",
    [ATTRACTIONS_AND_TOURISM.id]:
        "/static/img/place-placeholder/place_placeholder_06.webp",
    [SECURITY_AND_EMERGENCIES.id]:
        "/static/img/place-placeholder/place_placeholder_01.webp",
    [FAMILY_AND_KIDS.id]:
        "/static/img/place-placeholder/place_placeholder_08.webp",
    [PETS.id]: "/static/img/place-placeholder/place_placeholder_10.webp",
} satisfies Record<CategoryId, string>;

// Type guard: convierte string -> CategoryId cuando corresponde
const isCategoryId = (value: string): value is CategoryId => {
    return Object.prototype.hasOwnProperty.call(CATEGORY_PLACEHOLDER, value);
};

const getPlaceholderImage = (categoryId?: string): string => {
    if (categoryId && isCategoryId(categoryId)) {
        return CATEGORY_PLACEHOLDER[categoryId];
    }
    return DEFAULT_PLACEHOLDER;
};

const ICON_COMPONENTS = {
    IconHealing,
    IconForkSpoon,
    IconApartment,
    IconMuseum,
    IconNature,
    IconLocalAtm,
    IconTrain,
    IconNightLife,
    IconComedyMask,
    IconEmergency,
    IconFamilyRestroom,
    IconPets,
    IconInterests,
    IconShoppingBag,
} as const;

type IconName = keyof typeof ICON_COMPONENTS;

const isIconName = (value: string): value is IconName => {
    return Object.prototype.hasOwnProperty.call(ICON_COMPONENTS, value);
};

type PlacePublicProps = {
    address: string;
    categoryId?: string;
    icon?: string;
    showBadge?: boolean;
    sub_category_name?: string;
    description?: string;
    latitude?: number;
    longitude?: number;
    featured?: boolean;
    mustSee?: boolean;
    image?: string;
    name: string;
};

const PlacePublic = ({
    address,
    categoryId,
    icon,
    showBadge = false,
    description,
    latitude,
    longitude,
    featured,
    mustSee,
    name,
    image,
    sub_category_name,
}: PlacePublicProps) => {
    const t = useTranslations();

    const graySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><rect width="4" height="4" fill="#a3e7d0" /></svg>`;
    const grayDataUrl = `data:image/svg+xml;base64,${Buffer.from(
        graySvg,
    ).toString("base64")}`;

    const src = image ?? getPlaceholderImage(categoryId);

    const CategoryIcon =
        icon && isIconName(icon) ? ICON_COMPONENTS[icon] : null;

    return (
        <div
            className={`relative flex flex-col justify-start rounded-2xl overflow-hidden shadow-xs bg-white h-fit`}
        >
            {/* <Image
                className="absolute inset-0 object-cover z-0"
                src={src}
                fill={true}
                placeholder="blur"
                blurDataURL={grayDataUrl}
                alt={name}
            /> */}
            <div className="aspect-[4/3] p-1 overflow-hidden relative rounded-xl mx-1 mt-1 bg-gradient-to-tr from-[#ffa263] to-[#6cffc9]">
                <Image
                    className="absolute inset-0 object-cover z-0"
                    src={src}
                    fill={true}
                    placeholder="blur"
                    blurDataURL={grayDataUrl}
                    alt={name}
                />
            </div>

            {(mustSee || featured) && (
                <div className="flex p-1 items-center absolute z-5 rounded-full right-2 left-2 top-2 justify-between gap-1">
                    {showBadge ? (
                        <div className="px-0.5 pe-2 py-0.5 flex gap-1.5 items-center rounded-full w-fit h-fit bg-white shadow-xs">
                            <div className="flex justify-center items-center p-1.5 rounded-full bg-primary-400">
                                {CategoryIcon && (
                                    <CategoryIcon color="white" size={18} />
                                )}
                            </div>
                            <span className="text-xs font-medium truncate">
                                {sub_category_name && t(sub_category_name)}
                            </span>
                        </div>
                    ) : (
                        <div />
                    )}
                    <div className="flex items-center gap-1">
                        {mustSee && (
                            <div className="p-1.5 flex gap-1 items-center rounded-full w-fit h-fit bg-white shadow-xs">
                                <IconModeHeat color="error" size={20} />
                            </div>
                        )}
                        {featured && (
                            <div className="p-1.5 flex gap-1 items-center rounded-full w-fit h-fit bg-white shadow-xs">
                                <IconFavorite color="primary" size={20} />
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="relative w-full px-5 pb-6 pt-4 flex flex-col gap-3">
                <div className="flex gap-2">
                    <Typography component="h5">{name}</Typography>
                </div>
                <div className="flex gap-1.5 items-center">
                    <span className="grow-0 p-1.5 bg-primary-100 rounded-full h-fit">
                        <IconLocationOn color="primary" size={18} />
                    </span>
                    <Typography size="sm" weight="medium" color="text-gray-600">
                        {address}
                    </Typography>
                </div>
                {description && (
                    <div className="flex gap-1.5">
                        <span className="grow-0 p-1.5 bg-primary-100 rounded-full h-fit">
                            <IconInfo color="primary" size={18} />
                        </span>
                        <Typography
                            weight="normal"
                            size="sm"
                            color="text-gray-500"
                        >
                            {description}
                        </Typography>
                    </div>
                )}
                <ButtonLink
                    className="w-full mt-2"
                    color="primary"
                    iconLeft={<IconDirections />}
                    label={t("Como llegar")}
                    href={`${GOOGLE_MAPS_DIRECTION_URL}${latitude},${longitude}`}
                    target="_blank"
                />
            </div>
        </div>
    );
};

export default PlacePublic;
