// app/actions/properties.ts
'use server';

// import { getTranslations } from 'next-intl/server';

import { revalidatePath } from 'next/cache';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { createSSRClient } from '@/lib/supabase/server';
// import { MAX_IMAGE_SIZE } from '@/config/config-constants';
import { CATEGORIES_SUB_CATEGORIES } from '@/config/config-constants';
import { z } from 'zod';

import { trackEvent } from '@/lib/analytics/mixpanel';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, TablesInsert } from '@/lib/types';

import { uploadPropertyImage } from '@/lib/uploadPropertyImage';
import { seedLodgingContent } from '@/lib/seedLodgingContent';

// Esquema de validación con Zod
const PropertySchema = z.object({
	name: z.string().nonempty('El nombre de la propiedad es obligatorio'),
	description: z.preprocess(
		(v) => (typeof v === 'string' ? v : ''),
		z.string(),
	),
	address: z.string().nonempty('La dirección es obligatoria'),
	latitude: z.preprocess(
		(v) => (v ? Number(v) : null),
		z.number().nullable(),
	),
	longitude: z.preprocess(
		(v) => (v ? Number(v) : null),
		z.number().nullable(),
	),
});

// Tipo para los errores de validación
export type FormState = {
	errors?: {
		name?: string[];
		description?: string[];
		address?: string[];
		image?: string[];
		server?: string[];
	};
	message?: string;
	success?: boolean;
	redirectTo?: string;
};

/**
 * Server Action para crear una nueva propiedad
 */
export async function createProperty(formData: FormData): Promise<FormState> {
	// 1. Inicializar el estado y el cliente
	try {
		// 2. Verificar autenticación
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

		const supabase = await createServerAdminClient();
		const db = supabase as unknown as SupabaseClient<Database>;

		// 3. Extraer y validar los datos del formulario
		const rawData = {
			name: formData.get('name'),
			description: formData.get('description'),
			address: formData.get('address'),
			latitude: formData.get('latitude'),
			longitude: formData.get('longitude'),
		};

		// 4. Validar con Zod
		const parseResult = PropertySchema.safeParse(rawData);

		if (!parseResult.success) {
			const fieldErrors = parseResult.error.flatten().fieldErrors;
			return {
				errors: {
					name: fieldErrors.name,
					description: fieldErrors.description,
					address: fieldErrors.address,
				},
			};
		}

		const validated = parseResult.data;

		// 5. Procesar la imagen si existe
		const imageFile = formData.get('image') as File | null;

		const uploadRes = await uploadPropertyImage({
			db,
			userId,
			imageFile,
		});

		if (!uploadRes.ok) return uploadRes.errorState;

		const imageUrl = uploadRes.imageUrl;

		// 8. Crear la propiedad en la base de datos
		type IdSlug = { id: string; slug: string | null };

		const payload: TablesInsert<'properties'> = {
			user_id: userId,
			name: validated.name,
			description: validated.description,
			address: validated.address,
			latitude: validated.latitude,
			longitude: validated.longitude,
			image_url: imageUrl,
		};

		const { data, error: insertError } = await db
			.from('properties')
			.insert(payload)
			.select('id, slug')
			.single();

		const property = data as IdSlug | null;

		if (insertError || !property?.id) {
			console.error('Error al crear propiedad:', insertError);
			return {
				errors: {
					server: [
						'Error al crear el alojamiento. Por favor, inténtalo de nuevo.',
					],
				},
			};
		}

		// 5) Seed de contenidos automáticos (texto) para "El Alojamiento"
		//    Importante: se obtiene el locale desde el formData (añádelo en el cliente)
		const localeRaw = formData.get('locale');
		const locale =
			typeof localeRaw === 'string' && localeRaw.length > 0
				? localeRaw
				: 'es';

		await trackEvent({
			event: 'create_property_completed',
			distinctId: userId,
			props: {
				property_id: property.id,
				locale,
				has_image: Boolean(imageUrl),
				has_description: Boolean(
					validated.description &&
					validated.description.trim().length > 0,
				),
			},
		});

		// ✅ Seed selection (sub_category_ids) desde el cliente
		const seedInfoIdsRaw = formData.get('seedInfoIds');

		let selectedSeedSubCategoryIds: string[] | undefined = undefined;

		if (typeof seedInfoIdsRaw === 'string') {
			try {
				const parsed = JSON.parse(seedInfoIdsRaw);
				if (
					Array.isArray(parsed) &&
					parsed.every((x) => typeof x === 'string')
				) {
					selectedSeedSubCategoryIds = parsed;
				}
			} catch {}
		}

		// Namespace sugerido: "seed.lodging"
		// Keys esperadas: wifi, manual, schedule, recycling, rules
		await seedLodgingContent({
			db,
			userId,
			propertyId: property.id,
			locale,
			selectedSubCategoryIds: selectedSeedSubCategoryIds,
		});

		// 10. Revalidar la ruta del dashboard para mostrar la nueva propiedad
		revalidatePath('/app');

		// 11. Redirigir a la página de edición de la propiedad
		// const firstCat = categories?.[0];
		const redirectTo = `/app/properties/${property.id}/${CATEGORIES_SUB_CATEGORIES.LODGING.id}/${CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.MANUAL.id}`;

		// if (firstCat) {
		// 	const catId = firstCat.id;
		// 	redirectTo += `/${catId}`;
		// }

		// Nunca se llegará aquí debido al redirect, pero TypeScript lo necesita
		return {
			success: true,
			message: 'Propiedad creada correctamente',
			redirectTo,
		};
	} catch (error: unknown) {
		console.error('Error inesperado al crear propiedad:', error);

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
