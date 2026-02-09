'use server';

import { z } from 'zod';
import { createSSRClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { CATEGORIES_SUB_CATEGORIES } from '@/config/config-constants';
import {
	googlePlacesNearbySearch,
	type GooglePlaceNearbyResult,
} from '@/lib/places/nearby';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types';

const Schema = z.object({
	propertyId: z.string().uuid(),
	subCategoryId: z.string().uuid(),
	locale: z.string().optional(),
});

export type PlaceRecommendation = {
	id: string; // estable para UI (place_id si existe, si no name+lat+lng)
	name: string;
	address: string;
	latitude: number;
	longitude: number;
	rating?: number;
	types?: string[];
};

const MAX_RESULTS = 5;
const RADIUS_METERS = 2000;
const RANKBY = 'prominence' as const;

const ENABLED = new Set<string>([
	CATEGORIES_SUB_CATEGORIES.FOOD_AND_DRINK.SUB_CATEGORIES.RESTAURANTS.id,
	CATEGORIES_SUB_CATEGORIES.FOOD_AND_DRINK.SUB_CATEGORIES.BARS.id,
	CATEGORIES_SUB_CATEGORIES.FOOD_AND_DRINK.SUB_CATEGORIES.CAFES.id,
	CATEGORIES_SUB_CATEGORIES.SHOPPING.SUB_CATEGORIES.SUPERMARKETS.id,
	CATEGORIES_SUB_CATEGORIES.SERVICES.SUB_CATEGORIES.PARKINGS.id,
	CATEGORIES_SUB_CATEGORIES.TRANSPORTATION.SUB_CATEGORIES.METRO_STATIONS.id,
	CATEGORIES_SUB_CATEGORIES.HEALTH_AND_WELLNESS.SUB_CATEGORIES.PHARMACIES.id,
	CATEGORIES_SUB_CATEGORIES.PARKS_AND_NATURE.SUB_CATEGORIES.URBAN_PARKS.id,
	CATEGORIES_SUB_CATEGORIES.PARKS_AND_NATURE.SUB_CATEGORIES.BEACHES.id,
	CATEGORIES_SUB_CATEGORIES.ARTS_AND_CULTURE.SUB_CATEGORIES.MUSEUMS.id,
	CATEGORIES_SUB_CATEGORIES.ARTS_AND_CULTURE.SUB_CATEGORIES.HISTORIC_SITES.id,
]);

const SUBCAT_TO_GOOGLE: Record<
	string,
	{ placeType: string; keywords?: string[]; fallbackPlaceTypes?: string[] }
> = {
	[CATEGORIES_SUB_CATEGORIES.FOOD_AND_DRINK.SUB_CATEGORIES.RESTAURANTS.id]: {
		placeType: 'restaurant',
	},
	[CATEGORIES_SUB_CATEGORIES.FOOD_AND_DRINK.SUB_CATEGORIES.BARS.id]: {
		placeType: 'bar',
	},
	[CATEGORIES_SUB_CATEGORIES.FOOD_AND_DRINK.SUB_CATEGORIES.CAFES.id]: {
		placeType: 'cafe',
	},
	[CATEGORIES_SUB_CATEGORIES.SHOPPING.SUB_CATEGORIES.SUPERMARKETS.id]: {
		placeType: 'supermarket',
	},
	[CATEGORIES_SUB_CATEGORIES.SERVICES.SUB_CATEGORIES.PARKINGS.id]: {
		placeType: 'parking',
		keywords: [
			'parking',
			'aparcamiento',
			'estacionamiento',
			'parking garage',
		],
	},
	[CATEGORIES_SUB_CATEGORIES.TRANSPORTATION.SUB_CATEGORIES.METRO_STATIONS.id]:
		{
			placeType: 'transit_station',
			keywords: ['metro', 'subway', 'underground', 'estación de metro'],
			fallbackPlaceTypes: ['subway_station', 'train_station'],
		},
	[CATEGORIES_SUB_CATEGORIES.HEALTH_AND_WELLNESS.SUB_CATEGORIES.PHARMACIES
		.id]: {
		placeType: 'pharmacy',
	},
	[CATEGORIES_SUB_CATEGORIES.PARKS_AND_NATURE.SUB_CATEGORIES.URBAN_PARKS.id]:
		{
			placeType: 'park',
			keywords: ['park', 'parque', 'jardín', 'jardines'],
		},
	[CATEGORIES_SUB_CATEGORIES.PARKS_AND_NATURE.SUB_CATEGORIES.BEACHES.id]: {
		placeType: 'beach',
		keywords: ['beach', 'playa'],
		fallbackPlaceTypes: ['tourist_attraction'],
	},
	[CATEGORIES_SUB_CATEGORIES.ARTS_AND_CULTURE.SUB_CATEGORIES.MUSEUMS.id]: {
		placeType: 'museum',
	},
};

function normalize(p: GooglePlaceNearbyResult): PlaceRecommendation | null {
	const latitude = p.geometry?.location?.lat;
	const longitude = p.geometry?.location?.lng;
	const name = p.name?.trim();
	const address = p.vicinity?.trim() || p.formatted_address?.trim();

	if (latitude == null || longitude == null || !name || !address) {
		return null;
	}

	const id =
		p.place_id ?? `${name}:${latitude.toFixed(6)}:${longitude.toFixed(6)}`;

	return {
		id,
		name,
		address,
		latitude,
		longitude,
		rating: p.rating,
		types: p.types,
	};
}

export async function getPlaceRecommendations(
	propertyId: string,
	subCategoryId: string,
	locale?: string,
): Promise<{
	success: boolean;
	data: PlaceRecommendation[];
	message?: string;
}> {
	// Kill switch backend (corta gasto)
	if (process.env.RECOMMENDATIONS_GOOGLE_ENABLED !== 'true') {
		return { success: true, data: [] };
	}

	const parsed = Schema.safeParse({ propertyId, subCategoryId, locale });
	if (!parsed.success)
		return { success: false, data: [], message: 'Datos inválidos.' };

	if (!ENABLED.has(subCategoryId)) return { success: true, data: [] };

	const cfg = SUBCAT_TO_GOOGLE[subCategoryId];
	if (!cfg) return { success: true, data: [] };

	const ssrClient = await createSSRClient();
	const {
		data: { user },
		error: authError,
	} = await ssrClient.auth.getUser();
	if (authError || !user)
		return { success: false, data: [], message: 'No auth.' };

	const apiKey = process.env.GOOGLE_MAPS_BACKEND_KEY;
	if (!apiKey)
		return { success: false, data: [], message: 'Google API key missing.' };

	const supabase =
		(await createServerAdminClient()) as unknown as SupabaseClient<Database>;

	const { data: prop, error: propErr } = await supabase
		.from('properties')
		.select('id,user_id,latitude,longitude')
		.eq('id', propertyId)
		.single();

	if (propErr || !prop?.id)
		return {
			success: false,
			data: [],
			message: 'Propiedad no encontrada.',
		};
	if (prop.user_id !== user.id)
		return { success: false, data: [], message: 'Sin permisos.' };
	if (prop.latitude == null || prop.longitude == null)
		return { success: true, data: [] };

	const { placeType, keywords, fallbackPlaceTypes } = cfg;

	let results: GooglePlaceNearbyResult[] = [];

	// intento 1
	results = await googlePlacesNearbySearch({
		apiKey,
		lat: prop.latitude,
		lng: prop.longitude,
		type: placeType,
		radius: RADIUS_METERS,
		rankby: RANKBY,
		keyword: keywords?.[0],
		language: locale, // si pasas 'es', 'en', etc.
	});

	// intento 2 keywords
	if ((!results || results.length === 0) && keywords?.length) {
		for (let i = 1; i < keywords.length; i++) {
			const fb = await googlePlacesNearbySearch({
				apiKey,
				lat: prop.latitude,
				lng: prop.longitude,
				type: placeType,
				radius: RADIUS_METERS,
				rankby: RANKBY,
				keyword: keywords[i],
				language: locale,
			});
			if (fb?.length) {
				results = fb;
				break;
			}
		}
	}

	// intento 3 fallback types
	if ((!results || results.length === 0) && fallbackPlaceTypes?.length) {
		for (const fbType of fallbackPlaceTypes) {
			const fb = await googlePlacesNearbySearch({
				apiKey,
				lat: prop.latitude,
				lng: prop.longitude,
				type: fbType,
				radius: RADIUS_METERS,
				rankby: RANKBY,
				language: locale,
			});
			if (fb?.length) {
				results = fb;
				break;
			}
		}
	}

	const normalized = (results ?? [])
		.map(normalize)
		.filter((x): x is PlaceRecommendation => x !== null)
		.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
		.slice(0, MAX_RESULTS);

	return { success: true, data: normalized };
}
