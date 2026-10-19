import 'server-only';

import { getCatalog, type Catalog } from '@/utils/get-catalog';
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
	let catalog: Catalog;
	try {
		catalog = await getCatalog();
	} catch (error) {
		console.error('Error loading sidebar data:', error);
		return [];
	}

	// El catálogo ya viene con las categorías ordenadas por order_index
	const data: CatWithSubs[] = catalog.categories.map((category) => ({
		id: category.id,
		name: category.name,
		icon: category.icon,
		type: category.type,
		order_index: category.order_index,
		sub_categories: catalog.subCategories
			.filter((sub) => sub.category_id === category.id)
			.map((sub) => ({
				id: sub.id,
				name: sub.name,
				type: sub.type,
				order_index: sub.order_index,
			}))
			.sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)),
	}));

	return data as unknown as CategoryWithSubCategories[];
}
