import clsx from "clsx";

import { Link } from "@/i18n/routing";

type SearchFilterOptionProps = {
    id: string;
    label: string;
    // Opción resaltada con el teclado (aria-activedescendant del input)
    active?: boolean;
} & (
    | { href: string; onClick?: () => void }
    | { href?: never; onClick: () => void }
);

// Cmd/Ctrl/Shift/Alt + clic abren el enlace fuera de esta pestaña: la
// búsqueda debe seguir abierta, así que no cuenta como elegir la opción
const isPlainClick = (event: React.MouseEvent) =>
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey;

/**
 * Opción del dropdown de SearchFilter: enlace si tiene `href`, botón si no.
 * Es un `role="option"` del listbox (rol permitido en <a> y en <button>) y
 * queda fuera del orden de tabulación: el foco se queda en el input y el
 * teclado la recorre con aria-activedescendant. Que el clic no le quite el
 * foco al input lo resuelve SearchFilter para todo el dropdown.
 */
const SearchFilterOption = ({
    id,
    label,
    active = false,
    href,
    onClick,
}: SearchFilterOptionProps) => {
    const optionStyles = clsx(
        "flex w-full items-center min-h-10 px-4 py-2 rounded-lg text-left text-sm leading-4 font-medium text-secondary-800 cursor-pointer transition-colors hover:bg-secondary-100",
        active && "bg-secondary-100",
    );

    const content = <span className="flex-1 min-w-0 break-words">{label}</span>;

    if (href !== undefined) {
        return (
            <Link
                id={id}
                href={href}
                role="option"
                aria-selected={active}
                tabIndex={-1}
                // Los resultados cambian con cada tecla: sin prefetch de cada
                // enlace visible, igual que los items del sidebar (router.push)
                prefetch={false}
                onClick={(event) => {
                    if (isPlainClick(event)) onClick?.();
                }}
                className={optionStyles}
            >
                {content}
            </Link>
        );
    }

    return (
        <button
            id={id}
            type="button"
            role="option"
            aria-selected={active}
            tabIndex={-1}
            onClick={onClick}
            className={optionStyles}
        >
            {content}
        </button>
    );
};

export default SearchFilterOption;
