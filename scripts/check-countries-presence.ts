// Ejecutar a mano: npx tsx scripts/check-countries-presence.ts
// No se importa desde ningún código de producción — vive solo aquí.

import { createClient } from "@supabase/supabase-js";
import { COUNTRIES_PRESENCE } from "../src/config/config-constants";

const TEST_ACCOUNT_USER_ID = "c096a79c-394d-4081-a151-4c248e7c4b49";

function normalizar(texto: string): string {
    return texto.trim().toLowerCase();
}

const PAIS_A_ISO_NORMALIZADO: Record<string, string> = Object.fromEntries(
    Object.entries({
        España: "ES",
        Spain: "ES",
        USA: "US",
        Australia: "AU",
        Perú: "PE",
        México: "MX",
        Mexico: "MX",
        Venezuela: "VE",
        Portugal: "PT",
        Ecuador: "EC",
        Chile: "CL",
        Honduras: "HN",
    }).map(([pais, iso]) => [normalizar(pais), iso]),
);

async function main() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error(
            "Faltan SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY en el entorno.",
        );
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
        .from("properties")
        .select("address")
        .neq("user_id", TEST_ACCOUNT_USER_ID)
        .not("address", "is", null);

    if (error) {
        console.error("Error consultando Supabase:", error.message);
        process.exit(1);
    }

    const isoEncontrados = new Set<string>();
    const sinMapear = new Set<string>();

    for (const { address } of data ?? []) {
        const countryRaw = address.split(",").at(-1)?.trim();
        if (!countryRaw) continue;

        const iso = PAIS_A_ISO_NORMALIZADO[normalizar(countryRaw)];
        iso ? isoEncontrados.add(iso) : sinMapear.add(countryRaw);
    }

    const isoActuales = new Set(COUNTRIES_PRESENCE.map((c) => c.isoCode));
    const nuevos = [...isoEncontrados].filter((iso) => !isoActuales.has(iso));
    const desaparecidos = [...isoActuales].filter(
        (iso) => !isoEncontrados.has(iso),
    );

    console.log("── Comparación con COUNTRIES_PRESENCE ──");

    if (nuevos.length === 0 && desaparecidos.length === 0) {
        console.log(
            "Sin cambios — la lista estática sigue reflejando los datos reales.",
        );
    } else {
        if (nuevos.length > 0) {
            console.log(
                `Nuevos (añadir a COUNTRIES_PRESENCE): ${nuevos.join(", ")}`,
            );
        }
        if (desaparecidos.length > 0) {
            console.log(
                `Sin propiedades reales ya (revisar si quitar): ${desaparecidos.join(", ")}`,
            );
        }
    }

    if (sinMapear.size > 0) {
        console.log("\nTextos de país sin mapear (revisar a mano):");
        sinMapear.forEach((texto) => console.log(`  - "${texto}"`));
    }
}

main();
