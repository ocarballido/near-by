// app/actions/properties/delete-property.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { createSSRClient } from '@/lib/supabase/server';
import { trackEvent } from '@/lib/analytics/mixpanel';
import { checkPropertyOwner } from '@/lib/properties/check-property-owner';
import { removePublicImages } from '@/lib/storage/remove-public-images';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables } from '@/lib/types';

// type LocationGroupRow = Database['public']['Tables']['location_groups']['Row'];

export async function deleteProperty(propertyId: string) {
	const ssrClient = await createSSRClient();
	const {
		data: { user },
		error: authError,
	} = await ssrClient.auth.getUser();

	if (authError || !user) {
		throw new Error('No has iniciado sesión o tu sesión ha expirado');
	}
	const userId = user.id;

	// 1️⃣ Cliente con Service Role para ignorar RLS
	const supabase = await createServerAdminClient();
	const db = supabase as unknown as SupabaseClient<Database>;

	const owner = await checkPropertyOwner(db, propertyId, userId);
	if (!owner.ok) {
		throw new Error('No tienes permisos sobre esta propiedad.');
	}

	type PropImages = Pick<Tables<'properties'>, 'image_url' | 'logo_url'>;

	// Recuperar las URLs de imagen y logo para borrarlas del bucket
	const { data: propData, error: propFetchErr } = await supabase
		.from('properties')
		.select('image_url, logo_url')
		.eq('id', propertyId)
		.single()
		.overrideTypes<PropImages, { merge: false }>();

	if (propFetchErr) {
		console.error(
			'Error obteniendo property para borrar imagen:',
			propFetchErr,
		);
		throw new Error('Error base de datos');
	}

	const imageUrl = propData?.image_url;

	type PDImageOnly = Pick<Tables<'property_data'>, 'image_url'>;

	// property_data se borra en cascada con la propiedad: las imágenes de sus
	// sitios se leen antes, mientras las filas existen
	const { data: dataImages, error: dataImagesErr } = await supabase
		.from('property_data')
		.select('image_url')
		.eq('property_id', propertyId)
		.not('image_url', 'is', null)
		.overrideTypes<PDImageOnly[], { merge: false }>();

	if (dataImagesErr) {
		console.error(
			'Error obteniendo imágenes de property_data:',
			dataImagesErr,
		);
		throw new Error('Error base de datos');
	}

	const { error: infoDelErr } = await supabase
		.from('property_info')
		.delete()
		.eq('property_id', propertyId);
	if (infoDelErr) {
		console.error('Error eliminando property_info:', infoDelErr);
		throw new Error('No se pudieron eliminar los datos informativos');
	}

	type GroupIdOnly = Pick<Tables<'location_groups'>, 'id'>;

	// Obtener todos los grupos de esa propiedad
	const { data: groups, error: groupFetchErr } = await supabase
		.from('location_groups')
		.select('id')
		.eq('property_id', propertyId)
		.overrideTypes<GroupIdOnly[], { merge: false }>();

	if (groupFetchErr) {
		console.error('Error fetching groups to delete:', groupFetchErr);
		throw new Error('Error base de datos');
	}

	// Si hay grupos, eliminar primero los locations
	const groupIds = groups?.map((g) => g.id) ?? [];
	if (groupIds.length > 0) {
		const { error: locDelErr } = await supabase
			.from('locations')
			.delete()
			.in('group_id', groupIds);
		if (locDelErr) {
			console.error('Error deleting locations:', locDelErr);
			throw new Error('Error base de datos');
		}
	}

	// Eliminar los grupos de ubicación
	const { error: grpDelErr } = await supabase
		.from('location_groups')
		.delete()
		.eq('property_id', propertyId);
	if (grpDelErr) {
		console.error('Error deleting location_groups:', grpDelErr);
		throw new Error('Error base de datos');
	}

	// Finalmente eliminar la propiedad
	const { error: propDelErr } = await supabase
		.from('properties')
		.delete()
		.eq('id', propertyId);
	if (propDelErr) {
		console.error('Error deleting property:', propDelErr);
		throw new Error('Error base de datos');
	}

	// Storage después de borrar en BD: si algo falla antes, ninguna fila
	// queda apuntando a un fichero borrado
	await removePublicImages(db, 'property-images', userId, [imageUrl]);
	await removePublicImages(db, 'property-logos', userId, [
		propData?.logo_url,
	]);
	await removePublicImages(
		db,
		'location-images',
		userId,
		dataImages.map((row) => row.image_url),
	);

	await trackEvent({
		event: 'property_deleted',
		distinctId: userId,
		props: {
			property_id: propertyId,
			had_image: Boolean(imageUrl),
			deleted_location_groups_count: groupIds.length,
		},
	});

	// Invalidar cache/listado
	revalidatePath('/app/properties');
}
