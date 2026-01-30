// app/api/places-nearby/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { googlePlacesNearbySearch } from '@/lib/places/nearby';

type GooglePlaceResult = {
	name: string;
	vicinity?: string;
	geometry: {
		location: {
			lat: number;
			lng: number;
		};
	};
};

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const {
			lat,
			lng,
			radius = 1500,
			types = ['restaurant', 'tourist_attraction'],
			language = 'es',
		} = body;

		const apiKey = process.env.GOOGLE_MAPS_BACKEND_KEY;
		if (!apiKey) {
			return NextResponse.json(
				{
					success: false,
					error: 'La API Key de Google Places no está configurada.',
				},
				{ status: 500 },
			);
		}

		const results: Array<{
			name: string;
			type: string;
			lat: number;
			lng: number;
			description: string;
			estimated_duration: number;
		}> = [];

		for (const type of types) {
			const places = await googlePlacesNearbySearch({
				apiKey,
				lat: Number(lat),
				lng: Number(lng),
				type,
				radius: Number(radius),
				rankby: 'prominence',
				language,
			});

			results.push(
				...places
					.slice(0, 5)
					.map((place) => place as unknown as GooglePlaceResult)
					.map((place: GooglePlaceResult) => ({
						name: place.name,
						type,
						lat: place.geometry.location.lat,
						lng: place.geometry.location.lng,
						description: place.vicinity || 'Lugar cercano',
						estimated_duration: 60,
					})),
			);
		}

		return NextResponse.json({ success: true, places: results });
	} catch (error) {
		console.error('Error in /api/places-nearby:', error);
		return NextResponse.json(
			{ success: false, error: 'Error fetching nearby places' },
			{ status: 500 },
		);
	}
}
