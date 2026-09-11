import { LOCALES } from "../src/config/config-constants";

import { createClient } from "@supabase/supabase-js";
import { translateAndStoreProperty } from "../src/lib/translations/translateAndStoreProperty";

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
        const { data: existing } = await (supabase as any)
            .from("property_translations")
            .select("lang")
            .eq("property_id", property.id);

        const existingLangs = new Set(
            (existing ?? []).map((r: { lang: string }) => r.lang),
        );

        if (existingLangs.size >= targetLangsCount) {
            console.log(
                `[${i + 1}/${properties.length}] Ya traducido a todos los idiomas — ${property.id}`,
            );
            saltados++;
            continue;
        }

        const fields = [];

        if (property.access_instructions) {
            fields.push({
                fieldKey: "access_instructions" as const,
                value: property.access_instructions,
            });
        }

        if (fields.length === 0) {
            saltados++;
            continue;
        }

        // Idiomas que le faltan a ESTA propiedad en concreto. No sabemos
        // aún cuál es su idioma origen (lo decide Claude, no nosotros),
        // así que se pasan todos los locales que no están ya en BD —
        // translateAndStoreProperty descarta el que resulte ser el origen.
        const missingLangs = LOCALES.filter((l) => !existingLangs.has(l));

        try {
            console.log(
                `[${i + 1}/${properties.length}] Traduciendo (faltan: ${missingLangs.join(", ")}) — ${property.id}`,
            );
            await translateAndStoreProperty(property.id, fields, missingLangs);
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
