// app/actions/properties.ts
'use server';

import { getTranslations } from 'next-intl/server';

import { revalidatePath } from 'next/cache';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { createSSRClient } from '@/lib/supabase/server';
import { MAX_IMAGE_SIZE } from '@/config/config-constants';
import { CATEGORIES_SUB_CATEGORIES } from '@/config/config-constants';
import { z } from 'zod';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, TablesInsert } from '@/lib/types';

// Esquema de validación con Zod
const PropertySchema = z.object({
	name: z.string().nonempty('El nombre de la propiedad es obligatorio'),
	description: z.preprocess(
		(v) => (typeof v === 'string' ? v : ''),
		z.string()
	),
	address: z.string().nonempty('La dirección es obligatoria'),
	latitude: z.preprocess(
		(v) => (v ? Number(v) : null),
		z.number().nullable()
	),
	longitude: z.preprocess(
		(v) => (v ? Number(v) : null),
		z.number().nullable()
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
		let imageUrl: string | null = null;

		if (imageFile && imageFile.size > 0) {
			// Validar tamaño
			if (imageFile.size > MAX_IMAGE_SIZE) {
				return {
					errors: {
						image: [
							`La imagen no debe superar los 500 KB. Tamaño actual: ${(
								imageFile.size / 1024
							).toFixed(2)} KB`,
						],
					},
				};
			}

			// Validar tipo
			const validImageTypes = [
				'image/jpeg',
				'image/png',
				'image/webp',
				'image/gif',
			];
			if (!validImageTypes.includes(imageFile.type)) {
				return {
					errors: {
						image: [
							'El archivo debe ser una imagen (JPEG, PNG, WebP o GIF)',
						],
					},
				};
			}

			// Subir imagen
			const fileExt = imageFile.name.split('.').pop();
			const fileName = `${userId}/property_${Date.now()}.${fileExt}`;

			const { error: uploadError } = await db.storage
				.from('property-images')
				.upload(fileName, imageFile, {
					cacheControl: '3600',
					upsert: false,
				});

			if (uploadError) {
				console.error('Error al subir imagen:', uploadError);
				return {
					errors: {
						image: [
							'Error al subir la imagen. Por favor, inténtalo de nuevo.',
						],
					},
				};
			}

			// Obtener URL pública
			const {
				data: { publicUrl },
			} = db.storage.from('property-images').getPublicUrl(fileName);
			imageUrl = publicUrl;
		}

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

		// Namespace sugerido: "seed.lodging"
		// Keys esperadas: wifi, manual, schedule, recycling, rules
		try {
			const tSeed = await getTranslations({
				locale,
				namespace: 'seed.lodging',
			});

			const lodgingCategoryId = CATEGORIES_SUB_CATEGORIES.LODGING.id;

			const seedRows = [
				{
					user_id: userId,
					property_id: property.id,
					category_id: lodgingCategoryId,
					sub_category_id:
						CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.WIFI
							.id,
					type: 'info',
					description: tSeed('wifi'),
					name: null,
				},
				{
					user_id: userId,
					property_id: property.id,
					category_id: lodgingCategoryId,
					sub_category_id:
						CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.MANUAL
							.id,
					type: 'info',
					description: tSeed('manual'),
					name: null,
				},
				{
					user_id: userId,
					property_id: property.id,
					category_id: lodgingCategoryId,
					sub_category_id:
						CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES
							.SCHEDULE.id,
					type: 'info',
					description: tSeed('schedule'),
					name: null,
				},
				{
					user_id: userId,
					property_id: property.id,
					category_id: lodgingCategoryId,
					sub_category_id:
						CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.RECYCLE
							.id,
					type: 'info',
					description: tSeed('recycling'),
					name: null,
				},
				{
					user_id: userId,
					property_id: property.id,
					category_id: lodgingCategoryId,
					sub_category_id:
						CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.RULES
							.id,
					type: 'info',
					description: tSeed('rules'),
					name: null,
				},
			];

			// Insert en bloque (5 filas). No bloqueamos la creación si falla el seed.
			const { error: seedError } = await db
				.from('property_data')
				.insert(seedRows);

			if (seedError) {
				console.error(
					'Error al insertar seed de property_data:',
					seedError
				);
			}
		} catch (seedTranslationsOrInsertError) {
			// Si falla la carga de traducciones o el insert, no rompemos la creación.
			console.error(
				'Error en seed de contenidos automáticos (traducciones/insert):',
				seedTranslationsOrInsertError
			);
		}

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
