// src/lib/seedLodgingContent.ts
'use server';

import { getTranslations } from 'next-intl/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types';
import { CATEGORIES_SUB_CATEGORIES, LOCALES } from '@/config/config-constants';

const SEED_KEY_MAP: Record<string, string> = {
	[CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.WIFI.id]: 'wifi',
	[CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.MANUAL.id]: 'manual',
	[CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.SCHEDULE.id]: 'schedule',
	[CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.RECYCLE.id]: 'recycling',
	[CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.RULES.id]: 'rules',
};

export async function seedLodgingContent(args: {
	db: SupabaseClient<Database>;
	userId: string;
	propertyId: string;
	locale: string;
	selectedSubCategoryIds?: string[];
}) {
	const { db, userId, propertyId, locale, selectedSubCategoryIds } = args;

	try {
		const tSeed = await getTranslations({
			locale,
			namespace: 'seed.lodging',
		});

		const lodgingCategoryId = CATEGORIES_SUB_CATEGORIES.LODGING.id;

		const seedRows = [
			{
				user_id: userId,
				property_id: propertyId,
				category_id: lodgingCategoryId,
				sub_category_id:
					CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.WIFI.id,
				type: 'info',
				description: tSeed('wifi'),
				name: null,
			},
			{
				user_id: userId,
				property_id: propertyId,
				category_id: lodgingCategoryId,
				sub_category_id:
					CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.MANUAL.id,
				type: 'info',
				description: tSeed('manual'),
				name: null,
			},
			{
				user_id: userId,
				property_id: propertyId,
				category_id: lodgingCategoryId,
				sub_category_id:
					CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.SCHEDULE
						.id,
				type: 'info',
				description: tSeed('schedule'),
				name: null,
			},
			{
				user_id: userId,
				property_id: propertyId,
				category_id: lodgingCategoryId,
				sub_category_id:
					CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.RECYCLE.id,
				type: 'info',
				description: tSeed('recycling'),
				name: null,
			},
			{
				user_id: userId,
				property_id: propertyId,
				category_id: lodgingCategoryId,
				sub_category_id:
					CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.RULES.id,
				type: 'info',
				description: tSeed('rules'),
				name: null,
			},
		];

		const finalRows = Array.isArray(selectedSubCategoryIds)
			? seedRows.filter((r) =>
					selectedSubCategoryIds.includes(r.sub_category_id),
				)
			: seedRows;

		if (finalRows.length === 0) return;

		// Recuperamos los ids generados para poder insertar las traducciones
		const { data: insertedRows, error: seedError } = await db
			.from('property_data')
			.insert(finalRows)
			.select('id, sub_category_id');

		if (seedError) {
			console.error(
				'Error al insertar seed de property_data:',
				seedError,
			);
			return;
		}

		if (!insertedRows || insertedRows.length === 0) return;

		// Idiomas que NO son el del propietario — sus textos vienen del JSON de i18n
		const otherLocales = LOCALES.filter((l) => l !== locale);

		for (const targetLocale of otherLocales) {
			const tSeedTarget = await getTranslations({
				locale: targetLocale,
				namespace: 'seed.lodging',
			});

			const translationRows = insertedRows
				.map((row) => {
					const seedKey = row.sub_category_id
						? SEED_KEY_MAP[row.sub_category_id]
						: null;
					if (!seedKey) return null;
					return {
						property_data_id: row.id,
						lang: targetLocale,
						field_key: 'description',
						translated_value: tSeedTarget(seedKey as any),
						source_lang: locale,
					};
				})
				.filter((r): r is NonNullable<typeof r> => r !== null);

			if (translationRows.length > 0) {
				const { error: translationError } = await (db as any)
					.from('property_data_translations')
					.insert(translationRows);

				if (translationError) {
					console.error(
						`[seedLodgingContent] Error insertando traducciones para ${targetLocale}:`,
						translationError,
					);
				}
			}
		}
	} catch (e) {
		// Best-effort: nunca rompemos la creación de propiedad
		console.error('Error en seed de contenidos automáticos:', e);
	}
}
