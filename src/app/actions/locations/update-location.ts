'use server';

import { revalidatePath } from 'next/cache';
import { after } from 'next/server';
import { z } from 'zod';
import { createSSRClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { touchPropertyUpdatedAt } from '@/lib/properties/touch-property';
import { checkPropertyOwner } from '@/lib/properties/check-property-owner';
import { removePublicImages } from '@/lib/storage/remove-public-images';
import { uploadLocationImage } from '@/lib/uploadLocationImage';
import { translateAndStore } from '@/lib/translations/translateAndStore';
import {
	MAX_LOCATION_DESCRIPTION_LENGTH,
	MAX_LOCATION_NAME_LENGTH,
} from '@/config/config-constants';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables, TablesUpdate } from '@/lib/types';
import type { LocationFormState } from './add-location';

// La dirección y las coordenadas no son editables: ni se leen del FormData.
// Si el anfitrión quiere otra dirección, elimina el sitio y crea uno nuevo.
// Los mensajes de error son claves de messages/*.json: los traduce el
// formulario (los límites {n} los pone él con las mismas constantes)
const UpdateLocationSchema = z.object({
	location_id: z.string().uuid(),
	// invalid_type_error: si falta el campo llega null, y sin él Zod
	// respondería con su mensaje por defecto en inglés
	name: z
		.string({ invalid_type_error: 'El nombre es obligatorio' })
		.trim()
		.nonempty('El nombre es obligatorio')
		.max(MAX_LOCATION_NAME_LENGTH, 'locationNameTooLong'),
	description: z
		.preprocess((v) => (typeof v === 'string' ? v.trim() : ''), z.string())
		.pipe(
			z
				.string()
				.max(MAX_LOCATION_DESCRIPTION_LENGTH, 'description-characters'),
		),
	featured: z.preprocess((v) => v === 'true' || v === true, z.boolean()),
	must_visit: z.preprocess((v) => v === 'true' || v === true, z.boolean()),
	image_action: z.preprocess(
		(v) => (v === 'remove' ? 'remove' : null),
		z.enum(['remove']).nullable(),
	),
});

const TRANSLATABLE_FIELDS = ['name', 'description'] as const;

export async function updateLocation(
	locationId: string,
	formData: FormData,
): Promise<LocationFormState> {
	try {
		// 1) Autenticación
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

		// 2) Validación
		const result = UpdateLocationSchema.safeParse({
			location_id: locationId,
			name: formData.get('name'),
			description: formData.get('description'),
			featured: formData.get('featured'),
			must_visit: formData.get('must_visit'),
			image_action: formData.get('image_action'),
		});

		if (!result.success) {
			const fe = result.error.flatten().fieldErrors;
			if (fe.location_id) {
				return { errors: { server: ['locationInvalidData'] } };
			}
			return {
				errors: {
					name: fe.name,
					description: fe.description,
				},
			};
		}
		const loc = result.data;

		const supabase = await createServerAdminClient();
		const db = supabase as unknown as SupabaseClient<Database>;

		// 3) Leer el sitio y verificar que su propiedad es del usuario,
		// antes de subir nada a Storage o escribir en BD
		type ExistingLoc = Pick<
			Tables<'property_data'>,
			'property_id' | 'name' | 'description' | 'image_url'
		>;

		const { data: existing, error: fetchErr } = await db
			.from('property_data')
			.select('property_id, name, description, image_url')
			.eq('id', loc.location_id)
			.eq('type', 'location')
			.maybeSingle()
			.overrideTypes<ExistingLoc, { merge: false }>();

		if (fetchErr || !existing?.property_id) {
			return { errors: { server: ['locationNotFound'] } };
		}

		const owner = await checkPropertyOwner(
			db,
			existing.property_id,
			user.id,
		);
		if (!owner.ok) {
			return {
				errors: {
					server: ['locationNoPermission'],
				},
			};
		}

		// 4) Imagen — prioridad: archivo nuevo > acción "remove" > se mantiene
		const uploadRes = await uploadLocationImage({
			db,
			userId: user.id,
			imageFile: formData.get('image') as File | null,
		});
		if (!uploadRes.ok) return uploadRes.errorState;

		const uploadedImageUrl = uploadRes.imageUrl;
		const imageUrl =
			uploadedImageUrl ??
			(loc.image_action === 'remove' ? null : existing.image_url);

		// 5) Update, filtrando también por la propiedad verificada
		const payload: TablesUpdate<'property_data'> = {
			name: loc.name,
			description: loc.description,
			image_url: imageUrl,
			featured: loc.featured,
			must_visit: loc.must_visit,
			updated_at: new Date().toISOString(),
		};

		const { error: updateErr } = await db
			.from('property_data')
			.update(payload)
			.eq('id', loc.location_id)
			.eq('property_id', existing.property_id);

		if (updateErr) {
			// Ninguna fila apunta a lo recién subido: no dejarlo huérfano
			await removePublicImages(db, 'location-images', user.id, [
				uploadedImageUrl,
			]);

			// unique_location_entry_per_property: ya hay un sitio con ese
			// nombre en la misma ubicación y subcategoría
			if (updateErr.code === '23505') {
				return { errors: { name: ['locationDuplicateName'] } };
			}

			console.error('Error actualizando location:', updateErr);
			return { errors: { server: ['locationSaveError'] } };
		}

		// 6) La imagen anterior ya no la referencia ninguna fila
		if (imageUrl !== existing.image_url) {
			await removePublicImages(db, 'location-images', user.id, [
				existing.image_url,
			]);
		}

		// 7) Traducciones: en la guía la traducción tiene prioridad sobre el
		// original, así que las de los campos cambiados se borran antes de
		// retraducir. Si translateAndStore no traduce (texto corto o sin
		// cuota), la guía muestra el texto nuevo en vez del antiguo traducido.
		const changedFields = TRANSLATABLE_FIELDS.filter(
			(field) => (existing[field] ?? '') !== loc[field],
		);

		if (changedFields.length > 0) {
			const { error: deleteTrErr } = await db
				.from('property_data_translations')
				.delete()
				.eq('property_data_id', loc.location_id)
				.in('field_key', changedFields);

			if (deleteTrErr) {
				console.error(
					'[updateLocation] Error borrando traducciones:',
					deleteTrErr,
				);
			}

			// after(): se ejecuta tras responder sin bloquear al anfitrión, y en
			// serverless (Vercel) mantiene viva la función hasta que termina
			after(() =>
				translateAndStore(
					loc.location_id,
					{ type: 'user', userId: user.id },
					changedFields.map((field) => ({
						fieldKey: field,
						value: loc[field],
					})),
				).catch((err) =>
					console.error('[updateLocation] Error en traducción:', err),
				),
			);
		}

		// Marcar última actividad de la propiedad (dashboard)
		await touchPropertyUpdatedAt(db, existing.property_id);

		revalidatePath('/app');

		return {
			success: true,
			redirectTo: '/app/properties',
		};
	} catch (error: unknown) {
		console.error('Error inesperado al actualizar el sitio:', error);
		return {
			errors: {
				server: ['locationSaveError'],
			},
		};
	}
}
