import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types';

export type PropertyOwnerCheck =
	| { ok: true }
	| { ok: false; reason: 'not_found' | 'forbidden' };

// Las acciones con cliente admin se saltan RLS: esta comprobación es la
// única barrera entre un usuario y las propiedades de otros anfitriones.
export async function checkPropertyOwner(
	db: SupabaseClient<Database>,
	propertyId: string,
	userId: string,
): Promise<PropertyOwnerCheck> {
	type PropOwner = { user_id: string | null };

	const { data: prop, error } = await db
		.from('properties')
		.select('user_id')
		.eq('id', propertyId)
		.single()
		.overrideTypes<PropOwner, { merge: false }>();

	if (error || !prop) return { ok: false, reason: 'not_found' };
	if (prop.user_id !== userId) return { ok: false, reason: 'forbidden' };

	return { ok: true };
}
