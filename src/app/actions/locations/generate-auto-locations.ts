'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createSSRClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { touchPropertyUpdatedAt } from '@/lib/properties/touch-property';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, TablesInsert } from '@/lib/types';

import { updatePropertyProgressAndTrack } from '@/lib/updatePropertyProgress';

import { runPlacesSearch } from '@/lib/places/places-engine';

import { findCategoryIdBySubCategoryId } from '@/lib/places/place-search-plan';

const Schema = z.object({
	propertyId: z.string().uuid(),
	subCategoryIds: z.array(z.string().uuid()).min(1),
});

export type GenerateAutoLocationsState = {
	errors?: { server?: string[] };
	success?: boolean;
	message?: string;
	inserted?: number;
};

const RADIUS_METERS = 2000;
const MAX_RESULTS_PER_SUBCAT = 2;

// Concurrencia limitada (sin librerías)
async function mapLimit<T, R>(
	items: T[],
	limit: number,
	fn: (item: T) => Promise<R>,
): Promise<R[]> {
	const results: R[] = new Array(items.length);
	let idx = 0;

	const workers = Array.from({ length: Math.min(limit, items.length) }).map(
		async () => {
			while (idx < items.length) {
				const current = idx++;
				results[current] = await fn(items[current]);
			}
		},
	);

	await Promise.all(workers);
	return results;
}

function notNull<T>(v: T | null): v is T {
	return v !== null;
}

export async function generateAutoLocations(
	propertyId: string,
	subCategoryIds: string[],
): Promise<GenerateAutoLocationsState> {
	try {
		const parsed = Schema.safeParse({ propertyId, subCategoryIds });
		if (!parsed.success) {
			return { errors: { server: ['Datos inválidos.'] } };
		}

		const ssrClient = await createSSRClient();
		const {
			data: { user },
			error: authError,
		} = await ssrClient.auth.getUser();

		if (authError || !user) {
			return {
				errors: {
					server: ['No has iniciado sesión o tu sesión ha expirado'],
				},
			};
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

		const supabase =
			(await createServerAdminClient()) as unknown as SupabaseClient<Database>;

		type PropRow = Pick<
			Database['public']['Tables']['properties']['Row'],
			'id' | 'user_id' | 'latitude' | 'longitude'
		>;

		const { data: prop, error: propErr } = await supabase
			.from('properties')
			.select('id,user_id,latitude,longitude')
			.eq('id', propertyId)
			.single()
			.overrideTypes<PropRow, { merge: false }>();

		if (propErr || !prop?.id) {
			return { errors: { server: ['Propiedad no encontrada.'] } };
		}
		if (prop.user_id !== user.id) {
			return {
				errors: {
					server: ['No tienes permisos sobre esta propiedad.'],
				},
			};
		}
		if (prop.latitude == null || prop.longitude == null) {
			return {
				errors: {
					server: ['La propiedad no tiene coordenadas válidas.'],
				},
			};
		}

		// ✅ filtramos subcats que realmente tienen categoryId conocido
		const supported = subCategoryIds
			.map((subCategoryId) => {
				const categoryId = findCategoryIdBySubCategoryId(subCategoryId);
				return categoryId ? { subCategoryId, categoryId } : null;
			})
			.filter(notNull);

		if (supported.length === 0) {
			return {
				errors: {
					server: [
						'Ninguna de las subcategorías seleccionadas está soportada.',
					],
				},
			};
		}

		const now = new Date().toISOString();

		// ✅ Motor único: para cada subcategoría buscamos lugares
		// NOTA: usamos mode 'magic' y el motor:
		// - si está curada, aplica plan curado (y filtros anti-hoteles)
		// - si no, usa keyword por nombre subcategoría
		const lists = await mapLimit(
			supported,
			3,
			async ({ subCategoryId }) => {
				const found = await runPlacesSearch({
					apiKey,
					lat: prop.latitude!,
					lng: prop.longitude!,
					subCategoryId,
					mode: 'magic',
					radius: RADIUS_METERS,
					language: undefined, // aquí no tienes locale; si quieres, lo añadimos como param opcional
					debugTag: undefined, // evita logs en prod
				});

				return found.slice(0, MAX_RESULTS_PER_SUBCAT).map((p) => ({
					subCategoryId,
					place: p,
				}));
			},
		);

		const flattened = lists.flat();

		const insertables: TablesInsert<'property_data'>[] = flattened
			.map(({ subCategoryId, place }) => {
				const categoryId = findCategoryIdBySubCategoryId(subCategoryId);
				if (!categoryId) return null;

				return {
					user_id: user.id,
					property_id: propertyId,
					category_id: categoryId,
					sub_category_id: subCategoryId,
					type: 'location',
					name: place.name,
					address: place.address,
					description: '',
					latitude: place.latitude,
					longitude: place.longitude,
					image_url: null,
					featured: false,
					created_at: now,
					updated_at: now,
				};
			})
			.filter(notNull);

		if (insertables.length === 0) {
			return {
				success: true,
				message:
					'No se han encontrado resultados para las categorías seleccionadas.',
				inserted: 0,
			};
		}

		const { error: upsertErr } = await supabase
			.from('property_data')
			.upsert(insertables, {
				onConflict: 'name,latitude,longitude,sub_category_id',
			});

		if (upsertErr) {
			console.error('🛑 Error upsert locations:', upsertErr);
			return {
				errors: {
					server: ['No se pudieron guardar las localizaciones.'],
				},
			};
		}

		await touchPropertyUpdatedAt(supabase, propertyId);

		await updatePropertyProgressAndTrack({
			db: supabase,
			userId: user.id,
			propertyId,
		});

		revalidatePath('/app');

		return {
			success: true,
			message: 'Lugares generados correctamente.',
			inserted: insertables.length,
		};
	} catch (err) {
		console.error('Error inesperado generateAutoLocations:', err);
		return {
			errors: {
				server: [
					err instanceof Error
						? err.message
						: 'Error interno del servidor',
				],
			},
		};
	}
}
