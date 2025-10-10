// lib/sidebar/getSidebarData.ts
'use server';

// import { createSSRClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import type { Tables } from '@/lib/types';

export type SubCategory = { id: string; name: string };
export type CategoryWithSubCategories = {
	id: string;
	name: string;
	icon: string | null;
	order_index: number;
	sub_categories: SubCategory[];
};

// 👇 tipos auxiliares sacados de tus generados
type CategoryIdOnly = Pick<Tables<'categories'>, 'id'>;
type PropertyDataRow = Tables<'property_data'>;

export async function getPropertyDataByCategory({
	propertyId,
	categoryId,
}: {
	propertyId: string;
	categoryId: string;
}) {
	const supabase = await createServerAdminClient();

	// 1. Obtener el usuario autenticado
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) return [];

	// 2. Buscar el category_id por el slug
	const { data: category, error: catError } = await supabase
		.from('categories')
		.select('id')
		.eq('slug', categoryId)
		.single()
		.overrideTypes<CategoryIdOnly, { merge: false }>();

	if (catError || !category) return [];

	// 3. Obtener los datos de property_data
	const { data, error } = await supabase
		.from('property_data')
		.select('*')
		.eq('user_id', user.id)
		.eq('property_id', propertyId)
		.eq('category_id', category.id)
		.order('created_at', { ascending: false })
		.overrideTypes<PropertyDataRow[], { merge: false }>();

	if (error) {
		console.error('Error fetching property data:', error.message);
		return [];
	}

	return data;
}
