'use server';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types';

export async function touchPropertyUpdatedAt(
	db: SupabaseClient<Database>,
	propertyId: string,
) {
	const { error } = await db
		.from('properties')
		.update({ updated_at: new Date().toISOString() })
		.eq('id', propertyId);

	if (error) {
		// best-effort: no rompas la acción principal por esto
		console.warn('touchPropertyUpdatedAt failed:', error);
	}
}
