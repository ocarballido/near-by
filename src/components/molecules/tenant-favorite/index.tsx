"use client";

import { useTranslations } from "next-intl";
import clsx from "clsx";

import IconNewRelease from "@/components/atoms/icon/new-releases";
import { useSavedPlaces } from "@/lib/context/SavedPlacesContext";

type TenantFavoriteProps = {
    placeId: string;
};

const TenantFavorite = ({ placeId }: TenantFavoriteProps) => {
    const t = useTranslations();
    const { available, getStatus, toggleSaved } = useSavedPlaces();

    // Sin cookies no hay forma de recordar la lista
    if (!available) return null;

    const status = getStatus(placeId);
    // No llega a pasar: "shared" (enlace en solo lectura) solo existe sin
    // cookies y eso ya sale arriba. Está para que labels[status] no necesite
    // el estado de solo lectura
    if (status === "shared") return null;
    // Solo cambia a Guardado/Guardar cuando el servidor lo confirma
    const pending = status === "saving" || status === "removing";

    const labels = {
        saved: t("tenantFavoriteSaved"),
        unsaved: t("tenantFavoriteSave"),
        saving: t("tenantFavoriteSaving"),
        removing: t("tenantFavoriteRemoving"),
    };

    return (
        <button
            type="button"
            onClick={() => toggleSaved(placeId)}
            // aria-disabled y no disabled: un botón deshabilitado pierde el
            // foco y quien usa teclado volvería al principio de la página.
            // toggleSaved ya ignora los toques mientras está pendiente
            aria-disabled={pending}
            aria-busy={pending}
            aria-pressed={status === "saved" || status === "removing"}
            className={clsx(
                "flex items-center gap-1 p-1.5 pe-3 rounded-full w-fit h-fit bg-white shadow-xs",
                pending ? "cursor-default" : "hover:cursor-pointer",
            )}
        >
            {pending ? (
                // Mismo hueco que el icono; sin animación si el sistema pide
                // reducir el movimiento (el texto ya indica el estado)
                <span
                    aria-hidden="true"
                    className="size-5 p-0.5 flex items-center justify-center"
                >
                    <span className="size-full rounded-full border-2 border-gray-300 border-t-gray-600 motion-safe:animate-spin" />
                </span>
            ) : status === "saved" ? (
                <IconNewRelease color="warning" size={20} />
            ) : (
                // La clase semántica del icono no admite opacidad: va en el contenedor
                <span className="flex opacity-30">
                    <IconNewRelease color="light" size={20} />
                </span>
            )}
            <span className="text-xs leading-3.5 font-medium text-gray-600">
                {labels[status]}
            </span>
        </button>
    );
};

export default TenantFavorite;
