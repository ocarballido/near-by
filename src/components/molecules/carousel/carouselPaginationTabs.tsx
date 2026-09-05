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
    const containerRef = useRef<HTMLDivElement>(null);
    const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

    // Ajusta ÚNICAMENTE el scrollLeft del propio contenedor de pills.
    // A diferencia de scrollIntoView, esto es imposible que "escale" al
    // scroll vertical de la ventana: solo tocamos una propiedad concreta
    // de un elemento concreto, nunca delegamos en el navegador para que
    // decida qué ancestro debe moverse.
    useEffect(() => {
        const container = containerRef.current;
        const activeTab = tabRefs.current[selectedIndex];
        if (!container || !activeTab) return;

        const containerRect = container.getBoundingClientRect();
        const tabRect = activeTab.getBoundingClientRect();

        if (tabRect.left < containerRect.left) {
            container.scrollLeft -= containerRect.left - tabRect.left;
        } else if (tabRect.right > containerRect.right) {
            container.scrollLeft += tabRect.right - containerRect.right;
        }
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
                        className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 hover:cursor-pointer ${
                            isActive
                                ? "bg-emerald-100 text-emerald-900"
                                : "text-neutral-500 hover:bg-neutral-100"
                        }`}
                    >
                        {item.label}
                    </button>
                );
            })}
        </div>
    );
}
