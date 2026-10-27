import { translateFields } from "./translate-fields";

import type { TranslationRequester } from "./translate-fields";

type FieldToTranslate = {
    fieldKey: "name" | "instructions" | "guidelines";
    value: string;
};

// Traducciones de property_details (nombre, instrucciones y normas de cada
// detalle del alojamiento)
export async function translateAndStoreDetails(
    propertyDetailId: string,
    requester: TranslationRequester,
    fields: FieldToTranslate[],
): Promise<void> {
    const validFields = fields.filter((f) => {
        if (!f.value || f.value === "EMPTY") return false;
        if (f.fieldKey === "name") return f.value.trim().length > 2;
        return f.value.trim().length > 10;
    });
    if (validFields.length === 0) return;

    await translateFields({
        requester,
        recordId: propertyDetailId,
        fields: validFields,
        upsertFn: "upsert_property_details_translations_if_current",
        logTag: "translateAndStoreDetails",
    });
}
