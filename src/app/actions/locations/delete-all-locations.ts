'use server';

import { revalidatePath } from 'next/cache';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { z } from 'zod';

const DeleteAllSchema = z.object({
	property_id: z.string().uuid(),
	sub_category_id: z.string().uuid(),
});

export type DeleteAllLocationsState = {
	success?: boolean;
	errors?: {
		property_id?: string[];
		sub_category_id?: string[];
		server?: string[];
	};
	message?: string;
	redirectTo?: string;
};

export async function deleteAllLocations(
	formData: FormData
): Promise<DeleteAllLocationsState> {
	const raw = {
		property_id: formData.get('property_id'),
		sub_category_id: formData.get('sub_category_id'),
	};

	const parsed = DeleteAllSchema.safeParse(raw);
	if (!parsed.success) {
		const errs = parsed.error.flatten().fieldErrors;
		return { errors: errs };
	}

	const { property_id, sub_category_id } = parsed.data;

	try {
		const supabase = await createServerAdminClient();

		const { data: items, error: fetchError } = await supabase
			.from('property_data')
			.select('id, image_url')
			.eq('property_id', property_id)
			.eq('sub_category_id', sub_category_id);

		if (fetchError) {
			return {
				errors: {
					server: [
						'No se pudieron obtener las localizaciones a eliminar',
					],
				},
			};
		}

		const imagePaths = items
			.map((item) => {
				if (!item.image_url) return null;
				const [, path] = item.image_url.split(
					'/storage/v1/object/public/location-images/'
				);
				return path || null;
			})
			.filter(Boolean) as string[];

		if (imagePaths.length > 0) {
			await supabase.storage.from('location-images').remove(imagePaths);
		}

		const { error: deleteError } = await supabase
			.from('property_data')
			.delete()
			.eq('property_id', property_id)
			.eq('sub_category_id', sub_category_id);

		if (deleteError) {
			return {
				errors: {
					server: ['No se pudieron eliminar las localizaciones'],
				},
			};
		}

		revalidatePath('/app/properties');

		return {
			success: true,
			message: 'Todas las localizaciones han sido eliminadas',
			redirectTo: '/app/properties',
		};
	} catch (error) {
		console.error('Error al eliminar localizaciones por grupo:', error);
		return {
			errors: {
				server: ['Error inesperado al eliminar las localizaciones'],
			},
		};
	}
}
