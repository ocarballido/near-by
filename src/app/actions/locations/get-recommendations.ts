'use server';

import { z } from 'zod';
import { createSSRClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types';

import {
	runPlacesSearch,
	type PlaceRecommendation,
} from '@/lib/places/places-engine';

const Schema = z.object({
	propertyId: z.string().uuid(),
	subCategoryId: z.string().uuid(),
	locale: z.string().optional(),
});

const MAX_RESULTS = 5;
export { type PlaceRecommendation };

export async function getPlaceRecommendations(
	propertyId: string,
	subCategoryId: string,
	locale?: string,
): Promise<{
	success: boolean;
	data: PlaceRecommendation[];
	message?: string;
}> {
	const language = locale ? locale.split('-')[0] : undefined;

	if (process.env.RECOMMENDATIONS_GOOGLE_ENABLED !== 'true') {
		return { success: true, data: [] };
	}

	const parsed = Schema.safeParse({ propertyId, subCategoryId, locale });
	if (!parsed.success)
		return { success: false, data: [], message: 'Datos inválidos.' };

	const ssrClient = await createSSRClient();
	const {
		data: { user },
		error: authError,
	} = await ssrClient.auth.getUser();
	if (authError || !user)
		return { success: false, data: [], message: 'No auth.' };

	const apiKey = process.env.GOOGLE_MAPS_BACKEND_KEY;
	if (!apiKey)
		return { success: false, data: [], message: 'Google API key missing.' };

	const supabase =
		(await createServerAdminClient()) as unknown as SupabaseClient<Database>;
	const { data: prop, error: propErr } = await supabase
		.from('properties')
		.select('id,user_id,latitude,longitude')
		.eq('id', propertyId)
		.single();

	if (propErr || !prop?.id)
		return {
			success: false,
			data: [],
			message: 'Propiedad no encontrada.',
		};
	if (prop.user_id !== user.id)
		return { success: false, data: [], message: 'Sin permisos.' };
	if (prop.latitude == null || prop.longitude == null)
		return { success: true, data: [] };

	// ✅ SOLO CURADO
	const recos = await runPlacesSearch({
		apiKey,
		lat: prop.latitude,
		lng: prop.longitude,
		subCategoryId,
		mode: 'curated',
		radius: 0, // ignored in curated (usa radiusForCurated)
		language,
		debugTag: 'recos',
	});

	return { success: true, data: recos.slice(0, MAX_RESULTS) };
}
