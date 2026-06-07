// Ejecutar UNA SOLA VEZ: npx tsx scripts/migrate-translations.ts

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

  let traducidos = 0;
  let saltados = 0;
  let errores = 0;

  for (const [i, item] of items.entries()) {
    // Comprobar si ya tiene traducciones — script reanudable
    const { data: existing } = await (supabase as any)
      .from("property_data_translations")
      .select("id")
      .eq("property_data_id", item.id)
      .limit(1);

    if (existing && existing.length > 0) {
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

    try {
      console.log(
        `[${i + 1}/${items.length}] Traduciendo ${item.type} — ${item.id}`,
      );
      await translateAndStore(item.id, fields);
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
