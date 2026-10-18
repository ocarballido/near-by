"use client";

import { useSidebar } from "@/lib/context/SidebarContext";
import IconMenu from "@/components/atoms/icon/menu";

import { SIDEBAR_PANEL_ID } from "../sidebar-shell";

type SidebarMenuBarProps = {
    label: string;
};

/**
 * Barra de mobile que sustituye al rail: muestra la sección activa y abre
 * el overlay del sidebar. Desde `md` la navegación la cubre el rail.
 */
const SidebarMenuBar = ({ label }: SidebarMenuBarProps) => {
    const { isOpen, openSidebar } = useSidebar();

    return (
        <button
            type="button"
            onClick={openSidebar}
            aria-expanded={isOpen}
            aria-controls={SIDEBAR_PANEL_ID}
            className="flex md:hidden shrink-0 gap-2 items-center w-full p-4 bg-white border-b border-gray-100 text-left cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-500"
        >
            <IconMenu />
            <span className="flex-1 min-w-0 truncate font-body font-medium text-sm leading-4 text-gray-800">
                {label}
            </span>
        </button>
    );
};

export default SidebarMenuBar;
