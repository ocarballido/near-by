'use server';

import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';

export async function getPropertySubCategoryCounts(
	propertyId: string,
): Promise<Record<string, number>> {
	const supabase = await createServerAdminClient();

	const { data, error } = await supabase
		.from('property_data')
		.select('sub_category_id')
		.eq('property_id', propertyId)
		.overrideTypes<{ sub_category_id: string | null }[]>();

	if (error || !data) return {};

	return data.reduce<Record<string, number>>((acc, row) => {
		const id = row.sub_category_id;
		if (!id) return acc;
		acc[id] = (acc[id] ?? 0) + 1;
		return acc;
	}, {});
}
