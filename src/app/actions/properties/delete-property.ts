// app/actions/properties/delete-property.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
// import type { Database } from '@/lib/types';

// type LocationGroupRow = Database['public']['Tables']['location_groups']['Row'];

export async function deleteProperty(propertyId: string) {
	// 1️⃣ Cliente con Service Role para ignorar RLS
	const supabase = await createServerAdminClient();

	// Recuperar la URL de la imagen para borrarla del bucket
	const { data: propData, error: propFetchErr } = await supabase
		.from('properties')
		.select('image_url')
		.eq('id', propertyId)
		.single();
	if (propFetchErr) {
		console.error(
			'Error obteniendo property para borrar imagen:',
			propFetchErr
		);
		throw new Error('Error base de datos');
	}

	const imageUrl = propData?.image_url;
	if (imageUrl) {
		// La ruta interna en Storage viene después de ".../property-images/"
		const parts = imageUrl.split(
			'/storage/v1/object/public/property-images/'
		);
		if (parts[1]) {
			const filePath = parts[1];
			const { error: removeErr } = await supabase.storage
				.from('property-images')
				.remove([filePath]);
			if (removeErr) {
				console.error('Error borrando imagen en Storage:', removeErr);
				// no lanzamos, seguimos con la limpieza de BD
			}
		}
	}

	const { error: infoDelErr } = await supabase
		.from('property_info')
		.delete()
		.eq('property_id', propertyId);
	if (infoDelErr) {
		console.error('Error eliminando property_info:', infoDelErr);
		throw new Error('No se pudieron eliminar los datos informativos');
	}

	// Obtener todos los grupos de esa propiedad
	const { data: groups, error: groupFetchErr } = await supabase
		.from('location_groups')
		.select('id')
		.eq('property_id', propertyId);

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

	// Invalidar cache/listado
	revalidatePath('/app/properties');
}
