// app/actions/properties/toggle-featured.ts
'use server';

import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { revalidatePath } from 'next/cache';
import { touchPropertyUpdatedAt } from '@/lib/properties/touch-property';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, TablesUpdate } from '@/lib/types';

export async function toggleFeatured(id: string, featured: boolean) {
	const supabase = await createServerAdminClient();

	const db = supabase as unknown as SupabaseClient<Database>;

	const payload: TablesUpdate<'property_data'> = {
		featured,
		updated_at: new Date().toISOString(),
	};

	const { data: row, error } = await db
		.from('property_data')
		.update(payload)
		.eq('id', id)
		.select('property_id')
		.single();

	if (error) {
		console.error('Error actualizando featured:', error);
		return { success: false };
	}

	if (row?.property_id) {
		await touchPropertyUpdatedAt(db, row.property_id);
	}

	revalidatePath('/app');
	return { success: true };
}
