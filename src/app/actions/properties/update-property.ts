'use server';

import { revalidatePath } from 'next/cache';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { CATEGORIES_SUB_CATEGORIES } from '@/config/config-constants';
import { createSSRClient } from '@/lib/supabase/server';
import { z } from 'zod';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, TablesUpdate } from '@/lib/types';

import { translateAndStoreProperty } from '@/lib/translations/translateAndStoreProperty';

import { uploadPropertyImage } from '@/lib/uploadPropertyImage';

// ==============================
// Helpers
// ==============================
const emptyToNull = (v: unknown) => {
	if (typeof v !== 'string') return null;
	const s = v.trim();
	return s.length ? s : null;
};

// ==============================
// Schema (solo lo editable)
// - NO address/lat/lng
// - Campos opcionales de check-in/out
// ==============================
const UpdatePropertySchema = z.object({
	name: z.string().nonempty('El nombre de la propiedad es obligatorio'),
	description: z.preprocess(
		(v) => (typeof v === 'string' ? v : ''),
		z.string(),
	),
	check_in_date: z.preprocess(emptyToNull, z.string().nullable()),
	check_in_time: z.preprocess(emptyToNull, z.string().nullable()),
	check_out_date: z.preprocess(emptyToNull, z.string().nullable()),
	check_out_time: z.preprocess(emptyToNull, z.string().nullable()),
	access_instructions: z.preprocess(emptyToNull, z.string().nullable()),
});

// Tipo para los errores de validación (reutiliza el mismo FormState)
export type FormState = {
	errors?: {
		name?: string[];
		description?: string[];
		address?: string[]; // no se usa aquí, pero lo dejamos por compatibilidad
		image?: string[];
		server?: string[];
	};
	message?: string;
	success?: boolean;
	redirectTo?: string;
};

/**
 * Server Action para actualizar una propiedad existente
 * - Verifica auth
 * - Verifica ownership
 * - Actualiza SOLO campos editables (name, description, check_* y image_url si llega nueva)
 * - Mantiene image_url si no llega imagen nueva
 */
export async function updateProperty(
	propertyId: string,
	formData: FormData,
	redirectAfter?: string,
): Promise<FormState> {
	try {
		// 1) Auth
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
		const userId = user.id;

		// 2) DB client (admin, como create)
		const supabase = await createServerAdminClient();
		const db = supabase as unknown as SupabaseClient<Database>;

		// 3) Verificar que la propiedad existe y pertenece al usuario
		const { data: existing, error: existingError } = await db
			.from('properties')
			.select('id, user_id, image_url')
			.eq('id', propertyId)
			.single();

		if (existingError || !existing?.id) {
			console.error('Error al leer propiedad:', existingError);
			return {
				errors: {
					server: ['No se ha encontrado la propiedad'],
				},
			};
		}

		if (existing.user_id !== userId) {
			return {
				errors: {
					server: ['No tienes permisos para editar esta propiedad'],
				},
			};
		}

		// 4) Extraer + validar datos editables
		const rawData = {
			name: formData.get('name'),
			description: formData.get('description'),
			check_in_date: formData.get('check_in_date'),
			check_in_time: formData.get('check_in_time'),
			check_out_date: formData.get('check_out_date'),
			check_out_time: formData.get('check_out_time'),
			access_instructions: formData.get('access_instructions'),
		};

		const parseResult = UpdatePropertySchema.safeParse(rawData);

		if (!parseResult.success) {
			const fieldErrors = parseResult.error.flatten().fieldErrors;
			return {
				errors: {
					name: fieldErrors.name,
					description: fieldErrors.description,
				},
			};
		}

		const validated = parseResult.data;

		// 5) Imagen (opcional)
		//    - si viene nueva => subimos y usamos nueva URL
		//    - si no viene => mantenemos existing.image_url
		const imageFile = formData.get('image') as File | null;

		let imageUrl = existing.image_url ?? null;

		if (imageFile) {
			const uploadRes = await uploadPropertyImage({
				db,
				userId,
				imageFile,
			});

			if (!uploadRes.ok) return uploadRes.errorState;

			imageUrl = uploadRes.imageUrl;
		}

		// 6) Update en DB (solo lo editable)
		const payload = {
			name: validated.name,
			description: validated.description,
			image_url: imageUrl,
			check_in_date: validated.check_in_date,
			check_in_time: validated.check_in_time,
			check_out_date: validated.check_out_date,
			check_out_time: validated.check_out_time,
			access_instructions: validated.access_instructions,
			updated_at: new Date().toISOString(),
		} satisfies TablesUpdate<'properties'>;

		const { error: updateError } = await db
			.from('properties')
			.update(payload)
			.eq('id', propertyId);

		if (updateError) {
			console.error('Error al actualizar propiedad:', updateError);
			return {
				errors: {
					server: [
						'Error al actualizar el alojamiento. Por favor, inténtalo de nuevo.',
					],
				},
			};
		}

		// Si access_instructions se ha borrado, eliminamos sus traducciones
		if (!validated.access_instructions) {
			await supabase
				.from('property_translations')
				.delete()
				.eq('property_id', propertyId)
				.eq('field_key', 'access_instructions');
		} else {
			const fieldsToTranslate: {
				fieldKey: 'name' | 'access_instructions';
				value: string;
			}[] = [];

			if (validated.name) {
				fieldsToTranslate.push({
					fieldKey: 'name',
					value: validated.name,
				});
			}

			fieldsToTranslate.push({
				fieldKey: 'access_instructions',
				value: validated.access_instructions,
			});

			translateAndStoreProperty(propertyId, fieldsToTranslate).catch(
				(err) =>
					console.error('[updateProperty] Error en traducción:', err),
			);
		}

		revalidatePath('/app');

		const defaultRedirect = `/app/properties/${propertyId}/${CATEGORIES_SUB_CATEGORIES.LODGING.id}/${CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.MANUAL.id}`;

		const redirectTo = redirectAfter ?? defaultRedirect;

		return {
			success: true,
			message: 'Propiedad actualizada correctamente',
			redirectTo,
		};
	} catch (error: unknown) {
		console.error('Error inesperado al actualizar propiedad:', error);

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
