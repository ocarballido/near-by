// app/actions/properties/update-info.ts
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createSSRClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';

// 1. Esquema Zod para validar los datos entrantes
const UpdateInfoSchema = z.object({
	info_id: z.string().uuid(),
	content: z.string().nonempty('El contenido es obligatorio'),
});

// 2. Tipo de retorno de la Action
export type UpdateInfoState = {
	errors?: {
		content?: string[];
		server?: string[];
	};
	success?: boolean;
	message?: string;
	redirectTo?: string;
};

/**
 * Action para actualizar el campo `content` de un registro en `property_info`
 */
export async function updateInfo(formData: FormData): Promise<UpdateInfoState> {
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
			info_id: formData.get('info_id'),
			content: formData.get('content'),
		};

		const parsed = UpdateInfoSchema.safeParse(raw);
		if (!parsed.success) {
			const errs = parsed.error.flatten().fieldErrors;
			return { errors: { content: errs.content } };
		}
		const { info_id, content } = parsed.data;

		const { error: updErr } = await supabase
			.from('property_info')
			.update({ content })
			.eq('id', info_id);

		if (updErr) {
			console.error('Error actualizando property_info:', updErr);
			return {
				errors: {
					server: [
						'Error actualizando la información. Por favor, inténtalo de nuevo.',
					],
				},
			};
		}

		// 7. Revalidar la ruta de la vista de la propiedad para que el cliente refresque
		revalidatePath(`/app`);

		return {
			success: true,
			message: 'Información actualizada correctamente',
			redirectTo: `/app/properties`,
		};
	} catch (error: unknown) {
		console.error('Error inesperado en updateInfo:', error);
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
