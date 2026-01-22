'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createSSRClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { MAX_IMAGE_SIZE } from '@/config/config-constants';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables, TablesInsert, TablesUpdate } from '@/lib/types';

import { updatePropertyProgressAndTrack } from '@/lib/updatePropertyProgress';

// 1) Definimos un esquema Zod para validar el formulario
const LocationSchema = z.object({
	property_id: z.string().uuid(),
	sub_category_id: z.string().uuid(),
	category_id: z.string().uuid(),
	name: z.string().nonempty('El nombre es obligatorio'),
	address: z.string().nonempty('La dirección es obligatoria'),
	description: z.string().optional().default(''),
	latitude: z.preprocess((v) => (v ? Number(v) : NaN), z.number().finite()),
	longitude: z.preprocess((v) => (v ? Number(v) : NaN), z.number().finite()),
	featured: z
		.preprocess((v) => v === 'true' || v === true, z.boolean())
		.optional()
		.default(false),
	must_visit: z
		.preprocess((v) => v === 'true' || v === true, z.boolean())
		.optional()
		.default(false),
});

// 2) Tipo para el estado de la acción
export type LocationFormState = {
	errors?: {
		property_id?: string[];
		sub_category_id?: string[];
		name?: string[];
		address?: string[];
		description?: string[];
		image?: string[];
		server?: string[];
	};
	success?: boolean;
	message?: string;
	redirectTo?: string;
};

export async function createLocation(
	formData: FormData,
): Promise<LocationFormState> {
	try {
		// 3) Autenticación
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

		const supabase = await createServerAdminClient();

		const db = supabase as unknown as SupabaseClient<Database>;

		// 4) Recolectar datos y validarlos con Zod
		const raw = {
			property_id: formData.get('property_id'),
			sub_category_id: formData.get('sub_category_id'),
			category_id: formData.get('category_id'),
			name: formData.get('name'),
			address: formData.get('address'),
			description: (formData.get('description') as string) ?? '',
			latitude: formData.get('latitude'),
			longitude: formData.get('longitude'),
			featured: formData.get('featured'),
			must_visit: formData.get('must_visit'),
		};

		const result = LocationSchema.safeParse(raw);
		if (!result.success) {
			const fe = result.error.flatten().fieldErrors;
			return {
				errors: {
					property_id: fe.property_id,
					sub_category_id: fe.sub_category_id,
					name: fe.name,
					address: fe.address,
				},
			};
		}
		const loc = result.data;

		// 5) Procesar imagen, si hay
		const imageFile = formData.get('image') as File | null;
		let image_url: string | null = null;
		if (imageFile && imageFile.size > 0) {
			if (imageFile.size > MAX_IMAGE_SIZE) {
				return {
					errors: {
						image: [
							`La imagen no debe superar ${(
								MAX_IMAGE_SIZE / 1024
							).toFixed(0)} KB`,
						],
					},
				};
			}
			const valid = [
				'image/jpeg',
				'image/png',
				'image/webp',
				'image/gif',
			];
			if (!valid.includes(imageFile.type)) {
				return {
					errors: {
						image: ['Formato de imagen inválido'],
					},
				};
			}
			const ext = imageFile.name.split('.').pop();
			const fileName = `${user.id}/location_${Date.now()}.${ext}`;
			const { error: upErr } = await supabase.storage
				.from('location-images')
				.upload(fileName, imageFile, {
					cacheControl: '3600',
					upsert: false,
				});
			if (upErr) {
				console.error(
					'Error subiendo imagen a location-images:',
					upErr,
				);
				return {
					errors: {
						server: [
							'Error subiendo la imagen al bucket. Por favor revisa la consola del servidor.',
						],
					},
				};
			}
			const {
				data: { publicUrl },
			} = supabase.storage.from('location-images').getPublicUrl(fileName);
			image_url = publicUrl;
		}

		// Verificar si ya existe por unique key: property_id + name + lat + lng
		type IdOnly = Pick<Tables<'property_data'>, 'id'>;
		const { data: existing, error: findErr } = await db
			.from('property_data')
			.select('id')
			.eq('property_id', loc.property_id)
			.eq('name', loc.name)
			.eq('latitude', loc.latitude)
			.eq('longitude', loc.longitude)
			.limit(1)
			.maybeSingle()
			.overrideTypes<IdOnly, { merge: false }>();

		if (findErr) {
			console.error('Error comprobando existencia:', findErr);
			return {
				errors: {
					server: ['Error comprobando datos duplicados.'],
				},
			};
		}

		if (existing) {
			// 7) Actualizar si ya existe — mismo shape, sólo tipado y call-site neutralizado
			type PDUpdate = TablesUpdate<'property_data'>;
			const updatePayload: PDUpdate = {
				address: loc.address,
				description: loc.description,
				image_url,
				featured: loc.featured,
				must_visit: loc.must_visit,
				updated_at: new Date().toISOString(),
			};

			const { error: updateErr } = await db
				.from('property_data')
				.update(updatePayload)
				.eq('id', existing.id);

			if (updateErr) {
				console.error('Error actualizando location:', updateErr);
				return {
					errors: { server: ['Error actualizando el sitio.'] },
				};
			}
		} else {
			// 8) Insertar si no existe — mismo shape, sólo tipado y call-site neutralizado
			type PDInsert = TablesInsert<'property_data'>;
			const insertPayload: PDInsert = {
				user_id: user.id,
				property_id: loc.property_id,
				category_id: loc.category_id,
				sub_category_id: loc.sub_category_id,
				type: 'location',
				name: loc.name,
				address: loc.address,
				description: loc.description,
				latitude: loc.latitude,
				longitude: loc.longitude,
				image_url,
				featured: loc.featured,
				must_visit: loc.must_visit,
			};

			const { error: insertErr } = await db
				.from('property_data')
				.insert(insertPayload);

			if (insertErr) {
				console.error('Error insertando location:', insertErr);
				return {
					errors: { server: ['Error creando el sitio.'] },
				};
			}
		}

		// Mixpanel
		await updatePropertyProgressAndTrack({
			db,
			userId: user.id,
			propertyId: loc.property_id,
		});

		// 7) Revalidar la lista de locations de esa propiedad
		revalidatePath(`/app`);

		return {
			success: true,
			message: 'Sitio añadido correctamente',
			redirectTo: `/app/properties`,
		};
	} catch (error: unknown) {
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
