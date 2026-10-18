import clsx from "clsx";

import { useTranslations } from "next-intl";

import IconMenu from "@/components/atoms/icon/menu";

import styles from "./styles.module.css";

export type SidebarRailItem = {
    id: string;
    label: string;
    icon: React.ReactNode;
    active?: boolean;
};

type SidebarRailProps = {
    items: SidebarRailItem[];
    isExpanded: boolean;
    onMenuClick: () => void;
    onItemClick: (id: string) => void;
    className?: string;
};

/**
 * Versión compacta del sidebar (solo iconos) para tablet. No gestiona
 * estado propio: el menú y cada item delegan en el sidebar que lo
 * renderiza, que abre el overlay (con la sección desplegada, en el
 * caso de los items).
 */
const SidebarRail = ({
    items,
    isExpanded,
    onMenuClick,
    onItemClick,
    className = "",
}: SidebarRailProps) => {
    const t = useTranslations();

    return (
        <nav
            aria-label={t("Menú")}
            className={`flex-col items-center gap-2 ${className}`}
        >
            <button
                type="button"
                onClick={onMenuClick}
                aria-label={t("Abrir menú")}
                aria-expanded={isExpanded}
                className={`flex items-center justify-center p-2 my-1 rounded-full cursor-pointer transition-all ${styles["icon--light"]}`}
            >
                <IconMenu />
            </button>
            {items.map((item) => (
                <button
                    key={item.id}
                    type="button"
                    onClick={() => onItemClick(item.id)}
                    aria-label={item.label}
                    aria-current={item.active ? "true" : undefined}
                    className={clsx(
                        "flex items-center justify-center p-2 my-1 rounded-full cursor-pointer transition-all",
                        item.active
                            ? `bg-white ${styles["icon--primary"]}`
                            : styles["icon--light"],
                    )}
                >
                    {item.icon}
                </button>
            ))}
        </nav>
    );
};

export default SidebarRail;
