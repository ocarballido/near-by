"use client";

import { useEffect, useRef } from "react";
import { useCarousel } from "./carousel.context";

type CarouselPaginationTabItem = {
    id: string;
    label: string;
};

type CarouselPaginationTabsProps = {
    items: CarouselPaginationTabItem[];
    className?: string;
};

export function CarouselPaginationTabs({
    items,
    className = "",
}: CarouselPaginationTabsProps) {
    const { selectedIndex, scrollTo } = useCarousel();
    const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

    // Garantiza que el pill activo esté siempre visible dentro del
    // contenedor, sin arrastrar el scroll vertical de la página
    // (block: 'nearest' evita que scrollIntoView "salte" la página entera).
    useEffect(() => {
        tabRefs.current[selectedIndex]?.scrollIntoView({
            behavior: "smooth",
            inline: "nearest",
            block: "nearest",
        });
    }, [selectedIndex]);

    if (items.length <= 1) return null;

    return (
        <div
            role="tablist"
            aria-label="Navegación de secciones de la guía"
            style={{ scrollbarWidth: "none" }}
            className={`flex items-center gap-1 overflow-x-auto rounded-full bg-white p-1 max-w-fit mx-auto shadow-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] ${className}`}
        >
            {items.map((item, index) => {
                const isActive = index === selectedIndex;

                return (
                    <button
                        key={item.id}
                        ref={(el) => {
                            tabRefs.current[index] = el;
                        }}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => scrollTo(index)}
                        className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-200 ${
                            isActive
                                ? "bg-emerald-100 text-emerald-900"
                                : "text-neutral-600 hover:bg-neutral-100"
                        }`}
                    >
                        {item.label}
                    </button>
                );
            })}
        </div>
    );
}
