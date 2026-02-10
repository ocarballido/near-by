import {
	googlePlacesNearbySearch,
	type GooglePlaceNearbyResult,
} from '@/lib/places/nearby';
import {
	buildSearchPlan,
	applyPlanFilters,
	type SearchMode,
} from '@/lib/places/place-search-plan';

export type PlaceRecommendation = {
	id: string;
	name: string;
	address: string;
	latitude: number;
	longitude: number;
	rating?: number;
	types?: string[];
};

function normalizeGoogleNearbyResult(
	p: GooglePlaceNearbyResult,
): PlaceRecommendation | null {
	const latitude = p.geometry?.location?.lat;
	const longitude = p.geometry?.location?.lng;
	const name = p.name?.trim();
	const address = p.vicinity?.trim() || p.formatted_address?.trim();

	if (latitude == null || longitude == null || !name || !address) return null;

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

/**
 * Single entry point for Google Places search.
 * Used by:
 * - Magic Finder (mode: 'magic')
 * - Recommendations (mode: 'curated')
 *
 * All filtering and normalization MUST happen here.
 */
export async function runPlacesSearch(args: {
	apiKey: string;
	lat: number;
	lng: number;
	subCategoryId: string;
	mode: SearchMode; // 'curated' | 'magic'
	radius: number; // magic usa el del select, curated lo ignora (usa radiusForCurated)
	language?: string;
	debugTag?: string; // para logs
}): Promise<PlaceRecommendation[]> {
	const {
		apiKey,
		lat,
		lng,
		subCategoryId,
		mode,
		radius,
		language,
		debugTag,
	} = args;

	const plan = buildSearchPlan({ subCategoryId, mode, radius });
	if (!plan) return [];

	// guard: si no hay ni type ni keyword, no gastamos cuota
	if (!plan.type && !plan.keyword) {
		return [];
	}

	let results = await googlePlacesNearbySearch({
		apiKey,
		lat,
		lng,
		type: plan.type,
		keyword: plan.keyword,
		radius: plan.radius,
		rankby: plan.rankby,
		language,
		debug: !!debugTag,
	});

	// ✅ filtro anti-hoteles (si aplica)
	results = applyPlanFilters(results ?? [], plan);

	// intento 2 keywords adicionales (solo si existe)
	if ((!results || results.length === 0) && plan.keywords?.length) {
		for (let i = 0; i < plan.keywords.length; i++) {
			const fb = await googlePlacesNearbySearch({
				apiKey,
				lat,
				lng,
				type: plan.type,
				keyword: plan.keywords[i],
				radius: plan.radius,
				rankby: plan.rankby,
				language,
				debug: !!debugTag,
			});
			const filtered = applyPlanFilters(fb ?? [], plan);
			if (filtered.length) {
				results = filtered;
				break;
			}
		}
	}

	// intento 3 fallback types
	if ((!results || results.length === 0) && plan.fallbackTypes?.length) {
		for (const fbType of plan.fallbackTypes) {
			const fb = await googlePlacesNearbySearch({
				apiKey,
				lat,
				lng,
				type: fbType,
				radius: plan.radius,
				rankby: plan.rankby,
				language,
				debug: !!debugTag,
			});
			const filtered = applyPlanFilters(fb ?? [], plan);
			if (filtered.length) {
				results = filtered;
				break;
			}
		}
	}

	const normalized = (results ?? [])
		.map(normalizeGoogleNearbyResult)
		.filter((x): x is PlaceRecommendation => x !== null)
		.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

	return normalized.slice(0, 50);
}
