// Ejecutar UNA SOLA VEZ: npx tsx scripts/migrate-translations.ts

import { LOCALES } from "../src/config/config-constants";
import { createClient } from "@supabase/supabase-js";
import { translateAndStore } from "../src/lib/translations/translateAndStore";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.PRIVATE_SUPABASE_SERVICE_KEY!,
);

async function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
}

async function main() {
    const { data: items, error } = await supabase
        .from("property_data")
        .select("id, type, name, description")
        .limit(5000);

    if (error || !items) {
        console.error("Error fetching property_data:", error);
        process.exit(1);
    }

    console.log(`Total registros: ${items.length}`);

    const targetLangsCount = LOCALES.length - 1;

    let traducidos = 0;
    let saltados = 0;
    let errores = 0;

    for (const [i, item] of items.entries()) {
        // Cobertura por CAMPO, no por registro entero — "location" ahora
        // tiene dos campos independientes (name y description), y cada uno
        // puede estar en un estado de cobertura distinto (p. ej. name
        // completo desde el script anterior, description recién añadido).
        const { data: existing } = await (supabase as any)
            .from("property_data_translations")
            .select("field_key, lang")
            .eq("property_data_id", item.id);

        const existingLangsByField = new Map<string, Set<string>>();
        for (const row of existing ?? []) {
            const set =
                existingLangsByField.get(row.field_key) ?? new Set<string>();
            set.add(row.lang);
            existingLangsByField.set(row.field_key, set);
        }

        const fields: { fieldKey: "name" | "description"; value: string }[] =
            [];

        if (
            item.type === "info" &&
            item.description &&
            item.description !== "EMPTY"
        ) {
            fields.push({ fieldKey: "description", value: item.description });
        }

        if (item.type === "location" && item.name) {
            fields.push({ fieldKey: "name", value: item.name });
        }

        if (
            item.type === "location" &&
            item.description &&
            item.description !== "EMPTY"
        ) {
            fields.push({ fieldKey: "description", value: item.description });
        }

        if (fields.length === 0) {
            saltados++;
            continue;
        }

        // (typeof LOCALES)[number][] — array de idiomas, longitud variable
        // (0 a 5). LOCALES en sí es una tupla fija de 5 (por el `as const`),
        // pero el resultado de filtrar nunca tiene esa garantía de longitud.
        const fieldsNeedingWork: {
            fieldKey: "name" | "description";
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
            saltados++;
            continue;
        }

        try {
            for (const field of fieldsNeedingWork) {
                console.log(
                    `[${i + 1}/${items.length}] Traduciendo ${item.type}.${field.fieldKey} (faltan: ${field.missingLangs.join(", ")}) — ${item.id}`,
                );
                await translateAndStore(
                    item.id,
                    [{ fieldKey: field.fieldKey, value: field.value }],
                    field.missingLangs,
                );
            }
            traducidos++;
        } catch (err) {
            console.error(`Error traduciendo ${item.id}:`, err);
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
