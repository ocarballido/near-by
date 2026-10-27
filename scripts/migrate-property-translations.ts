import { LOCALES } from "../src/config/config-constants";

import { createClient } from "@supabase/supabase-js";
import { translateAndStoreProperty } from "../src/lib/translations/translateAndStoreProperty";

import type { Tables } from "../src/lib/types";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.PRIVATE_SUPABASE_SERVICE_KEY!,
);

async function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
}

async function main() {
    const { data: properties, error } = await supabase
        .from("properties")
        .select("id, name, access_instructions")
        .not("access_instructions", "is", null);

    if (error || !properties) {
        console.error("Error fetching properties:", error);
        process.exit(1);
    }

    console.log(
        `Total propiedades con access_instructions: ${properties.length}`,
    );

    // Umbral de cobertura completa: todos los locales activos menos el
    // idioma origen (nunca se traduce a sí mismo). Se recalcula solo si
    // en el futuro se añade o quita un locale.
    const targetLangsCount = LOCALES.length - 1;

    let traducidos = 0;
    let saltados = 0;
    let errores = 0;

    for (const [i, property] of properties.entries()) {
        // Cobertura por CAMPO, no por propiedad entera: las traducciones de
        // name (las genera updateProperty) no cuentan para
        // access_instructions. Mismo patrón que migrate-translations.ts.
        const { data: existing } = await supabase
            .from("property_translations")
            .select("field_key, lang")
            .eq("property_id", property.id)
            .overrideTypes<
                Pick<Tables<"property_translations">, "field_key" | "lang">[],
                { merge: false }
            >();

        const existingLangsByField = new Map<string, Set<string>>();
        for (const row of existing ?? []) {
            const set =
                existingLangsByField.get(row.field_key) ?? new Set<string>();
            set.add(row.lang);
            existingLangsByField.set(row.field_key, set);
        }

        const fields: { fieldKey: "access_instructions"; value: string }[] =
            [];

        if (property.access_instructions) {
            fields.push({
                fieldKey: "access_instructions",
                value: property.access_instructions,
            });
        }

        // Idiomas que le faltan a cada campo. No sabemos aún cuál es su
        // idioma origen (lo decide Claude, no nosotros), así que se pasan
        // todos los locales que no están ya en BD — translateAndStoreProperty
        // descarta el que resulte ser el origen.
        const fieldsNeedingWork: {
            fieldKey: "access_instructions";
            value: string;
            missingLangs: (typeof LOCALES)[number][];
        }[] = [];

        for (const field of fields) {
            const covered =
                existingLangsByField.get(field.fieldKey) ?? new Set();
            if (covered.size >= targetLangsCount) continue;
            const missingLangs = LOCALES.filter((l) => !covered.has(l));
            fieldsNeedingWork.push({ ...field, missingLangs });
        }

        if (fieldsNeedingWork.length === 0) {
            console.log(
                `[${i + 1}/${properties.length}] Ya traducido a todos los idiomas — ${property.id}`,
            );
            saltados++;
            continue;
        }

        try {
            for (const field of fieldsNeedingWork) {
                console.log(
                    `[${i + 1}/${properties.length}] Traduciendo ${field.fieldKey} (faltan: ${field.missingLangs.join(", ")}) — ${property.id}`,
                );
                await translateAndStoreProperty(
                    property.id,
                    { type: "system" },
                    [{ fieldKey: field.fieldKey, value: field.value }],
                    field.missingLangs,
                );
            }
            traducidos++;
        } catch (err) {
            console.error(`Error traduciendo ${property.id}:`, err);
            errores++;
        }

        await sleep(50);
    }

    console.log(`\nMigración completada.`);
    console.log(`✅ Traducidos: ${traducidos}`);
    console.log(`⏭️  Saltados: ${saltados}`);
    console.log(`❌ Errores: ${errores}`);
}

main().catch(console.error);
