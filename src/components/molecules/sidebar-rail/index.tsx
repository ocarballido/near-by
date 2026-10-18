import clsx from "clsx";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/routing";
import IconMenu from "@/components/atoms/icon/menu";

import styles from "./styles.module.css";

export type SidebarRailItem = {
    id: string;
    label: string;
    icon: React.ReactNode;
    active?: boolean;
    // Con href el item navega directamente en lugar de llamar a onItemClick
    href?: string;
};

type SidebarRailProps = {
    items: SidebarRailItem[];
    isExpanded: boolean;
    controlsId: string;
    onMenuClick: () => void;
    onItemClick: (id: string) => void;
    className?: string;
};

/**
 * Versión compacta del sidebar (solo iconos) para tablet. No gestiona
 * estado propio: el menú y cada item delegan en el sidebar que lo
 * renderiza, que abre el overlay (con la sección desplegada, en el
 * caso de los items). Los items con `href` son enlaces de navegación.
 */
const SidebarRail = ({
    items,
    isExpanded,
    controlsId,
    onMenuClick,
    onItemClick,
    className = "",
}: SidebarRailProps) => {
    const t = useTranslations();

    return (
        <nav
            aria-label={t("Menú")}
            className={`flex flex-col items-center gap-2 ${className}`}
        >
            <button
                type="button"
                onClick={onMenuClick}
                aria-label={t("Abrir menú")}
                aria-expanded={isExpanded}
                aria-controls={controlsId}
                className={`flex items-center justify-center p-2 my-1 rounded-full cursor-pointer transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${styles["icon--light"]}`}
            >
                <IconMenu />
            </button>
            {items.map((item) => {
                const itemStyles = clsx(
                    "flex items-center justify-center p-2 my-1 rounded-full cursor-pointer transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
                    item.active
                        ? `bg-white ${styles["icon--primary"]}`
                        : styles["icon--light"],
                );

                if (item.href !== undefined) {
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            aria-label={item.label}
                            aria-current={item.active ? "page" : undefined}
                            className={itemStyles}
                        >
                            {item.icon}
                        </Link>
                    );
                }

                return (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => onItemClick(item.id)}
                        aria-label={item.label}
                        aria-current={item.active ? "true" : undefined}
                        className={itemStyles}
                    >
                        {item.icon}
                    </button>
                );
            })}
        </nav>
    );
};

export default SidebarRail;
