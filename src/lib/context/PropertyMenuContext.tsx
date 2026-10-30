"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";

import type { Tables } from "@/lib/types";

export type PropertyMenuData = Pick<
    Tables<"properties">,
    | "id"
    | "name"
    | "check_in_time"
    | "check_out_time"
>;

type PropertyMenuContextProps = {
    property: PropertyMenuData | null;
    setProperty: (property: PropertyMenuData | null) => void;
};

type PropertyMenuProviderProps = {
    children: ReactNode;
};

const PropertyMenuContext = createContext<PropertyMenuContextProps | undefined>(
    undefined,
);

// La propiedad la publica el layout de la gestión (PropertyMenuBootstrap) y
// vuelve a null al salir de esa ruta, así que el AppBar solo pinta el menú ahí
export const PropertyMenuProvider = ({
    children,
}: PropertyMenuProviderProps) => {
    const [property, setProperty] = useState<PropertyMenuData | null>(null);

    // setProperty es estable: los consumidores solo se re-renderizan al
    // cambiar la propiedad
    const value = useMemo(() => ({ property, setProperty }), [property]);

    return (
        <PropertyMenuContext.Provider value={value}>
            {children}
        </PropertyMenuContext.Provider>
    );
};

export const usePropertyMenu = (): PropertyMenuContextProps => {
    const context = useContext(PropertyMenuContext);
    if (!context) {
        throw new Error(
            "usePropertyMenu must be used within a PropertyMenuProvider",
        );
    }
    return context;
};
