// app/actions/properties/create-info.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createSSRClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';

const CreateInfoSchema = z.object({
	property_id: z.string().uuid(),
	category_id: z.string().uuid(),
	sub_category_id: z.string().uuid(),
	type: z.enum(['info', 'location']),
	content: z.string().nonempty('El contenido es obligatorio'),
});

export type CreateInfoState = {
	errors?: {
		content?: string[];
		server?: string[];
	};
	success?: boolean;
	message?: string;
	redirectTo?: string;
};

export async function updateInfo(formData: FormData): Promise<CreateInfoState> {
	try {
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

		const raw = {
			property_id: formData.get('property_id'),
			category_id: formData.get('category_id'),
			sub_category_id: formData.get('sub_category_id'),
			type: formData.get('type'),
			content: formData.get('content'),
		};

		const parsed = CreateInfoSchema.safeParse(raw);
		if (!parsed.success) {
			const fe = parsed.error.flatten().fieldErrors;
			return {
				errors: {
					content: fe.content,
					server: ['Datos inválidos.'],
				},
			};
		}

		const { property_id, category_id, sub_category_id, type, content } =
			parsed.data;

		const { data: existing, error: findError } = await supabase
			.from('property_data')
			.select('id')
			.eq('user_id', user.id)
			.eq('property_id', property_id)
			.eq('sub_category_id', sub_category_id)
			.eq('type', type)
			.single();

		if (findError && findError.code !== 'PGRST116') {
			// 'PGRST116' = no rows found
			console.error('Error buscando info existente:', findError);
			return {
				errors: {
					server: [
						'No se pudo comprobar si ya existe la información.',
					],
				},
			};
		}

		let dbError = null;

		if (existing) {
			// Actualizar
			const { error } = await supabase
				.from('property_data')
				.update({
					description: content,
					updated_at: new Date().toISOString(),
				})
				.eq('id', existing.id);

			dbError = error;
		} else {
			// Insertar nuevo
			const { error } = await supabase.from('property_data').insert({
				user_id: user.id,
				property_id,
				category_id,
				sub_category_id,
				type,
				description: content,
				name: null,
			});

			dbError = error;
		}

		if (dbError) {
			console.error('Error al guardar en property_data:', dbError);
			return {
				errors: {
					server: ['Error al guardar la información.'],
				},
			};
		}

		revalidatePath(`/app`);

		return {
			success: true,
			message: 'Información actualizada correctamente',
			redirectTo: `/app/properties`,
		};
	} catch (err) {
		console.error('Error inesperado en createInfo:', err);
		return {
			errors: {
				server: ['Error interno del servidor'],
			},
		};
	}
}
