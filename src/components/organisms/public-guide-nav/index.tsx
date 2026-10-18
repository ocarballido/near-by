import clsx from "clsx";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/routing";
import IconHome from "@/components/atoms/icon/home";
import IconApartment from "@/components/atoms/icon/apartment";
import IconLocationOn from "@/components/atoms/icon/location-on";
import IconMap from "@/components/atoms/icon/map";

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
                    : "shrink-0 flex justify-center shadow-[0_-1px_2px_var(--tw-shadow-color,rgba(0,0,0,0.10))] py-1"
            }
        >
            <ul className="flex gap-1 w-full max-w-[1140px] lg:px-4">
                {items.map((item) => (
                    <li key={item.id} className="flex-1 min-w-0">
                        <Link
                            href={item.href}
                            aria-current={item.active ? "page" : undefined}
                            className="group flex flex-col gap-1 items-center justify-center min-h-10 px-1 py-2 rounded-xl cursor-pointer font-body font-medium text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 md:px-4"
                        >
                            <span
                                className={clsx(
                                    "flex items-center px-3 py-1 rounded-full transition-colors",
                                    item.active
                                        ? "bg-primary-100"
                                        : "group-hover:bg-gray-100",
                                )}
                            >
                                {renderIcon(item.id, item.active)}
                            </span>
                            <span
                                className={clsx(
                                    "text-xs whitespace-nowrap md:text-sm md:leading-4",
                                    item.active
                                        ? "text-primary-600"
                                        : "text-gray-600",
                                )}
                            >
                                {labels[item.id]}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default PublicGuideNav;
