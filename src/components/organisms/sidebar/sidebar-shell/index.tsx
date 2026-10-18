"use client";

import { useSidebar } from "@/lib/context/SidebarContext";

// Una sola carcasa por página: id estable para el aria-controls del rail
export const SIDEBAR_PANEL_ID = "sidebar-panel";

type SidebarShellProps = {
    rail: React.ReactNode;
    children: React.ReactNode;
};

/**
 * Carcasa común de los sidebars (app, propiedad y público):
 * - Por debajo de `lg`: overlay de 320px con fondo oscuro, que se desliza.
 * - Tablet (`md` a `lg`): además, el rail de iconos en línea, debajo del overlay.
 * - Desde `lg`: sidebar completo en línea, sin rail.
 * El rail y el contenido los pone cada sidebar, que es quien tiene el estado.
 */
const SidebarShell = ({ rail, children }: SidebarShellProps) => {
    const { isOpen, closeSidebar } = useSidebar();

    return (
        <>
            <div
                aria-hidden="true"
                onClick={closeSidebar}
                className={`fixed inset-0 z-10 bg-black/40 transition-opacity duration-300 lg:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            />
            <div className="hidden md:max-lg:flex shrink-0 w-16 p-3 overflow-y-auto overscroll-contain">
                {rail}
            </div>
            <aside
                id={SIDEBAR_PANEL_ID}
                className={`fixed bottom-0 left-0 right-0 top-0 p-4 z-10 max-w-80 overflow-y-auto overscroll-contain grow flex gap-2 flex-col transition-transform duration-300 bg-white lg:bg-transparent lg:top-0 lg:relative lg:w-full lg:h-auto lg:min-h-0 lg:self-stretch lg:translate-x-0 lg:p-3 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                {children}
            </aside>
        </>
    );
};

export default SidebarShell;
