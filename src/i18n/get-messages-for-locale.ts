import { hasLocale } from "next-intl";
import { routing } from "./routing";
import type { Locale } from "@/config/config-constants";

/**
 * Carga los mensajes para un locale de forma explícita, en vez de depender
 * de la resolución ambient de next-intl (basada en una cabecera que su
 * propio middleware pone en la petición). Esa resolución implícita se
 * rompe en cualquier request que llegue a través de nuestro rewrite de
 * mantenimiento en `middleware.ts`, así que este helper es la vía segura
 * para cualquier sitio que necesite mensajes garantizados y correctos
 * (p. ej. `NextIntlClientProvider` en el layout raíz).
 *
 * Si `requestedLocale` no es uno de los soportados, cae al locale por
 * defecto — mismo criterio que ya usa `i18n/request.ts`.
 */
export async function getMessagesForLocale(requestedLocale: string) {
    const locale: Locale = hasLocale(routing.locales, requestedLocale)
        ? requestedLocale
        : routing.defaultLocale;

    return (await import(`../../messages/${locale}.json`)).default;
}
