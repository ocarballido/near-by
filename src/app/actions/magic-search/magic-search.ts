'use server';

import { z } from 'zod';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { createSSRClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { touchPropertyUpdatedAt } from '@/lib/properties/touch-property';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, TablesInsert } from '@/lib/types';

import { runPlacesSearch } from '@/lib/places/places-engine';

const Schema = z.object({
	property_id: z.string().uuid(),
	sub_category_id: z.string().uuid(),
	category_id: z.string().uuid(),
	lat: z.string(),
	lng: z.string(),
	max: z.string().regex(/^\d+$/),
	radius: z.string().regex(/^\d+$/),
	locale: z.string().optional(),
});

export type DiscoverNearbyState = {
	errors?: {
		lat?: string[];
		lng?: string[];
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
	formData: FormData,
): Promise<DiscoverNearbyState> {
	try {
		const raw = {
			property_id: formData.get('property_id'),
			sub_category_id: formData.get('sub_category_id'),
			category_id: formData.get('category_id'),
			lat: formData.get('lat'),
			lng: formData.get('lng'),
			max: formData.get('max'),
			radius: formData.get('radius'),
			locale: formData.get('locale') ?? undefined,
		};

		const parsed = Schema.safeParse(raw);
		if (!parsed.success)
			return { errors: parsed.error.flatten().fieldErrors };

		const {
			property_id,
			category_id,
			sub_category_id,
			lat,
			lng,
			max,
			radius,
			locale,
		} = parsed.data;

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

		const language =
			typeof locale === 'string' ? locale.split('-')[0] : undefined;

		const ssrClient = await createSSRClient();
		const {
			data: { user },
			error: authError,
		} = await ssrClient.auth.getUser();
		if (authError || !user)
			return { errors: { server: ['Usuario no autenticado'] } };

		const maxResults = parseInt(max, 10);
		const radiusNum = parseInt(radius, 10);

		// ✅ motor único: modo magic (usa radius del select)
		const found = await runPlacesSearch({
			apiKey,
			lat: parseFloat(lat),
			lng: parseFloat(lng),
			subCategoryId: sub_category_id,
			mode: 'magic',
			radius: radiusNum,
			language,
			debugTag: 'magic',
		});

		const supabase =
			(await createServerAdminClient()) as unknown as SupabaseClient<Database>;
		const now = new Date().toISOString();

		const insertables: TablesInsert<'property_data'>[] = found
			.slice(0, maxResults)
			.map((p) => ({
				user_id: user.id,
				property_id,
				category_id,
				sub_category_id,
				type: 'location',
				name: p.name,
				address: p.address,
				description: '',
				latitude: p.latitude,
				longitude: p.longitude,
				image_url: null,
				featured: false,
				created_at: now,
				updated_at: now,
			}));

		if (insertables.length > 0) {
			const { error: insertError } = await supabase
				.from('property_data')
				.upsert(insertables, {
					onConflict: 'name,latitude,longitude,sub_category_id',
				});

			if (insertError) {
				console.error('🛑 Error insertando lugares:', insertError);
				return {
					errors: {
						server: ['No se pudieron guardar las localizaciones'],
					},
				};
			}

			await touchPropertyUpdatedAt(supabase, property_id);
		}

		revalidatePath('/app');

		return {
			success: true,
			message: 'Lugares descubiertos correctamente',
			redirectTo: '/app/properties',
		};
	} catch (error: unknown) {
		console.error('Error inesperado en discoverNearbyPlaces:', error);
		return {
			errors: {
				server: [
					error instanceof Error
						? error.message
						: 'Error interno del servidor',
				],
			},
		};
	}
}
