// app/actions/locations/delete-location.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';

import type { Tables } from '@/lib/types';

export async function deleteLocation(locationId: string) {
	const supabase = await createServerAdminClient();

	type ImgOnly = Pick<Tables<'property_data'>, 'image_url'>;

	// 1) Borrar la imagen del bucket (si existe)
	const { data: loc, error: fetchErr } = await supabase
		.from('property_data')
		.select('image_url')
		.eq('id', locationId)
		.single()
		.overrideTypes<ImgOnly, { merge: false }>();
	if (!fetchErr && loc?.image_url) {
		const [, path] = loc.image_url.split(
			'/storage/v1/object/public/location-images/'
		);
		if (path) {
			await supabase.storage.from('location-images').remove([path]);
		}
	}

	// 2) Borrar el registro
	const { error: delErr } = await supabase
		.from('property_data')
		.delete()
		.eq('id', locationId);
	if (delErr) throw new Error('No se pudo eliminar el sitio');

	// 3) Revalidar la ruta de ese grupo
	revalidatePath(`/app/properties`);
}
