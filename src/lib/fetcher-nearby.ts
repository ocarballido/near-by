export type POI = {
	name: string;
	type: string;
	lat: number;
	lng: number;
	description: string;
	estimated_duration: number;
};

const PREFERENCE_TO_GOOGLE_TYPE: Record<string, string[]> = {
	food: ['restaurant', 'cafe'],
	culture: ['museum', 'art_gallery'],
	nature: ['park'],
	shopping: ['shopping_mall', 'store'],
	tours: ['tourist_attraction'],
};

type FetchNearbyPOIsParams = {
	lat: number;
	lng: number;
	preferences: string[];
	radius?: number;
	language?: string;
};

type PlacesNearbyApiResponse =
	| { success: true; places: POI[] }
	| { success: false; error: string };

export async function fetchNearbyPOIs({
	lat,
	lng,
	preferences,
	radius = 1500,
	language = 'es',
}: FetchNearbyPOIsParams): Promise<POI[]> {
	// Validación mínima (evita requests inválidas)
	if (!Number.isFinite(lat) || !Number.isFinite(lng)) return [];

	const types = preferences.flatMap(
		(pref) => PREFERENCE_TO_GOOGLE_TYPE[pref] || [],
	);

	// Si no hay types, no tiene sentido llamar a la API
	if (types.length === 0) return [];

	const response = await fetch('/api/places-nearby', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ lat, lng, radius, types, language }),
	});

	const data = (await response.json()) as PlacesNearbyApiResponse;

	if (!response.ok || !data.success) {
		throw new Error(
			('error' in data && data.error) || 'Error fetching nearby places',
		);
	}

	return data.places;
}
