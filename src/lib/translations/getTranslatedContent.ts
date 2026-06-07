import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types';

export async function getTranslatedPropertyData(
	propertyId: string,
	lang: string,
	supabase: SupabaseClient<Database>,
) {
	// 1. Fetch de todos los property_data de la propiedad
	const { data: items, error: itemsError } = await supabase
		.from('property_data')
		.select('*')
		.eq('property_id', propertyId);

	if (itemsError) {
		console.error(
			'[getTranslatedPropertyData] Error fetching items:',
			itemsError,
		);
		return [];
	}

	if (!items || items.length === 0) return [];

	// 2. Fetch de traducciones para el idioma solicitado
	const ids = items.map((i) => i.id);

	const { data: translations } = await (supabase as any)
		.from('property_data_translations')
		.select('property_data_id, field_key, translated_value')
		.in('property_data_id', ids)
		.eq('lang', lang);

	// Si no hay traducciones, devolvemos los items originales
	if (!translations || translations.length === 0) return items;

	// 3. Merge: traducción tiene prioridad, fallback al original campo a campo
	const translationMap = new Map<string, Record<string, string>>();

	for (const t of translations) {
		if (!translationMap.has(t.property_data_id)) {
			translationMap.set(t.property_data_id, {});
		}
		translationMap.get(t.property_data_id)![t.field_key] =
			t.translated_value;
	}

	return items.map((item) => {
		const itemTranslations = translationMap.get(item.id);
		if (!itemTranslations) return item;
		return { ...item, ...itemTranslations };
	});
}
