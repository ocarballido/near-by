// app/api/places-nearby/route.ts
import { NextRequest, NextResponse } from 'next/server';

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

		const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
		const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&language=${language}&key=${apiKey}`;

		const results = [];

		for (const type of types) {
			const res = await fetch(`${url}&type=${type}`);
			const data = await res.json();

			if (data.results) {
				results.push(
					...data.results
						.slice(0, 5)
						.map((place: GooglePlaceResult) => ({
							name: place.name,
							type,
							lat: place.geometry.location.lat,
							lng: place.geometry.location.lng,
							description: place.vicinity || 'Lugar cercano',
							estimated_duration: 60,
						}))
				);
			}
		}

		return NextResponse.json({ success: true, places: results });
	} catch (error) {
		console.error('Error in /api/places-nearby:', error);
		return NextResponse.json(
			{ success: false, error: 'Error fetching nearby places' },
			{ status: 500 }
		);
	}
}
