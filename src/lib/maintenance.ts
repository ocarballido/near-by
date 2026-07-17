/**
 * Configuración de mantenimiento de la aplicación, derivada de variables
 * de entorno.
 *
 * Las variables de entorno siempre llegan como `string`. Comprobar
 * únicamente `if (process.env.MAINTENANCE_MODE)` sería un antipatrón: el
 * string "false" también es "truthy" en JavaScript y activaría el
 * mantenimiento por error. Esta función centraliza el parseo para que
 * exista un único punto de verdad, reutilizable tanto desde el middleware
 * como desde Server Components.
 *
 * Se modela como un objeto (en vez de un booleano suelto) para poder
 * añadir más adelante otras propiedades (mensaje personalizado, IPs con
 * acceso durante el mantenimiento, etc.) sin romper la firma en los sitios
 * donde ya se usa.
 */
export interface MaintenanceConfig {
    readonly isEnabled: boolean;
}

export function getMaintenanceConfig(): MaintenanceConfig {
    return {
        isEnabled: process.env.MAINTENANCE_MODE === "true",
    };
}
