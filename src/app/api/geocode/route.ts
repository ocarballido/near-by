// app/api/geocode/route.ts
import { NextResponse } from 'next/server';

type GeoResult = {
	formatted: string;
	lat: number;
	lng: number;
};

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const address = searchParams.get('address')?.trim();
	if (!address) {
		return NextResponse.json(
			{ error: 'address required' },
			{ status: 400 }
		);
	}

	const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
	if (!key) {
		console.error('Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY');
		return NextResponse.json(
			{ error: 'server misconfigured' },
			{ status: 500 }
		);
	}

	// Llama al endpoint REST de Geocoding
	const geoRes = await fetch(
		`https://maps.googleapis.com/maps/api/geocode/json` +
			`?address=${encodeURIComponent(address)}` +
			`&key=${key}`
	);
	if (!geoRes.ok) {
		const text = await geoRes.text();
		console.error('Geocode API error', text);
		return NextResponse.json(
			{ error: 'external API error' },
			{ status: 500 }
		);
	}

	const data = (await geoRes.json()) as {
		status: string;
		results: Array<{
			formatted_address: string;
			geometry: {
				location: { lat: number; lng: number };
			};
		}>;
		error_message?: string;
	};

	if (data.status !== 'OK' || data.results.length === 0) {
		console.error('Geocode failed', data.status, data.error_message);
		return NextResponse.json(
			{ error: 'address not found' },
			{ status: 404 }
		);
	}

	const r = data.results[0];
	const result: GeoResult = {
		formatted: r.formatted_address,
		lat: r.geometry.location.lat,
		lng: r.geometry.location.lng,
	};
	return NextResponse.json(result);
}
