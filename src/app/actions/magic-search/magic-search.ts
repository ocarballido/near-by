'use server';

import { z } from 'zod';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { createSSRClient } from '@/lib/supabase/server';
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
	sub_category_id: z.string().uuid(),
	category_id: z.string().uuid(),
	lat: z.string(),
	lng: z.string(),
	type: z.string().min(1),
	max: z.string().regex(/^\d+$/, 'Debe ser un número válido'),
	radius: z.string().regex(/^\d+$/),
});

export type DiscoverNearbyState = {
	errors?: {
		lat?: string[];
		lng?: string[];
		type?: string[];
		max?: string[];
		sub_category_id?: string[];
		property_id?: string[];
		server?: string[];
		radius?: string[];
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
			sub_category_id: formData.get('sub_category_id'),
			category_id: formData.get('category_id'),
			lat: formData.get('lat'),
			lng: formData.get('lng'),
			type: formData.get('type'),
			max: formData.get('max'),
			radius: formData.get('radius'),
		};

		const parsed = DiscoverNearbySchema.safeParse(raw);
		if (!parsed.success)
			return { errors: parsed.error.flatten().fieldErrors };

		const {
			property_id,
			category_id,
			sub_category_id,
			lat,
			lng,
			type,
			max,
			radius,
		} = parsed.data;

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

		const response = await fetch(
			`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&rankby=prominence&key=${apiKey}`
		);

		const data = await response.json();

		if (!data.results || !Array.isArray(data.results)) {
			return {
				errors: { server: ['Respuesta inválida de Google Places'] },
			};
		}

		const ssrClient = await createSSRClient();
		const {
			data: { user },
			error: authError,
		} = await ssrClient.auth.getUser();

		if (authError || !user) {
			console.error('Usuario no autenticado:', authError);
			return { errors: { server: ['Usuario no autenticado'] } };
		}

		const supabase = await createServerAdminClient();
		const now = new Date().toISOString();

		const insertables = [];

		const sortedResults: GooglePlaceResult[] = data.results
			.sort(
				(a: GooglePlaceResult, b: GooglePlaceResult) =>
					(b.rating ?? 0) - (a.rating ?? 0)
			)

			.slice(0, maxResults);

		for (const place of sortedResults) {
			const latitude = place.geometry?.location?.lat;
			const longitude = place.geometry?.location?.lng;
			const name = place.name;
			const address = place.vicinity;

			if (!latitude || !longitude || !name || !address) continue;

			const { data: existing, error: checkError } = await supabase
				.from('property_data')
				.select('id')
				.eq('property_id', property_id)
				.eq('name', name)
				.eq('latitude', latitude)
				.eq('longitude', longitude)
				.maybeSingle();

			if (checkError) {
				console.error('Error verificando existencia:', checkError);
				continue;
			}

			if (existing) {
				const { error: updateError } = await supabase
					.from('property_data')
					.update({ updated_at: now })
					.eq('id', existing.id);

				if (updateError) {
					console.error('Error actualizando entry:', updateError);
				}
			} else {
				insertables.push({
					user_id: user.id,
					property_id,
					category_id,
					sub_category_id,
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
				});
			}
		}

		if (insertables.length > 0) {
			const { error: insertError } = await supabase
				.from('property_data')
				.insert(insertables);

			if (insertError) {
				console.error(
					'🛑 Error insertando lugares en Supabase:',
					insertError
				);
				return {
					errors: {
						server: ['No se pudieron guardar las localizaciones'],
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
