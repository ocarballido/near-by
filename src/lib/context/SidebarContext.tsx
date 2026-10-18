"use client";

import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    ReactNode,
    useEffect,
} from "react";
import { usePathname } from "next/navigation";

export interface SidebarContextProps {
    isOpen: boolean;
    openSidebar: () => void;
    closeSidebar: () => void;
    toggleSidebar: () => void;
}

interface SidebarProviderProps {
    children: ReactNode;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
    undefined,
);

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
    children,
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const pathname = usePathname();

    // Referencias estables: los consumidores solo se re-renderizan al cambiar isOpen
    const openSidebar = useCallback((): void => setIsOpen(true), []);
    const closeSidebar = useCallback((): void => setIsOpen(false), []);
    const toggleSidebar = useCallback(
        (): void => setIsOpen((prev) => !prev),
        [],
    );

    useEffect(() => {
        if (isOpen) {
            closeSidebar();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    useEffect(() => {
        // Debe coincidir con el breakpoint `lg` de Tailwind: por debajo, el
        // sidebar se abre como overlay (mobile y rail de tablet)
        const DESKTOP_BREAKPOINT = 1024;

        const handleResize = () => {
            if (isOpen && window.innerWidth >= DESKTOP_BREAKPOINT) {
                closeSidebar();
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isOpen, closeSidebar]);

    // Escape cierra cualquier overlay del sidebar; el listener solo existe
    // mientras está abierto
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") closeSidebar();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, closeSidebar]);

    const value = useMemo(
        () => ({ isOpen, openSidebar, closeSidebar, toggleSidebar }),
        [isOpen, openSidebar, closeSidebar, toggleSidebar],
    );

    return (
        <SidebarContext.Provider value={value}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = (): SidebarContextProps => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
};
