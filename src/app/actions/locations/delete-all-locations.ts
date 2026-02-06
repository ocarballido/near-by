'use server';

import { revalidatePath } from 'next/cache';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { createSSRClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { touchPropertyUpdatedAt } from '@/lib/properties/touch-property';

import type { SupabaseClient } from '@supabase/supabase-js';
import { updatePropertyProgressAndTrack } from '@/lib/updatePropertyProgress';
import type { Tables, Database } from '@/lib/types';

type PDThumb = Pick<Tables<'property_data'>, 'id' | 'image_url'>;

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
	formData: FormData,
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

	// ✅ Auth (consistente con el resto de actions)
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

	try {
		const supabase =
			(await createServerAdminClient()) as unknown as SupabaseClient<Database>;
		const db = supabase;

		// ✅ Ownership check (mínimo)
		type PropOwner = { user_id: string };
		const { data: prop, error: propErr } = await supabase
			.from('properties')
			.select('user_id')
			.eq('id', property_id)
			.single()
			.overrideTypes<PropOwner, { merge: false }>();

		if (propErr || !prop?.user_id) {
			return { errors: { server: ['Propiedad no encontrada.'] } };
		}

		if (prop.user_id !== user.id) {
			return {
				errors: {
					server: ['No tienes permisos sobre esta propiedad.'],
				},
			};
		}

		const { data: itemsRes, error: fetchError } = await supabase
			.from('property_data')
			.select('id, image_url')
			.eq('property_id', property_id)
			.eq('sub_category_id', sub_category_id)
			.overrideTypes<PDThumb[], { merge: false }>();

		if (fetchError) {
			return {
				errors: {
					server: [
						'No se pudieron obtener las localizaciones a eliminar',
					],
				},
			};
		}

		const items: PDThumb[] = itemsRes ?? [];

		const imagePaths = items
			.map((item) => {
				if (!item.image_url) return null;
				const [, path] = item.image_url.split(
					'/storage/v1/object/public/location-images/',
				);
				return path || null;
			})
			.filter(Boolean) as string[];

		if (imagePaths.length > 0) {
			await supabase.storage.from('location-images').remove(imagePaths);
		}

		const { error: deleteError } = await db
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

		// Marcar última actividad de la propiedad (dashboard)
		await touchPropertyUpdatedAt(db, property_id);

		await updatePropertyProgressAndTrack({
			db,
			userId: user.id,
			propertyId: property_id,
		});

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
