// lib/sidebar/getSidebarData.ts
'use server';

import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { CategoryWithSubCategories } from '@/types/db';
import type { Tables } from '@/lib/types';

type SubMini = Pick<
	Tables<'sub_categories'>,
	'id' | 'name' | 'type' | 'order_index'
>;

type CatWithSubs = Pick<
	Tables<'categories'>,
	'id' | 'name' | 'icon' | 'type' | 'order_index'
> & {
	sub_categories: SubMini[];
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
		`,
		)
		.order('order_index', { ascending: true })
		.overrideTypes<CatWithSubs[], { merge: false }>();

	if (error || !data) {
		console.error('Error loading sidebar data:', error.message);
		return [];
	}

	if (data) {
		data.forEach((category) => {
			category.sub_categories.sort(
				(a, b) => (a.order_index ?? 0) - (b.order_index ?? 0),
			);
		});
	}

	return data as unknown as CategoryWithSubCategories[];
}
