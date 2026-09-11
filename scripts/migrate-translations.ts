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
        const { data: existing } = await (supabase as any)
            .from("property_data_translations")
            .select("lang")
            .eq("property_data_id", item.id);

        const existingLangs = new Set(
            (existing ?? []).map((r: { lang: string }) => r.lang),
        );

        if (existingLangs.size >= targetLangsCount) {
            saltados++;
            continue;
        }

        const fields = [];

        if (
            item.type === "info" &&
            item.description &&
            item.description !== "EMPTY"
        ) {
            fields.push({
                fieldKey: "description" as const,
                value: item.description,
            });
        }

        if (item.type === "location" && item.name) {
            fields.push({ fieldKey: "name" as const, value: item.name });
        }

        if (fields.length === 0) {
            saltados++;
            continue;
        }

        const missingLangs = LOCALES.filter((l) => !existingLangs.has(l));

        try {
            console.log(
                `[${i + 1}/${items.length}] Traduciendo ${item.type} (faltan: ${missingLangs.join(", ")}) — ${item.id}`,
            );
            await translateAndStore(item.id, fields, missingLangs);
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
