// app/actions/locations/delete-location.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';

export async function deleteLocation(locationId: string) {
	const supabase = await createServerAdminClient();

	// 1) Borrar la imagen del bucket (si existe)
	const { data: loc, error: fetchErr } = await supabase
		.from('locations')
		.select('image_url')
		.eq('id', locationId)
		.single();
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
		.from('locations')
		.delete()
		.eq('id', locationId);
	if (delErr) throw new Error('No se pudo eliminar el sitio');

	// 3) Revalidar la ruta de ese grupo
	revalidatePath(`/app/properties`);
}
