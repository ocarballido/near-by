"use client";

import { createContext, useContext } from "react";

type AccordionContextValue = {
    activeId: string | null;
    toggle: (id: string) => void;
};

export const AccordionContext = createContext<AccordionContextValue | null>(
    null,
);

export function useAccordion() {
    const ctx = useContext(AccordionContext);
    if (!ctx) {
        throw new Error("useAccordion must be used inside <Accordion>");
    }
    return ctx;
}
