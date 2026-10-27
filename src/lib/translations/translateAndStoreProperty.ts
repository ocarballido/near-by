// Sin "server-only": también lo importa scripts/migrate-property-translations.ts
// (Node vía tsx), donde ese módulo no existe.
import { LOCALES } from "@/config/config-constants";
import { translateFields } from "./translate-fields";

import type { TranslationRequester } from "./translate-fields";

type SupportedLang = (typeof LOCALES)[number];

type FieldToTranslate = {
    fieldKey: "name" | "description" | "summary" | "access_instructions";
    value: string;
};

// Traducciones de properties (nombre, descripción, resumen e instrucciones
// de acceso)
export async function translateAndStoreProperty(
    propertyId: string,
    requester: TranslationRequester,
    fields: FieldToTranslate[],
    targetLangs: readonly SupportedLang[] = LOCALES,
): Promise<void> {
    const validFields = fields.filter((f) => {
        if (!f.value) return false;
        if (f.fieldKey === "name") return f.value.trim().length > 0;
        return f.value.trim().length > 10;
    });
    if (validFields.length === 0) return;

    await translateFields({
        requester,
        recordId: propertyId,
        fields: validFields,
        upsertFn: "upsert_property_translations_if_current",
        logTag: "translateAndStoreProperty",
        targetLangs,
    });
}
