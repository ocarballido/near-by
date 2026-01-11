// src/lib/seedLodgingContent.ts
'use server';

import { getTranslations } from 'next-intl/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types';
import { CATEGORIES_SUB_CATEGORIES } from '@/config/config-constants';

export async function seedLodgingContent(args: {
	db: SupabaseClient<Database>;
	userId: string;
	propertyId: string;
	locale: string;
}) {
	const { db, userId, propertyId, locale } = args;

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

		const { error: seedError } = await db
			.from('property_data')
			.insert(seedRows);

		if (seedError) {
			console.error(
				'Error al insertar seed de property_data:',
				seedError
			);
		}
	} catch (e) {
		// Best-effort: nunca rompemos la creación de propiedad
		console.error('Error en seed de contenidos automáticos:', e);
	}
}
