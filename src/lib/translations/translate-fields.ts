// Sin "server-only": también lo importan los scripts de migración de
// traducciones (Node vía tsx), donde ese módulo no existe.
import { createServerAdminClient } from "@/lib/supabase/serverAdminClient";
import { LOCALES } from "@/config/config-constants";
import {
    MAX_TRANSLATABLE_CHARS,
    translateWithClaude,
} from "./translate-with-claude";
import {
    recordSystemTranslationTokens,
    recordTranslationTokens,
    reserveTranslationQuota,
} from "./translation-quota";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types";

type SupportedLang = (typeof LOCALES)[number];

// Quién pide la traducción:
// - user: acción de un anfitrión; consume su cuota diaria y la global.
// - system: proceso del operador (scripts de migración); no reserva cuota,
//   solo registra los tokens en el contador global.
export type TranslationRequester =
    | { type: "user"; userId: string }
    | { type: "system" };

// Funciones de la migración 20261025172421: guardan solo si el texto
// original sigue siendo el traducido, en una sola transacción
type AtomicUpsertFn =
    | "upsert_property_data_translations_if_current"
    | "upsert_property_translations_if_current"
    | "upsert_property_details_translations_if_current";

type TranslateFieldsArgs = {
    requester: TranslationRequester;
    recordId: string;
    fields: { fieldKey: string; value: string }[];
    upsertFn: AtomicUpsertFn;
    logTag: string;
    targetLangs?: readonly SupportedLang[];
};

// Flujo común a todas las traducciones: por cada campo, reservar cuota (solo
// anfitriones), traducir, registrar tokens reales y guardar de forma atómica.
// p_source_value es el texto tal cual está guardado: la función de BD lo
// compara con el actual para descartar traducciones obsoletas.
export async function translateFields({
    requester,
    recordId,
    fields,
    upsertFn,
    logTag,
    targetLangs = LOCALES,
}: TranslateFieldsArgs): Promise<void> {
    const db =
        (await createServerAdminClient()) as unknown as SupabaseClient<Database>;

    for (const field of fields) {
        // Su traducción no cabría en la salida: se descartaría tras pagarla
        if (field.value.length > MAX_TRANSLATABLE_CHARS) {
            console.warn(
                `[${logTag}] ${field.fieldKey} sin traducir: ${field.value.length} caracteres (máximo ${MAX_TRANSLATABLE_CHARS})`,
            );
            continue;
        }

        if (requester.type === "user") {
            // Sin cupo para este campo tampoco lo habrá para los siguientes
            const reserved = await reserveTranslationQuota(
                requester.userId,
                field.value.length,
            );
            if (!reserved) return;
        }

        const result = await translateWithClaude(field.value, logTag);
        if (!result) continue;

        if (requester.type === "user") {
            await recordTranslationTokens(requester.userId, result.usage);
        } else {
            await recordSystemTranslationTokens(result.usage);
        }

        // Sin el idioma original ni los que volvieron vacíos
        const translations = Object.fromEntries(
            targetLangs.flatMap((lang) => {
                const value = result.translations[lang];
                return lang !== result.source_lang && value
                    ? [[lang, value] as const]
                    : [];
            }),
        );
        if (Object.keys(translations).length === 0) continue;

        const { data: stored, error } = await db.rpc(upsertFn, {
            p_id: recordId,
            p_field_key: field.fieldKey,
            p_source_value: field.value,
            p_source_lang: result.source_lang,
            p_translations: translations,
        });

        if (error) {
            console.error(`[${logTag}] Error guardando traducciones:`, error);
        } else if (!stored) {
            console.info(
                `[${logTag}] Traducción descartada: el texto cambió mientras se traducía`,
            );
        }
    }
}
