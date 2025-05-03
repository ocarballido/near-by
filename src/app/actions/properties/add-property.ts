// app/actions/properties.ts
'use server';

import { revalidatePath } from 'next/cache';
// import { redirect } from 'next/navigation';
// import { createSSRSassClient } from '@/lib/supabase/server';
import { generateSlug } from '@/utils/generate-slug';
import { getDefaultGroups } from '@/utils/default-groups';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { createSSRClient } from '@/lib/supabase/server';
import { MAX_IMAGE_SIZE } from '@/config/config-constants';
import { LODGING_CATEGORY_ID } from '@/config/config-constants';
import { z } from 'zod';

// Esquema de validación con Zod
const PropertySchema = z.object({
	name: z.string().nonempty('El nombre de la propiedad es obligatorio'),
	description: z.preprocess(
		(v) => (typeof v === 'string' ? v : ''),
		z.string()
	),
	// description: z.string().optional().default(''),
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
			// throw new Error(
			// 	'Errores en el formulario: ' +
			// 		Object.entries(fieldErrors)
			// 			.map(([k, v]) => `${k}: ${v?.join(',')}`)
			// 			.join('; ')
			// );
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

			const { error: uploadError } = await supabase.storage
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
			} = supabase.storage.from('property-images').getPublicUrl(fileName);

			imageUrl = publicUrl;
		}

		// 6. Verificar límite de suscripción
		// const { data: subscription } = await supabase
		// 	.from('subscriptions')
		// 	.select('plan_id')
		// 	.eq('user_id', userId)
		// 	.eq('status', 'active')
		// 	.single();

		// const planId = subscription?.plan_id || 'free';

		// const { count, error: countError } = await supabase
		// 	.from('properties')
		// 	.select('*', { count: 'exact', head: true })
		// 	.eq('user_id', userId);

		// if (countError) {
		// 	console.error(
		// 		'Error al verificar límite de suscripción:',
		// 		countError
		// 	);
		// 	return {
		// 		errors: {
		// 			server: ['Error al verificar tu plan de suscripción'],
		// 		},
		// 	};
		// }

		// Verificar límites según el plan
		// const PLAN_LIMITS: Record<string, number> = {
		// 	free: 1,
		// 	pro: 5,
		// 	business: Number.POSITIVE_INFINITY,
		// };

		// if (count !== null && count >= PLAN_LIMITS[planId]) {
		// 	return {
		// 		errors: {
		// 			server: [
		// 				`Has alcanzado el límite de alojamientos para tu plan ${planId}. Actualiza tu suscripción para añadir más.`,
		// 			],
		// 		},
		// 	};
		// }

		// 7. Crear un slug único basado en el nombre
		const randomSuffix = Math.random().toString(36).slice(2, 8);
		const baseSlug = generateSlug(validated.name);
		const slug = `${baseSlug}-${randomSuffix}`;

		// 8. Crear la propiedad en la base de datos
		const { data: property, error: insertError } = await supabase
			.from('properties')
			.insert({
				user_id: userId,
				name: validated.name,
				description: validated.description,
				address: validated.address,
				latitude: validated.latitude,
				longitude: validated.longitude,
				image_url: imageUrl,
				slug,
			})
			.select('id, slug')
			.single();

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
		const propertyId = property.id;

		// 9. Crear grupos predeterminados para esta propiedad
		const { data: categories } = await supabase
			.from('categories')
			.select('*')
			.order('order_index');

		const defaultGroups = getDefaultGroups();

		for (const category of categories || []) {
			const names = defaultGroups[category.id] || [];

			if (category.id === LODGING_CATEGORY_ID) {
				// — Para “El Alojamiento”: insertar N filas en property_info
				for (const title of names) {
					const { error: infoErr } = await supabase
						.from('property_info')
						.insert({
							property_id: propertyId,
							category_id: category.id,
							title,
							content: '',
						});

					if (infoErr) {
						throw new Error(
							`Error insertando property_info (“${title}”): ${infoErr.message}`
						);
					}
				}
			} else {
				// — Para las demás categorías: crear location_groups
				for (let idx = 0; idx < names.length; idx++) {
					const name = names[idx];
					const fullSlug = `${property.slug}-${generateSlug(name)}`;

					const { error: lgErr } = await supabase
						.from('location_groups')
						.insert({
							property_id: propertyId,
							category_id: category.id,
							name,
							slug: fullSlug,
							order_index: idx + 1,
						});

					if (lgErr) {
						throw new Error(
							`Error creando location_group (“${name}”): ${lgErr.message}`
						);
					}
				}
			}
		}

		// for (const category of categories || []) {
		// 	const categoryGroups =
		// 		defaultGroups[category.id as keyof typeof defaultGroups] || [];

		// 	for (let idx = 0; idx < categoryGroups.length; idx++) {
		// 		const groupName = categoryGroups[idx];
		// 		const groupSlug = generateSlug(groupName);
		// 		const fullGroupSlug = `${property.slug}-${groupSlug}`;

		// 		// 1) Insertar el location_group
		// 		const { data: lg, error: lgErr } = await supabase
		// 			.from('location_groups')
		// 			.insert({
		// 				property_id: propertyId,
		// 				category_id: category.id,
		// 				name: groupName,
		// 				slug: fullGroupSlug,
		// 				order_index: idx + 1,
		// 			})
		// 			.select()
		// 			.single();

		// 		if (lgErr || !lg?.id) {
		// 			throw new Error('Error base de datos');
		// 		}

		// 		// 2) SOLO para "El Alojamiento", crear UNA entrada en property_info
		// 		if (category.name === 'El Alojamiento' && lg) {
		// 			await supabase.from('property_info').insert({
		// 				property_id: propertyId,
		// 				group_id: lg.id,
		// 				title: groupName, // match con el location_group recién creado
		// 				content: '',
		// 			});
		// 		}
		// 	}
		// }

		// if (categories && categories.length > 0) {
		// 	for (const category of categories) {
		// 		const categoryGroups =
		// 			defaultGroups[
		// 				category.name as keyof typeof defaultGroups
		// 			] || [];
		// 		console.log(
		// 			`✂️ Para categoría "${category.name}" (` +
		// 				`id=${category.id}) → grupos:`,
		// 			categoryGroups
		// 		);

		// 		for (let i = 0; i < categoryGroups.length; i++) {
		// 			const groupName = categoryGroups[i];
		// 			const groupSlug = generateSlug(groupName);
		// 			const { data: inserted, error: groupError } = await supabase
		// 				.from('location_groups')
		// 				.insert({
		// 					property_id: property.id,
		// 					category_id: category.id,
		// 					name: groupName,
		// 					slug: groupSlug,
		// 					is_default: true,
		// 					order_index: i + 1,
		// 				})
		// 				.select()
		// 				.single();

		// 			if (groupError) {
		// 				console.error(
		// 					`❌ Error insertando grupo "${groupName}" ` +
		// 						`para category_id=${category.id}:`,
		// 					groupError
		// 				);
		// 			} else {
		// 				console.log(`✅ Grupo insertado:`, inserted);
		// 			}
		// 		}
		// 	}
		// } else {
		// 	console.warn(
		// 		'⚠️ No hay categorías para procesar grupos predeterminados.'
		// 	);
		// }

		// 10. Revalidar la ruta del dashboard para mostrar la nueva propiedad
		revalidatePath('/app');

		// 11. Redirigir a la página de edición de la propiedad
		const firstCat = categories?.[0];
		let redirectTo = `/app/properties/${property.slug}`;
		if (firstCat) {
			const catId = firstCat.id;
			if (catId === LODGING_CATEGORY_ID) {
				// primer property_info de esa category
				const { data: firstInfo } = await supabase
					.from('property_info')
					.select('id')
					.eq('property_id', propertyId)
					.eq('category_id', catId)
					.order('created_at', { ascending: true })
					.limit(1)
					.single();
				if (firstInfo?.id) {
					redirectTo += `/${catId}/${firstInfo.id}`;
				} else {
					redirectTo += `/${catId}`;
				}
			} else {
				// primer location_group de esa category
				const { data: firstGroup } = await supabase
					.from('location_groups')
					.select('id')
					.eq('property_id', propertyId)
					.eq('category_id', catId)
					.order('order_index', { ascending: true })
					.limit(1)
					.single();
				if (firstGroup?.id) {
					redirectTo += `/${catId}/${firstGroup.id}`;
				} else {
					redirectTo += `/${catId}`;
				}
			}
		}

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
