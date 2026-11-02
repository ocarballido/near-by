"use client";

import { useTranslations } from "next-intl";

import IconNewRelease from "@/components/atoms/icon/new-releases";
import { useSavedPlaces } from "@/lib/context/SavedPlacesContext";

type TenantFavoriteProps = {
    placeId: string;
};

const TenantFavorite = ({ placeId }: TenantFavoriteProps) => {
    const t = useTranslations();
    const { isSaved, toggleSaved } = useSavedPlaces();

    const saved = isSaved(placeId);

    return (
        <button
            type="button"
            onClick={() => toggleSaved(placeId)}
            aria-pressed={saved}
            className="flex items-center gap-1 p-1.5 pe-3 rounded-full w-fit h-fit bg-white shadow-xs hover:cursor-pointer"
        >
            {saved ? (
                <IconNewRelease color="warning" size={20} />
            ) : (
                // La clase semántica del icono no admite opacidad: va en el contenedor
                <span className="flex opacity-30">
                    <IconNewRelease color="light" size={20} />
                </span>
            )}
            <span className="text-xs leading-3.5 font-medium text-gray-600">
                {saved ? t("tenantFavoriteSaved") : t("tenantFavoriteSave")}
            </span>
        </button>
    );
};

export default TenantFavorite;
