"use client";

import { useCallback, useMemo, useState } from "react";
import { AccordionContext } from "./accordion.context";

type AccordionProps = {
    children: React.ReactNode;
    /** Id del item que debe empezar desplegado. Por defecto, ninguno. */
    defaultActiveId?: string | null;
    className?: string;
};

export function Accordion({
    children,
    defaultActiveId = null,
    className = "",
}: AccordionProps) {
    const [activeId, setActiveId] = useState<string | null>(defaultActiveId);

    // Si el item clicado ya estaba activo, lo cerramos (null);
    // si es otro, pasa a ser el único activo — la regla de negocio
    // "solo un item abierto" vive aquí, en un único punto.
    const toggle = useCallback((id: string) => {
        setActiveId((current) => (current === id ? null : id));
    }, []);

    // Memorizado para no romper la identidad de referencia del contexto
    // en cada render y evitar re-renders innecesarios de los AccordionItem
    // que no cambiaron su estado expandido/colapsado.
    const contextValue = useMemo(
        () => ({ activeId, toggle }),
        [activeId, toggle],
    );

    return (
        <AccordionContext.Provider value={contextValue}>
            <div className={className}>{children}</div>
        </AccordionContext.Provider>
    );
}
