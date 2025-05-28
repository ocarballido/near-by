// app/actions/properties/toggle-featured.ts
'use server';

import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { revalidatePath } from 'next/cache';

export async function toggleFeatured(id: string, featured: boolean) {
	const supabase = await createServerAdminClient();

	const { error } = await supabase
		.from('property_data')
		.update({ featured })
		.eq('id', id);

	if (error) {
		console.error('Error actualizando featured:', error);
		return { success: false };
	}

	revalidatePath('/app');
	return { success: true };
}
