'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createSSRClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { MAX_IMAGE_SIZE } from '@/config/config-constants';

// 1) Definimos un esquema Zod para validar el formulario
const LocationSchema = z.object({
	property_id: z.string().uuid(),
	group_id: z.string().uuid(),
	name: z.string().nonempty('El nombre es obligatorio'),
	address: z.string().nonempty('La dirección es obligatoria'),
	description: z.string().optional().default(''),
	latitude: z.preprocess((v) => (v ? Number(v) : NaN), z.number().finite()),
	longitude: z.preprocess((v) => (v ? Number(v) : NaN), z.number().finite()),
	website: z.string().url().optional().or(z.literal('')),
	phone: z.string().optional().or(z.literal('')),
});

// 2) Tipo para el estado de la acción
export type LocationFormState = {
	errors?: {
		property_id?: string[];
		group_id?: string[];
		name?: string[];
		address?: string[];
		image?: string[];
		server?: string[];
	};
	success?: boolean;
	message?: string;
	redirectTo?: string;
};

export async function createLocation(
	formData: FormData
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
		// const userId = user.id;

		const supabase = await createServerAdminClient();

		// 4) Recolectar datos y validarlos con Zod
		const raw = {
			property_id: formData.get('property_id'),
			group_id: formData.get('group_id'),
			name: formData.get('name'),
			address: formData.get('address'),
			// si no vienen, que sean cadena vacía
			description: (formData.get('description') as string) ?? '',
			website: (formData.get('website') as string) ?? '',
			phone: (formData.get('phone') as string) ?? '',
			latitude: formData.get('latitude'),
			longitude: formData.get('longitude'),
		};

		const result = LocationSchema.safeParse(raw);
		if (!result.success) {
			const fe = result.error.flatten().fieldErrors;
			return {
				errors: {
					property_id: fe.property_id,
					group_id: fe.group_id,
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
					upErr
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

		console.log('📝 Intentando insertar location:', loc);
		// 6) Insertar el nuevo location
		const { error: insErr } = await supabase.from('locations').insert({
			property_id: loc.property_id,
			group_id: loc.group_id,
			name: loc.name,
			address: loc.address,
			description: loc.description,
			latitude: loc.latitude,
			longitude: loc.longitude,
			website: loc.website || null,
			phone: loc.phone || null,
			image_url,
		});
		console.log('🛠 Resultado insert:', insErr);
		if (insErr) {
			return { errors: { server: ['Error creando el location'] } };
		}

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
