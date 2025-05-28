// lib/sidebar/getPropertyDataBySubCategory.ts
'use server';

import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';

export type PropertyDataItem = {
	id: string;
	name: string;
	description: string;
	image_url: string | null;
};

export async function getPropertyDataBySubCategory({
	propertyId,
	subCategoryId,
}: {
	propertyId: string;
	subCategoryId: string;
}): Promise<PropertyDataItem[]> {
	const supabase = await createServerAdminClient();

	const { data, error } = await supabase
		.from('property_data')
		.select(
			'id,name,description,image_url,type,name,latitude,longitude,featured,address'
		)
		.eq('property_id', propertyId)
		.eq('sub_category_id', subCategoryId);

	if (error) {
		console.error('Error fetching property data:', error.message);
		return [];
	}

	return data;
}
