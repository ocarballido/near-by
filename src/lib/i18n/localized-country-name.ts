import type { Locale } from "@/config/config-constants";

export function getLocalizedCountryName(
    isoCode: string,
    locale: Locale,
): string {
    try {
        const localized = new Intl.DisplayNames([locale], {
            type: "region",
        }).of(isoCode);

        // Intl.DisplayNames devuelve el propio código (p. ej. "XK") cuando no
        // tiene traducción real para ese locale — lo tratamos como "sin traducción".
        if (localized && localized.toUpperCase() !== isoCode.toUpperCase()) {
            return localized;
        }
    } catch {
        // Código ISO inválido, o runtime sin datos ICU completos para ese locale.
    }

    return (
        new Intl.DisplayNames(["en"], { type: "region" }).of(isoCode) ?? isoCode
    );
}
