// app/actions/properties/toggle-featured.ts
'use server';

import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { createSSRClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { touchPropertyUpdatedAt } from '@/lib/properties/touch-property';
import { checkPropertyOwner } from '@/lib/properties/check-property-owner';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables, TablesUpdate } from '@/lib/types';

export async function toggleFeatured(id: string, featured: boolean) {
	const ssrClient = await createSSRClient();
	const {
		data: { user },
		error: authError,
	} = await ssrClient.auth.getUser();

	if (authError || !user) {
		return { success: false };
	}

	const supabase = await createServerAdminClient();

	const db = supabase as unknown as SupabaseClient<Database>;

	type LocOwner = Pick<Tables<'property_data'>, 'property_id'>;

	const { data: loc, error: fetchErr } = await db
		.from('property_data')
		.select('property_id')
		.eq('id', id)
		.single()
		.overrideTypes<LocOwner, { merge: false }>();

	if (fetchErr || !loc?.property_id) {
		return { success: false };
	}

	const owner = await checkPropertyOwner(db, loc.property_id, user.id);
	if (!owner.ok) {
		return { success: false };
	}

	const payload: TablesUpdate<'property_data'> = {
		featured,
		updated_at: new Date().toISOString(),
	};

	// Filtrar también por property_id: la escritura solo cae sobre la fila
	// cuya propiedad acabamos de verificar
	const { error } = await db
		.from('property_data')
		.update(payload)
		.eq('id', id)
		.eq('property_id', loc.property_id);

	if (error) {
		console.error('Error actualizando featured:', error);
		return { success: false };
	}

	await touchPropertyUpdatedAt(db, loc.property_id);

	revalidatePath('/app');
	return { success: true };
}
