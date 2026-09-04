"use client";

import { useId } from "react";
import IconKeyboardArrowDown from "@/components/atoms/icon/keyboard-arrow-down";
import { useAccordion } from "./accordion.context";

type AccordionItemProps = {
    /** Clave de negocio única del item — decide cuál está activo. */
    id: string;
    title: React.ReactNode;
    children: React.ReactNode;
    className?: string;
};

export function AccordionItem({
    id,
    title,
    children,
    className = "",
}: AccordionItemProps) {
    const { activeId, toggle } = useAccordion();
    const isActive = activeId === id;

    // Ids puramente para el cableado ARIA — independientes del `id` de
    // negocio, no colisionan aunque haya varios <Accordion> en la página.
    const headingId = useId();
    const panelId = useId();

    return (
        <div
            className={`rounded-xl border border-gray-200 p-4 bg-white ${className}`}
        >
            <h3>
                <button
                    type="button"
                    id={headingId}
                    aria-expanded={isActive}
                    aria-controls={panelId}
                    onClick={() => toggle(id)}
                    className="flex w-full items-center justify-between gap-4 text-left hover:cursor-pointer"
                >
                    <span className="font-semibold text-gray-900 text-sm">
                        {title}
                    </span>
                    <IconKeyboardArrowDown
                        className={`shrink-0 transition-transform duration-300 fill-black ${
                            isActive ? "rotate-180" : "rotate-0"
                        }`}
                    />
                </button>
            </h3>

            <div
                id={panelId}
                role="region"
                aria-labelledby={headingId}
                inert={!isActive}
                className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                style={{ gridTemplateRows: isActive ? "1fr" : "0fr" }}
            >
                <div className="overflow-hidden">
                    <div className="pt-3 text-gray-600 text-sm">{children}</div>
                </div>
            </div>
        </div>
    );
}
