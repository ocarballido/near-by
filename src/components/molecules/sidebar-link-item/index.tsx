import Link from "next/link";

type SidebarLinkItemProps = {
    href: string;
    label: string;
    icon: React.ReactNode;
    onClick?: () => void;
};

/**
 * Item de navegación estático del sidebar (no proviene de sidebarData).
 * Visualmente replica a GroupItem para mantener consistencia, pero usa
 * <Link> como elemento raíz por ser una navegación real (no una acción
 * sobre un dato), lo que aporta accesibilidad (rol de enlace, apertura
 * en pestaña nueva, prefetch) y semántica correctas.
 */
const SidebarLinkItem = ({
    href,
    label,
    icon,
    onClick,
}: SidebarLinkItemProps) => {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="rounded-lg w-full transition-all flex items-center gap-4 text-secondary-600 hover:text-secondary-800 font-medium text-sm leading-4 pl-4 pr-2 min-h-10"
        >
            <span>{label}</span>
            <span
                className="shrink-0 rounded-full ms-auto text-primary-600"
                aria-hidden="true"
            >
                {icon}
            </span>
        </Link>
    );
};

export default SidebarLinkItem;
