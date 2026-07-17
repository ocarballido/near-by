import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { getMaintenanceConfig } from "./lib/maintenance";
import {
    DEFAULT_LOCALE,
    LOCALES,
    type Locale,
} from "@/config/config-constants";

const handleI18nRouting = createMiddleware(routing);

function ensureAnonCookieForPublic(
    request: NextRequest,
    response: NextResponse,
) {
    // Solo para la URL pública
    if (!request.nextUrl.pathname.startsWith("/public")) return response;

    const existing = request.cookies.get("be_anon_id");
    if (existing?.value) return response;

    response.cookies.set("be_anon_id", crypto.randomUUID(), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 año
    });

    return response;
}

function isSupportedLocale(value: string | undefined): value is Locale {
    return LOCALES.some((locale) => locale === value);
}

function isMaintenancePath(pathname: string): boolean {
    // segments[0] es el locale (p. ej. "es"), segments[1] la ruta real
    const segments = pathname.split("/").filter(Boolean);
    return segments[1] === "maintenance";
}

/**
 * Decide en qué locale servir la página de mantenimiento, reutilizando la
 * decisión que ya ha tomado next-intl en `i18nResponse` en vez de
 * reimplementar su negociación (cookie, Accept-Language, prefijo de URL):
 *
 * - Si next-intl decidió redirigir (p. ej. "/" -> "/en"), leemos el locale
 *   resuelto de la cabecera "location" de esa respuesta.
 * - Si la URL entrante ya trae un locale en el primer segmento, lo usamos.
 * - Si no hay ninguna pista, caemos al locale por defecto.
 */
function resolveMaintenanceLocale(
    request: NextRequest,
    i18nResponse: NextResponse,
): Locale {
    const redirectLocation = i18nResponse.headers.get("location");
    if (redirectLocation) {
        const redirectPathname = new URL(redirectLocation, request.url)
            .pathname;
        const candidate = redirectPathname.split("/").filter(Boolean)[0];
        if (isSupportedLocale(candidate)) return candidate;
    }

    const currentSegment = request.nextUrl.pathname
        .split("/")
        .filter(Boolean)[0];
    if (isSupportedLocale(currentSegment)) return currentSegment;

    return DEFAULT_LOCALE;
}

export async function middleware(request: NextRequest) {
    // 1) i18n primero: no toca ninguna base de datos, así que puede
    // ejecutarse siempre, incluso en mantenimiento. Necesitamos su
    // resultado para saber en qué locale responder.
    const i18nResponse = handleI18nRouting(request) as NextResponse;

    // 2) Mantenimiento: cortocircuitamos ANTES de llegar a Supabase.
    const { isEnabled: isMaintenanceEnabled } = getMaintenanceConfig();
    if (isMaintenanceEnabled) {
        if (isMaintenancePath(request.nextUrl.pathname)) {
            // Ya estamos sirviendo /[locale]/maintenance: dejamos que next-intl
            // la resuelva con normalidad, sin tocar Supabase.
            return i18nResponse;
        }

        const locale = resolveMaintenanceLocale(request, i18nResponse);
        return NextResponse.rewrite(
            new URL(`/${locale}/maintenance`, request.url),
        );
    }

    // 3) cookie anónima SOLO en /public
    let response = ensureAnonCookieForPublic(request, i18nResponse);

    // 4) sesión supabase
    return await updateSession(request, response);
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
