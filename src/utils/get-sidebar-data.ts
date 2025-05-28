// lib/sidebar/getSidebarData.ts
'use server';

import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { CategoryWithSubCategories } from '@/lib/types';

export type SubCategory = {
	id: string;
	name: string;
	type: 'info' | 'location';
};

export async function getSidebarData(): Promise<CategoryWithSubCategories[]> {
	const supabase = await createServerAdminClient();

	const { data, error } = await supabase
		.from('categories')
		.select(
			`
			id,
			name,
			icon,
			type,
			order_index,
			sub_categories (
				id,
				name,
				type,
				order_index
			)
		`
		)
		.order('order_index', { ascending: true });

	if (data) {
		data.forEach((category) => {
			category.sub_categories.sort(
				(a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)
			);
		});
	}

	if (error) {
		console.error('Error loading sidebar data:', error.message);
		return [];
	}

	return data as CategoryWithSubCategories[];
}
