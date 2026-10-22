'use server';

import { revalidatePath } from 'next/cache';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { createSSRClient } from '@/lib/supabase/server';
import { touchPropertyUpdatedAt } from '@/lib/properties/touch-property';
import { checkPropertyOwner } from '@/lib/properties/check-property-owner';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables } from '@/lib/types';
import { updatePropertyProgressAndTrack } from '@/lib/updatePropertyProgress';

export async function deleteLocation(locationId: string) {
	const ssrClient = await createSSRClient();
	const {
		data: { user },
		error: authError,
	} = await ssrClient.auth.getUser();

	if (authError || !user) {
		throw new Error('No has iniciado sesión o tu sesión ha expirado');
	}

	const supabase =
		(await createServerAdminClient()) as unknown as SupabaseClient<Database>;
	const db = supabase;

	type LocMeta = Pick<Tables<'property_data'>, 'image_url' | 'property_id'>;

	// 1) Leer meta (para ownership + borrar imagen + recalcular progreso)
	const { data: loc, error: fetchErr } = await db
		.from('property_data')
		.select('image_url, property_id')
		.eq('id', locationId)
		.single()
		.overrideTypes<LocMeta, { merge: false }>();

	if (fetchErr || !loc?.property_id) {
		throw new Error('No se ha encontrado el sitio');
	}

	const owner = await checkPropertyOwner(db, loc.property_id, user.id);
	if (!owner.ok) {
		throw new Error('No tienes permisos sobre esta propiedad.');
	}

	// 2) Borrar el registro (filtrando por la propiedad verificada) antes que
	// la imagen: si falla, la fila no queda apuntando a un fichero borrado
	const { error: delErr } = await db
		.from('property_data')
		.delete()
		.eq('id', locationId)
		.eq('property_id', loc.property_id);
	if (delErr) throw new Error('No se pudo eliminar el sitio');

	if (loc.image_url) {
		const [, path] = loc.image_url.split(
			'/storage/v1/object/public/location-images/',
		);
		if (path) {
			await db.storage.from('location-images').remove([path]);
		}
	}

	await touchPropertyUpdatedAt(db, loc.property_id);

	// 3) Recalcular progreso (best-effort)
	await updatePropertyProgressAndTrack({
		db,
		userId: user.id,
		propertyId: loc.property_id,
	});

	// 4) Revalidar
	revalidatePath(`/app/properties`);
}
