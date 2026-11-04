"use client";

import {
    useEffect,
    useId,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import clsx from "clsx";

import { useThrottledValue } from "@/hooks/useThrottledValue";
import { filterSearchGroups } from "@/utils/filter-search-groups";

import DropdownMenu from "@/components/atoms/dropdown-menu";
import IconSearch from "@/components/atoms/icon/search";
import SearchFilterOption from "@/components/molecules/search-filter-option";
import TextField from "@/components/molecules/text-field";

// Con `href` el item es un enlace; sin él, una acción (onSelect)
export type SearchFilterItem = {
    id: string;
    // Ya traducido: se filtra por lo que ve el usuario
    label: string;
} & (
    | { href: string; onSelect?: never }
    | { onSelect: () => void; href?: never }
);

// Sin `label` el grupo no pinta cabecera (items sin parent). Una lista
// plana es un único grupo sin `label`
export type SearchFilterGroup = {
    id: string;
    label?: string;
    icon?: React.ReactNode;
    items: SearchFilterItem[];
};

type SearchFilterProps = {
    groups: SearchFilterGroup[];
    label: string;
    placeholder?: string;
    noResultsText: string;
    // Efecto común tras elegir cualquier item (p. ej. cerrar el overlay)
    onItemSelect?: (item: SearchFilterItem) => void;
};

const THROTTLE_MS = 150;

// Hueco hasta el borde inferior de la ventana: en desktop deja el dropdown
// alineado con el main (pb-4 de AppContentTemplate) y en el overlay con su p-4
const VIEWPORT_GAP_PX = 16;

// Tope mínimo: dos filas (cabecera y primera opción) con el padding del
// menú, 8 + 40 + 8 + 40 + 8. Con el teclado abierto en horizontal el hueco
// puede ser casi nulo y el dropdown quedaría en una tira vacía
const MIN_MAX_HEIGHT_PX = 104;

// Misma clave en la lista de opciones y en el render
const getOptionKey = (groupId: string, itemId: string) =>
    `${groupId}:${itemId}`;

// Clics dentro del dropdown (opciones, cabeceras, scroll) sin quitar el foco
// al input: así el blur solo llega al salir de verdad del buscador
const keepInputFocus = (event: React.MouseEvent) => event.preventDefault();

/**
 * Buscador con dropdown de resultados agrupados (patrón combobox de ARIA):
 * el foco se queda en el input, las flechas recorren las opciones,
 * Enter elige y Escape cierra. Las cabeceras de grupo no son opciones,
 * así que no se pueden elegir.
 */
const SearchFilter = ({
    groups,
    label,
    placeholder,
    noResultsText,
    onItemSelect,
}: SearchFilterProps) => {
    const baseId = useId();
    const inputId = `${baseId}-input`;
    const listboxId = `${baseId}-listbox`;
    const getOptionId = (index: number) => `${baseId}-option-${index}`;

    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // El input se actualiza en cada tecla; el filtro, como mucho cada THROTTLE_MS
    const [query, setQuery] = useState("");
    const filterQuery = useThrottledValue(query, THROTTLE_MS);

    const [isOpen, setIsOpen] = useState(false);
    // Por clave y no por índice: si el item sigue en los resultados al
    // escribir otra letra, sigue resaltado
    const [activeKey, setActiveKey] = useState<string | null>(null);
    const [maxHeight, setMaxHeight] = useState<number | null>(null);

    const results = useMemo(
        () => filterSearchGroups(groups, filterQuery),
        [groups, filterQuery],
    );

    const options = useMemo(
        () =>
            results.flatMap((group) =>
                group.items.map((item) => ({
                    key: getOptionKey(group.id, item.id),
                    item,
                })),
            ),
        [results],
    );

    // Índice de cada opción: de él salen su id y aria-activedescendant
    const optionIndexByKey = useMemo(
        () => new Map(options.map((option, index) => [option.key, index])),
        [options],
    );

    // Se cierra en cuanto se vacía el input, sin esperar al throttle. Con
    // filterQuery aún vacío (tecla dentro de la ventana) no se abre: evita
    // un "sin resultados" momentáneo
    const isDropdownVisible =
        isOpen && query.trim() !== "" && filterQuery.trim() !== "";

    const activeIndex =
        activeKey !== null ? (optionIndexByKey.get(activeKey) ?? -1) : -1;
    const activeOptionId =
        isDropdownVisible && activeIndex !== -1
            ? getOptionId(activeIndex)
            : undefined;

    const closeDropdown = () => {
        setIsOpen(false);
        setActiveKey(null);
    };

    const handleSelect = (item: SearchFilterItem) => {
        item.onSelect?.();
        setQuery("");
        closeDropdown();
        // En mobile, con el foco en el input el teclado seguiría abierto
        // tapando la página nueva mientras carga
        inputRef.current?.blur();
        onItemSelect?.(item);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        switch (event.key) {
            case "ArrowDown":
            case "ArrowUp": {
                event.preventDefault();
                if (!isDropdownVisible) {
                    setIsOpen(true);
                    return;
                }
                if (options.length === 0) return;

                const step = event.key === "ArrowDown" ? 1 : -1;
                const nextIndex =
                    activeIndex === -1
                        ? step === 1
                            ? 0
                            : options.length - 1
                        : (activeIndex + step + options.length) %
                          options.length;
                setActiveKey(options[nextIndex].key);
                return;
            }
            case "Enter": {
                if (!activeOptionId) return;
                event.preventDefault();
                // Mismo camino que el ratón: el Link navega y el botón ejecuta
                document.getElementById(activeOptionId)?.click();
                return;
            }
            case "Escape": {
                if (!isDropdownVisible) return;
                // Solo cierra el dropdown: sin esto, el listener de
                // SidebarContext también cerraría el overlay
                event.preventDefault();
                event.stopPropagation();
                closeDropdown();
                return;
            }
        }
    };

    // Clic o toque fuera. El blur no basta: en iOS tocar algo no enfocable
    // no quita el foco al input. pointerdown (no mousedown) cubre por igual
    // ratón, táctil y lápiz
    useEffect(() => {
        if (!isDropdownVisible) return;

        const handlePointerDown = (event: PointerEvent) => {
            if (!wrapperRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
                setActiveKey(null);
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);
        return () =>
            document.removeEventListener("pointerdown", handlePointerDown);
    }, [isDropdownVisible]);

    // Alto máximo: del borde inferior del campo al de la ventana visible
    // (visualViewport descuenta el teclado en mobile). Antes del primer
    // pintado, así no se ve el dropdown sin tope
    useLayoutEffect(() => {
        if (!isDropdownVisible) return;

        const updateMaxHeight = () => {
            const wrapper = wrapperRef.current;
            if (!wrapper) return;

            const viewport = window.visualViewport;
            const viewportBottom = viewport
                ? viewport.offsetTop + viewport.height
                : window.innerHeight;
            const dropdownTop = wrapper.getBoundingClientRect().bottom;

            setMaxHeight(
                Math.max(
                    MIN_MAX_HEIGHT_PX,
                    viewportBottom - dropdownTop - VIEWPORT_GAP_PX,
                ),
            );
        };

        updateMaxHeight();

        // El scroll de la propia lista no mueve el campo: no hay nada que medir
        const handleScroll = (event: Event) => {
            if (
                event.target instanceof Node &&
                wrapperRef.current?.contains(event.target)
            ) {
                return;
            }
            updateMaxHeight();
        };

        // Se recalcula si cambia la ventana visible (teclado, zoom; en iOS
        // su offsetTop cambia con "scroll") o si se desplaza algo que mueva
        // el campo, como el panel del overlay. El scroll de un contenedor no
        // burbujea: hace falta la fase de captura
        const viewport = window.visualViewport;
        const resizeTarget = viewport ?? window;
        resizeTarget.addEventListener("resize", updateMaxHeight);
        viewport?.addEventListener("scroll", updateMaxHeight);
        window.addEventListener("scroll", handleScroll, {
            capture: true,
            passive: true,
        });

        return () => {
            resizeTarget.removeEventListener("resize", updateMaxHeight);
            viewport?.removeEventListener("scroll", updateMaxHeight);
            window.removeEventListener("scroll", handleScroll, {
                capture: true,
            });
        };
    }, [isDropdownVisible]);

    // Con el teclado, la opción activa siempre a la vista
    useEffect(() => {
        if (!activeOptionId) return;
        document
            .getElementById(activeOptionId)
            ?.scrollIntoView({ block: "nearest" });
    }, [activeOptionId]);

    return (
        <div
            ref={wrapperRef}
            className="relative"
            style={
                maxHeight !== null
                    ? ({
                          "--search-filter-max-h": `${maxHeight}px`,
                      } as React.CSSProperties)
                    : undefined
            }
        >
            <TextField
                ref={inputRef}
                id={inputId}
                label={label}
                placeholder={placeholder}
                iconLeft={<IconSearch />}
                autoComplete="off"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={isDropdownVisible}
                aria-controls={listboxId}
                aria-activedescendant={activeOptionId}
                value={query}
                onChange={(event) => {
                    setQuery(event.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                // Con el foco ya en el input (tras Escape, o al tocar fuera en
                // iOS) no llega onFocus: el clic también lo reabre
                onClick={() => setIsOpen(true)}
                // Salir con Tab; los clics dentro del dropdown no llegan aquí
                onBlur={closeDropdown}
                onKeyDown={handleKeyDown}
            />

            <div onMouseDown={keepInputFocus}>
                <DropdownMenu
                    open={isDropdownVisible}
                    className="absolute inset-x-0 top-full p-2! rounded-2xl! shadow-dropdown! max-h-(--search-filter-max-h) overflow-y-auto overscroll-contain"
                >
                    <div
                        id={listboxId}
                        role="listbox"
                        aria-label={label}
                        className={clsx(
                            "flex flex-col gap-2",
                            results.length === 0 && "hidden",
                        )}
                    >
                        {results.map((group) => {
                            const headerId = `${baseId}-group-${group.id}`;

                            return (
                                // Separador entre grupos, nunca sobre el primero
                                <div
                                    key={group.id}
                                    role={group.label ? "group" : "presentation"}
                                    aria-labelledby={
                                        group.label ? headerId : undefined
                                    }
                                    className="flex flex-col gap-2 not-first:border-t not-first:border-secondary-200 not-first:pt-2"
                                >
                                    {group.label && (
                                        <div
                                            id={headerId}
                                            role="presentation"
                                            className="flex items-center gap-2 min-h-10 px-4 py-2 text-sm leading-4 font-medium text-secondary-800"
                                        >
                                            {group.icon && (
                                                <span
                                                    className="flex shrink-0"
                                                    aria-hidden="true"
                                                >
                                                    {group.icon}
                                                </span>
                                            )}
                                            <span className="flex-1 min-w-0 break-words">
                                                {group.label}
                                            </span>
                                        </div>
                                    )}
                                    {group.items.map((item) => {
                                        const optionIndex =
                                            optionIndexByKey.get(
                                                getOptionKey(group.id, item.id),
                                            ) ?? -1;
                                        const optionProps = {
                                            id: getOptionId(optionIndex),
                                            label: item.label,
                                            active: optionIndex === activeIndex,
                                            onClick: () => handleSelect(item),
                                        };

                                        return item.href !== undefined ? (
                                            <SearchFilterOption
                                                key={item.id}
                                                {...optionProps}
                                                href={item.href}
                                            />
                                        ) : (
                                            <SearchFilterOption
                                                key={item.id}
                                                {...optionProps}
                                            />
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>

                    {/* Visible; para lectores de pantalla lo anuncia la live
                        region de abajo */}
                    {results.length === 0 && (
                        <p
                            aria-hidden="true"
                            className="flex items-center min-h-10 px-4 py-2 text-sm leading-4 font-medium text-secondary-600"
                        >
                            {noResultsText}
                        </p>
                    )}
                </DropdownMenu>
            </div>

            {/* Siempre montada y solo cambia su texto: los lectores de
                pantalla anuncian los cambios de una live region que ya
                existe, no las que aparecen junto con su texto */}
            <p role="status" className="sr-only">
                {isDropdownVisible && results.length === 0 ? noResultsText : ""}
            </p>
        </div>
    );
};

export default SearchFilter;
