'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createSSRClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { CATEGORIES_SUB_CATEGORIES } from '@/config/config-constants';
import { touchPropertyUpdatedAt } from '@/lib/properties/touch-property';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, TablesInsert } from '@/lib/types';

import { updatePropertyProgressAndTrack } from '@/lib/updatePropertyProgress';

import {
	googlePlacesNearbySearch,
	type GooglePlaceNearbyResult,
} from '@/lib/places/nearby';

type GooglePlaceResult = GooglePlaceNearbyResult;

const Schema = z.object({
	propertyId: z.string().uuid(),
	subCategoryIds: z.array(z.string().uuid()).min(1),
});

export type GenerateAutoLocationsState = {
	errors?: { server?: string[] };
	success?: boolean;
	message?: string;
	inserted?: number;
};

const RADIUS_METERS = 2000;
const MAX_RESULTS = 2;
const RANKBY = 'prominence'; // ✅ compatible con radius

// Mapping: sub_category_id -> { category_id, googlePlacesType, keyword(s) opcional }
const SUBCAT_TO_GOOGLE: Record<
	string,
	{
		categoryId: string;
		placeType: string;
		keywords?: string[];
		fallbackPlaceTypes?: string[];
	}
> = {
	// Health & Wellness
	[CATEGORIES_SUB_CATEGORIES.HEALTH_AND_WELLNESS.SUB_CATEGORIES.PHARMACIES
		.id]: {
		categoryId: CATEGORIES_SUB_CATEGORIES.HEALTH_AND_WELLNESS.id,
		placeType: 'pharmacy',
	},
	[CATEGORIES_SUB_CATEGORIES.HEALTH_AND_WELLNESS.SUB_CATEGORIES.EMERGENCY.id]:
		{
			categoryId: CATEGORIES_SUB_CATEGORIES.HEALTH_AND_WELLNESS.id,
			placeType: 'hospital',
			keywords: ['urgencias', 'emergency', 'emergency room'],
		},

	// Shopping
	[CATEGORIES_SUB_CATEGORIES.SHOPPING.SUB_CATEGORIES.SUPERMARKETS.id]: {
		categoryId: CATEGORIES_SUB_CATEGORIES.SHOPPING.id,
		placeType: 'supermarket',
	},
	// Food & Drink
	[CATEGORIES_SUB_CATEGORIES.FOOD_AND_DRINK.SUB_CATEGORIES.RESTAURANTS.id]: {
		categoryId: CATEGORIES_SUB_CATEGORIES.FOOD_AND_DRINK.id,
		placeType: 'restaurant',
	},
	[CATEGORIES_SUB_CATEGORIES.FOOD_AND_DRINK.SUB_CATEGORIES.CAFES.id]: {
		categoryId: CATEGORIES_SUB_CATEGORIES.FOOD_AND_DRINK.id,
		placeType: 'cafe',
	},
	[CATEGORIES_SUB_CATEGORIES.FOOD_AND_DRINK.SUB_CATEGORIES.BARS.id]: {
		categoryId: CATEGORIES_SUB_CATEGORIES.FOOD_AND_DRINK.id,
		placeType: 'bar',
	},
	// Security & Emergencies
	[CATEGORIES_SUB_CATEGORIES.SECURITY_AND_EMERGENCIES.SUB_CATEGORIES
		.POLICE_STATIONS.id]: {
		categoryId: CATEGORIES_SUB_CATEGORIES.SECURITY_AND_EMERGENCIES.id,
		placeType: 'police',
		keywords: ['police station', 'comisaría', 'comisaria'],
	},
	// Services
	[CATEGORIES_SUB_CATEGORIES.SERVICES.SUB_CATEGORIES.PARKINGS.id]: {
		categoryId: CATEGORIES_SUB_CATEGORIES.SERVICES.id,
		placeType: 'parking',
		keywords: [
			'parking',
			'aparcamiento',
			'estacionamiento',
			'parking público',
			'parking publico',
			'parking garage',
			'parking lot',
		],
	},
};

// Concurrencia limitada (sin librerías)
async function mapLimit<T, R>(
	items: T[],
	limit: number,
	fn: (item: T) => Promise<R>,
): Promise<R[]> {
	const results: R[] = new Array(items.length);
	let idx = 0;

	const workers = Array.from({ length: Math.min(limit, items.length) }).map(
		async () => {
			while (idx < items.length) {
				const current = idx++;
				results[current] = await fn(items[current]);
			}
		},
	);

	await Promise.all(workers);
	return results;
}

// type guard para eliminar nulls con tipado correcto
function notNull<T>(v: T | null): v is T {
	return v !== null;
}

function keywordMatch(place: GooglePlaceResult, keywords?: string[]) {
	if (!keywords?.length) return false;
	const haystack = `${place.name ?? ''} ${place.vicinity ?? ''} ${
		place.formatted_address ?? ''
	}`.toLowerCase();
	return keywords.some((k) => haystack.includes(k.toLowerCase()));
}

function shouldStrictTypeFilter(placeType: string) {
	// Mantén estricto donde hay más ruido si no filtras
	return ['police'].includes(placeType);
}

export async function generateAutoLocations(
	propertyId: string,
	subCategoryIds: string[],
): Promise<GenerateAutoLocationsState> {
	try {
		const parsed = Schema.safeParse({ propertyId, subCategoryIds });
		if (!parsed.success)
			return { errors: { server: ['Datos inválidos.'] } };

		const ssrClient = await createSSRClient();
		const {
			data: { user },
			error: authError,
		} = await ssrClient.auth.getUser();

		if (authError || !user) {
			return {
				errors: {
					server: ['No has iniciado sesión o tu sesión ha expirado'],
				},
			};
		}

		const apiKey = process.env.GOOGLE_MAPS_BACKEND_KEY;
		if (!apiKey) {
			return {
				errors: {
					server: [
						'La API Key de Google Places no está configurada.',
					],
				},
			};
		}

		const supabase =
			(await createServerAdminClient()) as unknown as SupabaseClient<Database>;

		type PropRow = Pick<
			Database['public']['Tables']['properties']['Row'],
			'id' | 'user_id' | 'latitude' | 'longitude'
		>;

		const { data: prop, error: propErr } = await supabase
			.from('properties')
			.select('id,user_id,latitude,longitude')
			.eq('id', propertyId)
			.single()
			.overrideTypes<PropRow, { merge: false }>();

		if (propErr || !prop?.id) {
			return { errors: { server: ['Propiedad no encontrada.'] } };
		}
		if (prop.user_id !== user.id) {
			return {
				errors: {
					server: ['No tienes permisos sobre esta propiedad.'],
				},
			};
		}
		if (prop.latitude == null || prop.longitude == null) {
			return {
				errors: {
					server: ['La propiedad no tiene coordenadas válidas.'],
				},
			};
		}

		const supported = subCategoryIds.filter((id) => SUBCAT_TO_GOOGLE[id]);
		if (supported.length === 0) {
			return {
				errors: {
					server: [
						'Ninguna de las subcategorías seleccionadas está soportada.',
					],
				},
			};
		}

		const now = new Date().toISOString();

		const placesLists = await mapLimit(supported, 3, async (subCatId) => {
			const { placeType, keywords, fallbackPlaceTypes } =
				SUBCAT_TO_GOOGLE[subCatId];

			let results: GooglePlaceResult[] = [];

			// 1) Intento principal: type + (primer keyword si existe)
			if (keywords?.length) {
				results = await googlePlacesNearbySearch({
					apiKey,
					lat: prop.latitude!,
					lng: prop.longitude!,
					type: placeType,
					keyword: keywords[0],
					radius: RADIUS_METERS,
					rankby: RANKBY,
				});
			} else {
				results = await googlePlacesNearbySearch({
					apiKey,
					lat: prop.latitude!,
					lng: prop.longitude!,
					type: placeType,
					radius: RADIUS_METERS,
					rankby: RANKBY,
				});
			}

			// 2) Si hay más keywords, probarlas hasta encontrar algo decente
			if ((!results || results.length === 0) && keywords?.length) {
				for (let i = 1; i < keywords.length; i++) {
					const fb = await googlePlacesNearbySearch({
						apiKey,
						lat: prop.latitude!,
						lng: prop.longitude!,
						type: placeType,
						keyword: keywords[i],
						radius: RADIUS_METERS,
						rankby: RANKBY,
					});
					if (fb?.length) {
						results = fb;
						break;
					}
				}
			}

			// 3) Fallback place types si no hay resultados
			if (
				(!results || results.length === 0) &&
				fallbackPlaceTypes?.length
			) {
				for (const fbType of fallbackPlaceTypes) {
					const fbResults = await googlePlacesNearbySearch({
						apiKey,
						lat: prop.latitude!,
						lng: prop.longitude!,
						type: fbType,
						radius: RADIUS_METERS,
						rankby: RANKBY,
					});
					if (fbResults?.length) {
						results = fbResults;
						break;
					}
				}
			}

			// ✅ FILTRO DURO por types cuando usamos un type concreto
			const strict = shouldStrictTypeFilter(placeType);

			const filtered = (results ?? []).filter((p) => {
				// 1) Si trae types y coincide, perfecto
				if (p.types?.includes(placeType)) return true;

				// 2) Para parking y otros no-estrictos, aceptamos si matchea keyword
				if (!strict && keywordMatch(p, keywords)) return true;

				return false;
			});

			const finalResults = (filtered.length ? filtered : (results ?? []))
				.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
				.slice(0, MAX_RESULTS)
				.map((p) => ({ subCatId, place: p }));

			return finalResults;
		});

		const flattened = placesLists.flat();

		const insertables: TablesInsert<'property_data'>[] = flattened
			.map(({ subCatId, place }) => {
				const latitude = place.geometry?.location?.lat;
				const longitude = place.geometry?.location?.lng;
				const name = place.name?.trim();
				const address =
					place.vicinity?.trim() || place.formatted_address?.trim();

				if (!latitude || !longitude || !name || !address) return null;

				const { categoryId } = SUBCAT_TO_GOOGLE[subCatId];

				return {
					user_id: user.id,
					property_id: propertyId,
					category_id: categoryId,
					sub_category_id: subCatId,
					type: 'location',
					name,
					address,
					description: '',
					latitude,
					longitude,
					image_url: null,
					featured: false,
					created_at: now,
					updated_at: now,
				};
			})
			.filter(notNull);

		if (insertables.length === 0) {
			return {
				success: true,
				message:
					'No se han encontrado resultados para las categorías seleccionadas.',
				inserted: 0,
			};
		}

		const { error: upsertErr } = await supabase
			.from('property_data')
			.upsert(insertables, {
				onConflict: 'name,latitude,longitude,sub_category_id',
			});

		if (upsertErr) {
			console.error('🛑 Error upsert locations:', upsertErr);
			return {
				errors: {
					server: ['No se pudieron guardar las localizaciones.'],
				},
			};
		}

		// Marcar última actividad de la propiedad (dashboard)
		await touchPropertyUpdatedAt(supabase, propertyId);

		await updatePropertyProgressAndTrack({
			db: supabase,
			userId: user.id,
			propertyId,
		});

		revalidatePath('/app');

		return {
			success: true,
			message: 'Lugares generados correctamente.',
			inserted: insertables.length,
		};
	} catch (err) {
		console.error('Error inesperado generateAutoLocations:', err);
		return {
			errors: {
				server: [
					err instanceof Error
						? err.message
						: 'Error interno del servidor',
				],
			},
		};
	}
}
