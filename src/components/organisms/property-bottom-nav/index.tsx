"use client";

import { useTranslations } from "next-intl";

import { useSidebar } from "@/lib/context/SidebarContext";
import { PAGES } from "@/config/config-constants";

import IconMenu from "@/components/atoms/icon/menu";
import IconApartment from "@/components/atoms/icon/apartment";
import IconHome from "@/components/atoms/icon/home";
import BottomNavItem from "@/components/molecules/bottom-nav-item";
import { SIDEBAR_PANEL_ID } from "@/components/organisms/sidebar/sidebar-shell";

/**
 * Navegación inferior de la gestión de una propiedad, solo en mobile (desde
 * `md` la cubre el rail). "Categorías" abre el sidebar y el resto sale de
 * la propiedad, así que ningún item se marca como activo.
 */
const PropertyBottomNav = () => {
    const t = useTranslations();
    const { isOpen, openSidebar } = useSidebar();

    return (
        <nav
            aria-label={t("propertyNavLabel")}
            className="shrink-0 flex justify-center bg-white border-t border-gray-100 py-1"
        >
            <ul className="flex gap-1 w-full">
                <li className="flex-1 min-w-0">
                    <BottomNavItem
                        label={t("Categorías")}
                        icon={<IconMenu color="light" />}
                        onClick={openSidebar}
                        controlsId={SIDEBAR_PANEL_ID}
                        expanded={isOpen}
                    />
                </li>
                <li className="flex-1 min-w-0">
                    <BottomNavItem
                        href={PAGES.properties}
                        label={t("Mis propiedades")}
                        icon={<IconApartment color="light" />}
                    />
                </li>
                <li className="flex-1 min-w-0">
                    <BottomNavItem
                        href={PAGES.dashboard}
                        label={t("Inicio")}
                        icon={<IconHome color="light" />}
                    />
                </li>
            </ul>
        </nav>
    );
};

export default PropertyBottomNav;
