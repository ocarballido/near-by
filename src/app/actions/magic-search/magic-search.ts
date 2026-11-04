'use server';

import { z } from 'zod';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { createSSRClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { touchPropertyUpdatedAt } from '@/lib/properties/touch-property';
import { checkPropertyOwner } from '@/lib/properties/check-property-owner';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, TablesInsert } from '@/lib/types';

import { runPlacesSearch } from '@/lib/places/places-engine';
import { findCategoryIdBySubCategoryId } from '@/lib/places/place-search-plan';
import {
	LOCALES,
	MAX_MAGIC_FINDER_LOCATIONS,
	RADIUS_OPTIONS,
} from '@/config/config-constants';

// Lo que una petición puede meter en la URL de Google está acotado: con
// valores libres (radio, coordenadas, idioma), cada llamada esquivaría la
// caché del fetch. Radio y cantidad, solo los del formulario; idioma, uno de
// LOCALES; coordenadas, las de la propiedad en BD. No limita cuántas
// búsquedas hace un usuario al día: eso necesita una cuota aparte
const RADIUS_VALUES: readonly string[] = RADIUS_OPTIONS.map(
	(option) => option.value,
);

const Schema = z.object({
	property_id: z.string().uuid(),
	sub_category_id: z.string().uuid(),
	category_id: z.string().uuid(),
	// Un solo refine: con regex + refine, "abc" daría dos errores y el
	// formulario mostraría el primero, el de la regex en inglés
	max: z.string().refine(
		(value) => {
			if (!/^\d+$/.test(value)) return false;
			const count = Number(value);
			return count >= 1 && count <= MAX_MAGIC_FINDER_LOCATIONS;
		},
		{ message: 'Cantidad no válida.' },
	),
	radius: z
		.string()
		.refine((value) => RADIUS_VALUES.includes(value), {
			message: 'Radio no válido.',
		}),
	locale: z.enum(LOCALES).optional(),
});

export type DiscoverNearbyState = {
	errors?: {
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
			max: formData.get('max'),
			radius: formData.get('radius'),
			locale: formData.get('locale') ?? undefined,
		};

		const parsed = Schema.safeParse(raw);
		if (!parsed.success)
			return { errors: parsed.error.flatten().fieldErrors };

		const { property_id, category_id, sub_category_id, max, radius, locale } =
			parsed.data;

		// category_id llega del cliente: si conocemos la categoría real de la
		// subcategoría, deben coincidir. Las subcategorías que solo existen en BD
		// (fuera de CATEGORIES_SUB_CATEGORIES) siguen como hasta ahora.
		const expectedCategoryId = findCategoryIdBySubCategoryId(sub_category_id);
		if (expectedCategoryId && expectedCategoryId !== category_id) {
			return { errors: { server: ['Datos inválidos.'] } };
		}

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

		const ssrClient = await createSSRClient();
		const {
			data: { user },
			error: authError,
		} = await ssrClient.auth.getUser();
		if (authError || !user)
			return { errors: { server: ['Usuario no autenticado'] } };

		const supabase =
			(await createServerAdminClient()) as unknown as SupabaseClient<Database>;

		// Antes de llamar a Google: un usuario sin permisos no gasta cuota
		const owner = await checkPropertyOwner(supabase, property_id, user.id);
		if (!owner.ok) {
			return {
				errors: {
					server: ['No tienes permisos sobre esta propiedad.'],
				},
			};
		}

		// Se busca alrededor de la propiedad, con sus coordenadas de BD
		type PropertyCoords = Pick<
			Database['public']['Tables']['properties']['Row'],
			'latitude' | 'longitude'
		>;

		const { data: coords, error: coordsError } = await supabase
			.from('properties')
			.select('latitude, longitude')
			.eq('id', property_id)
			.single()
			.overrideTypes<PropertyCoords, { merge: false }>();

		if (coordsError || coords?.latitude == null || coords?.longitude == null) {
			return {
				errors: {
					server: ['La propiedad no tiene coordenadas válidas.'],
				},
			};
		}

		const maxResults = parseInt(max, 10);
		const radiusNum = parseInt(radius, 10);

		// ✅ motor único: modo magic (usa radius del select)
		const found = await runPlacesSearch({
			apiKey,
			lat: coords.latitude,
			lng: coords.longitude,
			subCategoryId: sub_category_id,
			mode: 'magic',
			radius: radiusNum,
			language: locale,
			debugTag: 'magic',
		});

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
					// Unicidad por propiedad (índice unique_location_entry_per_property):
					// nunca reasigna lugares de otra propiedad
					onConflict: 'property_id,name,latitude,longitude,sub_category_id',
					// Los lugares que la propiedad ya tiene no se tocan: conservan
					// destacado, descripción e imagen editados por el anfitrión
					ignoreDuplicates: true,
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
