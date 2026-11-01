import clsx from "clsx";

import { Link } from "@/i18n/routing";

type BottomNavItemProps = {
    label: string;
    // Ya coloreado por quien lo renderiza, según `active`
    icon: React.ReactNode;
    active?: boolean;
} & (
    // Enlace: navega a href
    | {
          href: string;
          onClick?: never;
          controlsId?: never;
          expanded?: never;
      }
    // Botón: llama a onClick; controlsId y expanded, el panel que abre
    | {
          href?: never;
          onClick: () => void;
          controlsId?: string;
          expanded?: boolean;
      }
);

/**
 * Item de las barras de navegación de la guía pública (abajo hasta `lg`,
 * arriba desde ahí) y de la gestión de la propiedad (abajo, solo mobile):
 * icono en una píldora y el texto debajo.
 */
const BottomNavItem = ({
    label,
    icon,
    active = false,
    href,
    onClick,
    controlsId,
    expanded,
}: BottomNavItemProps) => {
    const itemStyles =
        "group flex flex-col gap-1 items-center justify-center w-full min-h-10 px-1 py-2 rounded-xl cursor-pointer font-body font-medium text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 md:px-4";

    const content = (
        <>
            <span
                className={clsx(
                    "flex items-center px-3 py-1 rounded-full transition-colors",
                    active ? "bg-primary-100" : "group-hover:bg-gray-100",
                )}
            >
                {icon}
            </span>
            <span
                className={clsx(
                    "text-xs whitespace-nowrap md:text-sm md:leading-4",
                    active ? "text-primary-600" : "text-gray-600",
                )}
            >
                {label}
            </span>
        </>
    );

    if (href !== undefined) {
        return (
            <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={itemStyles}
            >
                {content}
            </Link>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            aria-expanded={expanded}
            aria-controls={controlsId}
            className={itemStyles}
        >
            {content}
        </button>
    );
};

export default BottomNavItem;
