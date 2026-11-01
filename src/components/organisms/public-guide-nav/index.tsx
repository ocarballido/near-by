import { useTranslations } from "next-intl";

import IconHome from "@/components/atoms/icon/home";
import IconApartment from "@/components/atoms/icon/apartment";
import IconLocationOn from "@/components/atoms/icon/location-on";
import IconMap from "@/components/atoms/icon/map";
import BottomNavItem from "@/components/molecules/bottom-nav-item";

export type PublicNavItemId = "welcome" | "lodging" | "places" | "plans";

export type PublicNavItem = {
    id: PublicNavItemId;
    href: string;
    active: boolean;
};

type PublicGuideNavProps = {
    items: PublicNavItem[];
    // "bottom": al pie del main (mobile/tablet); "top": bajo la cabecera (desktop)
    placement?: "top" | "bottom";
};

/**
 * Navegación principal de la guía pública.
 * Los destinos son fijos (icono y texto se resuelven aquí por id); quien
 * la renderiza decide cuáles se muestran, su href y cuál está activo.
 */
const PublicGuideNav = ({
    items,
    placement = "bottom",
}: PublicGuideNavProps) => {
    const t = useTranslations();

    const labels: Record<PublicNavItemId, string> = {
        welcome: t("guideNavHome"),
        lodging: t("El Alojamiento"),
        places: t("guideNavPlaces"),
        plans: t("guideNavPlans"),
    };

    const renderIcon = (id: PublicNavItemId, active: boolean) => {
        const color = active ? "primary" : "light";

        switch (id) {
            case "welcome":
                return <IconHome color={color} />;
            case "lodging":
                return <IconApartment color={color} />;
            case "places":
                return <IconLocationOn color={color} />;
            case "plans":
                return <IconMap color={color} />;
        }
    };

    return (
        <nav
            aria-label={t("guideNavLabel")}
            className={
                placement === "top"
                    ? "shrink-0 flex justify-center bg-white shadow-xs py-1"
                    : "shrink-0 flex justify-center shadow-nav-up py-1"
            }
        >
            <ul className="flex gap-1 w-full max-w-[1140px] lg:px-4">
                {items.map((item) => (
                    <li key={item.id} className="flex-1 min-w-0">
                        <BottomNavItem
                            href={item.href}
                            active={item.active}
                            label={labels[item.id]}
                            icon={renderIcon(item.id, item.active)}
                        />
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default PublicGuideNav;
