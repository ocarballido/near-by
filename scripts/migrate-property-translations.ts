// scripts/migrate-property-translations.ts
// Ejecutar UNA SOLA VEZ: npx dotenv -e .env.local -- npx tsx scripts/migrate-property-translations.ts

import { createClient } from '@supabase/supabase-js';
import { translateAndStoreProperty } from '../src/lib/translations/translateAndStoreProperty';

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.PRIVATE_SUPABASE_SERVICE_KEY!,
);

async function sleep(ms: number) {
	return new Promise((r) => setTimeout(r, ms));
}

async function main() {
	const { data: properties, error } = await supabase
		.from('properties')
		.select('id, name, access_instructions')
		.not('access_instructions', 'is', null);

	if (error || !properties) {
		console.error('Error fetching properties:', error);
		process.exit(1);
	}

	console.log(
		`Total propiedades con access_instructions: ${properties.length}`,
	);

	let traducidos = 0;
	let saltados = 0;
	let errores = 0;

	for (const [i, property] of properties.entries()) {
		// Comprobar si ya tiene traducciones — script reanudable
		const { data: existing } = await (supabase as any)
			.from('property_translations')
			.select('id')
			.eq('property_id', property.id)
			.limit(1);

		if (existing && existing.length > 0) {
			console.log(
				`[${i + 1}/${properties.length}] Ya traducido — ${property.id}`,
			);
			saltados++;
			continue;
		}

		const fields = [];

		if (property.access_instructions) {
			fields.push({
				fieldKey: 'access_instructions' as const,
				value: property.access_instructions,
			});
		}

		if (fields.length === 0) {
			saltados++;
			continue;
		}

		try {
			console.log(
				`[${i + 1}/${properties.length}] Traduciendo — ${property.id}`,
			);
			await translateAndStoreProperty(property.id, fields);
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
