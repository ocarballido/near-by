'use server';

import { revalidatePath } from 'next/cache';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { createSSRClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { touchPropertyUpdatedAt } from '@/lib/properties/touch-property';
import { removePublicImages } from '@/lib/storage/remove-public-images';

import type { SupabaseClient } from '@supabase/supabase-js';
import { updatePropertyProgressAndTrack } from '@/lib/updatePropertyProgress';
import type { Tables, Database } from '@/lib/types';

type PDImageOnly = Pick<Tables<'property_data'>, 'image_url'>;

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

		// .select() devuelve las filas borradas: sus imágenes salen del mismo
		// delete, sin una lectura previa que pueda quedar desfasada
		const { data: deletedItems, error: deleteError } = await db
			.from('property_data')
			.delete()
			.eq('property_id', property_id)
			.eq('sub_category_id', sub_category_id)
			.select('image_url')
			.overrideTypes<PDImageOnly[], { merge: false }>();

		if (deleteError) {
			return {
				errors: {
					server: ['No se pudieron eliminar las localizaciones'],
				},
			};
		}

		// Imágenes después de borrar las filas: si el delete falla, ninguna
		// fila queda apuntando a un fichero borrado
		await removePublicImages(
			db,
			'location-images',
			user.id,
			deletedItems.map((item) => item.image_url),
		);

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
