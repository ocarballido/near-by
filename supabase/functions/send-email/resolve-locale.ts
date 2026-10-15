import {
    MAGIC_LINK_MESSAGES,
    type Locale,
} from "./templates/magicLinkTemplate.ts";

const DEFAULT_LOCALE: Locale = "en";

// Solo se admiten idiomas que tengan traducción en la plantilla
const SUPPORTED_LOCALES = new Set<string>(Object.keys(MAGIC_LINK_MESSAGES));

function toSupportedLocale(value: unknown): Locale | null {
    if (typeof value !== "string") return null;
    const normalized = value.trim().toLowerCase().split("-")[0];
    return SUPPORTED_LOCALES.has(normalized) ? (normalized as Locale) : null;
}

// El cliente envía redirect_to con el locale anidado y codificado:
// /auth/callback?redirect=%2Fapp%2Fproperties%3FfromAuth%3D1%26locale%3Des
// Se busca primero como parámetro directo y después dentro de `redirect`.
function localeFromRedirectTo(redirectTo: unknown): Locale | null {
    if (typeof redirectTo !== "string" || !redirectTo) return null;
    try {
        const url = new URL(redirectTo);
        const direct = toSupportedLocale(url.searchParams.get("locale"));
        if (direct) return direct;

        const inner = url.searchParams.get("redirect");
        if (!inner) return null;
        const innerUrl = new URL(inner, url.origin);
        return toSupportedLocale(innerUrl.searchParams.get("locale"));
    } catch {
        return null;
    }
}

// Nunca lanza: ante cualquier dato inesperado devuelve el idioma por defecto
export function resolveEmailLocale(
    redirectTo: unknown,
    metadataLanguage: unknown,
): Locale {
    return (
        localeFromRedirectTo(redirectTo) ??
        toSupportedLocale(metadataLanguage) ??
        DEFAULT_LOCALE
    );
}
