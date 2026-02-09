'use server';

export type GooglePlaceNearbyResult = {
	place_id?: string;
	name: string;
	vicinity?: string;
	formatted_address?: string;
	rating?: number;
	user_ratings_total?: number;
	types?: string[];
	geometry?: { location: { lat: number; lng: number } };
};

type NearbySearchResponse = {
	results?: GooglePlaceNearbyResult[];
	status?: string;
	error_message?: string;
};

function withTimeout(ms: number) {
	const controller = new AbortController();
	const id = setTimeout(() => controller.abort(), ms);
	return { controller, cancel: () => clearTimeout(id) };
}

export async function googlePlacesNearbySearch(params: {
	apiKey: string;
	lat: number;
	lng: number;
	type: string;
	keyword?: string;
	radius?: number;
	rankby?: 'prominence';
	timeoutMs?: number;
	language?: string;
}) {
	const {
		apiKey,
		lat,
		lng,
		type,
		keyword,
		radius = 2000,
		rankby = 'prominence',
		timeoutMs = 4500,
		language,
	} = params;

	const url = new URL(
		'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
	);
	url.searchParams.set('location', `${lat},${lng}`);
	url.searchParams.set('radius', String(radius));
	url.searchParams.set('type', type);
	url.searchParams.set('rankby', rankby);
	if (keyword) url.searchParams.set('keyword', keyword);
	if (language) url.searchParams.set('language', language);
	url.searchParams.set('key', apiKey);

	const { controller, cancel } = withTimeout(timeoutMs);
	try {
		const res = await fetch(url.toString(), {
			signal: controller.signal,
			next: { revalidate: 86400 },
		});

		if (!res.ok) throw new Error(`Google Places HTTP ${res.status}`);

		const json = (await res.json()) as NearbySearchResponse;
		if (!json || !Array.isArray(json.results)) return [];

		return json.results;
	} finally {
		cancel();
	}
}
