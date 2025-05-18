'use server';

import { z } from 'zod';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { revalidatePath } from 'next/cache';

type GooglePlaceResult = {
	name: string;
	vicinity: string;
	rating?: number;
	geometry?: {
		location: {
			lat: number;
			lng: number;
		};
	};
};

const DiscoverNearbySchema = z.object({
	property_id: z.string().uuid(),
	group_id: z.string().uuid(),
	lat: z.string(),
	lng: z.string(),
	type: z.string().min(1),
	max: z.string().regex(/^\d+$/, 'Debe ser un número válido'),
});

export type DiscoverNearbyState = {
	errors?: {
		lat?: string[];
		lng?: string[];
		type?: string[];
		max?: string[];
		group_id?: string[];
		property_id?: string[];
		server?: string[];
	};
	success?: boolean;
	message?: string;
	redirectTo?: string;
};

export async function discoverNearbyPlaces(
	formData: FormData
): Promise<DiscoverNearbyState> {
	try {
		const raw = {
			property_id: formData.get('property_id'),
			group_id: formData.get('group_id'),
			lat: formData.get('lat'),
			lng: formData.get('lng'),
			type: formData.get('type'),
			max: formData.get('max'),
		};

		const parsed = DiscoverNearbySchema.safeParse(raw);
		if (!parsed.success) {
			const errors = parsed.error.flatten().fieldErrors;
			return { errors };
		}

		const { property_id, group_id, lat, lng, type, max } = parsed.data;
		const maxResults = parseInt(max, 10);

		const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
		if (!apiKey) {
			return {
				errors: {
					server: [
						'La API Key de Google Places no está configurada.',
					],
				},
			};
		}

		const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=2000&type=${type}&rankby=prominence&key=${apiKey}`;

		const response = await fetch(placesUrl);
		const data = await response.json();

		if (!data.results || !Array.isArray(data.results)) {
			return {
				errors: {
					server: ['Respuesta inválida de Google Places'],
				},
			};
		}

		const supabase = await createServerAdminClient();
		const now = new Date().toISOString();
		const nuevos: {
			name: string;
			address: string;
			latitude: number;
			longitude: number;
			created_at: string;
			updated_at: string;
			property_id: string;
			group_id: string;
		}[] = [];

		const results: GooglePlaceResult[] = data.results;

		for (const place of results
			.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
			.slice(0, maxResults)) {
			const latitude = place.geometry?.location?.lat;
			const longitude = place.geometry?.location?.lng;

			if (!latitude || !longitude || !place.name || !place.vicinity)
				continue;

			const { data: existentes, error: checkError } = await supabase
				.from('locations')
				.select('id')
				.eq('latitude', latitude)
				.eq('longitude', longitude)
				.eq('property_id', property_id)
				.limit(1);

			if (checkError) {
				console.error(
					'Error consultando existencia previa:',
					checkError
				);
				continue;
			}

			if (!existentes || existentes.length === 0) {
				nuevos.push({
					name: place.name,
					address: place.vicinity,
					latitude,
					longitude,
					created_at: now,
					updated_at: now,
					property_id,
					group_id,
				});
			} else {
				await supabase
					.from('locations')
					.update({ updated_at: now })
					.eq('id', existentes[0].id);
			}
		}

		if (nuevos.length > 0) {
			const { error: insertError } = await supabase
				.from('locations')
				.insert(nuevos);

			if (insertError) {
				console.error('Error al insertar:', insertError);
				return {
					errors: {
						server: ['No se pudieron insertar los lugares'],
					},
				};
			}
		}

		revalidatePath('/app');

		return {
			success: true,
			message: 'Lugares descubiertos correctamente',
			redirectTo: '/app/properties',
		};
	} catch (error: unknown) {
		console.error('Error inesperado en discoverNearbyPlaces:', error);
		const errorMessage =
			error instanceof Error
				? error.message
				: 'Error interno del servidor';

		return {
			errors: {
				server: [errorMessage],
			},
		};
	}
}
