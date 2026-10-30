"use client";

import dynamic from "next/dynamic";

import { usePropertyMenu } from "@/lib/context/PropertyMenuContext";

import AppBarUser from "../appbar-user";
import AppbarTitle from "@/components/atoms/appbar-title";
import MenuIconButton from "./menu-icon-button";

// Carga diferida: el AppBar está en el layout de /app y qrcode.react (vía el
// bloque de impresión del QR) se descargaba en todo el dashboard, aunque el
// menú solo se pinta en la gestión de una propiedad. Sin `loading` ni
// `ssr: false` a propósito: crearían un Suspense propio y React retrasaría
// ~300 ms la primera aparición del menú
const PropertyDropdown = dynamic(
    () => import("@/components/molecules/property-dropdown"),
);

type AppBarProps = {
    className?: string;
    isLogged: boolean;
};

const AppBar = ({ className = "", isLogged = false }: AppBarProps) => {
    const { property } = usePropertyMenu();

    return (
        <div
            className={`w-full flex items-center gap-1 md:gap-4 rounded-lg p-4 relative transition-all ${className}`}
        >
            <MenuIconButton />
            <AppbarTitle />
            {/* Solo en la gestión de una propiedad: lo publica su layout */}
            {property && (
                <PropertyDropdown key={property.id} property={property} />
            )}
            {isLogged && <AppBarUser />}
        </div>
    );
};

export default AppBar;
