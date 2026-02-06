'use server';

import { revalidatePath } from 'next/cache';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { touchPropertyUpdatedAt } from '@/lib/properties/touch-property';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables } from '@/lib/types';
import { updatePropertyProgressAndTrack } from '@/lib/updatePropertyProgress';

export async function deleteLocation(locationId: string) {
	const supabase =
		(await createServerAdminClient()) as unknown as SupabaseClient<Database>;
	const db = supabase;

	type LocMeta = Pick<
		Tables<'property_data'>,
		'image_url' | 'property_id' | 'user_id'
	>;

	// 1) Leer meta (para borrar imagen + recalcular progreso)
	const { data: loc, error: fetchErr } = await db
		.from('property_data')
		.select('image_url, property_id, user_id')
		.eq('id', locationId)
		.single()
		.overrideTypes<LocMeta, { merge: false }>();

	if (!fetchErr && loc?.image_url) {
		const [, path] = loc.image_url.split(
			'/storage/v1/object/public/location-images/',
		);
		if (path) {
			await db.storage.from('location-images').remove([path]);
		}
	}

	// 2) Borrar el registro
	const { error: delErr } = await db
		.from('property_data')
		.delete()
		.eq('id', locationId);
	if (delErr) throw new Error('No se pudo eliminar el sitio');

	if (!fetchErr && loc?.property_id) {
		await touchPropertyUpdatedAt(db, loc.property_id);
	}

	// 3) Recalcular progreso (best-effort)
	if (!fetchErr && loc?.property_id && loc?.user_id) {
		await updatePropertyProgressAndTrack({
			db,
			userId: loc.user_id,
			propertyId: loc.property_id,
		});
	}

	// 4) Revalidar
	revalidatePath(`/app/properties`);
}
