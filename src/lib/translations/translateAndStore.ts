// Sin "server-only": también lo importa scripts/migrate-translations.ts
// (Node vía tsx), donde ese módulo no existe.
import { LOCALES } from "@/config/config-constants";
import { translateFields } from "./translate-fields";

import type { TranslationRequester } from "./translate-fields";

type SupportedLang = (typeof LOCALES)[number];

type FieldToTranslate = {
    fieldKey: "name" | "description";
    value: string;
};

// Traducciones de property_data (sitios e información del alojamiento)
export async function translateAndStore(
    propertyDataId: string,
    requester: TranslationRequester,
    fields: FieldToTranslate[],
    targetLangs: readonly SupportedLang[] = LOCALES,
): Promise<void> {
    // Los nombres propios son legítimamente cortos (p. ej. "Pig House",
    // "Bar Sol") — el umbral de longitud de 10 caracteres solo tiene
    // sentido para descripciones triviales o vacías, no para nombres.
    const validFields = fields.filter((f) => {
        if (!f.value || f.value === "EMPTY") return false;
        if (f.fieldKey === "name") return f.value.trim().length > 0;
        return f.value.trim().length > 10;
    });
    if (validFields.length === 0) return;

    await translateFields({
        requester,
        recordId: propertyDataId,
        fields: validFields,
        upsertFn: "upsert_property_data_translations_if_current",
        logTag: "translateAndStore",
        targetLangs,
    });
}
