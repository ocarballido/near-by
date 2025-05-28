'use server';

import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';

export type PublicSubCategory = {
	id: string;
	name: string;
	type: string;
	order?: number | null;
};

export type PublicCategory = {
	id: string;
	name: string;
	icon: string | null;
	order_index: number;
	type: 'info' | 'location';
	sub_categories: PublicSubCategory[];
};

export async function getPublicSidebarData(
	propertyId: string
): Promise<PublicCategory[]> {
	const supabase = await createServerAdminClient();

	// 1. Obtener todas las categorías ordenadas
	const { data: categories, error: catError } = await supabase
		.from('categories')
		.select('id, name, icon, order_index')
		.order('order_index', { ascending: true });

	if (catError || !categories) return [];

	// 2. Obtener subcategorías de property_data con contenido real
	const { data: usedSubCategories, error: dataError } = await supabase
		.from('property_data')
		.select('sub_category_id, name, description, latitude')
		.eq('property_id', propertyId)
		.or('name.not.is.null,description.not.is.null,latitude.not.is.null');

	if (dataError || !usedSubCategories || usedSubCategories.length === 0) {
		console.warn('No se encontraron subcategorías con contenido');
		return [];
	}

	const usedIds = [
		...new Set(
			usedSubCategories
				.filter(
					(item) => item.name || item.description || item.latitude
				)
				.map((item) => item.sub_category_id)
		),
	];

	// 3. Obtener los detalles de esas subcategorías (incluyendo order)
	const { data: subCats, error: subError } = await supabase
		.from('sub_categories')
		.select('id, name, type, category_id, order_index')
		.in('id', usedIds);

	if (subError || !subCats) return [];

	// 4. Agrupar subcategorías por categoría y ordenarlas por `order`
	const subCatsByCategory: Record<string, PublicSubCategory[]> = {};
	for (const sub of subCats) {
		if (!subCatsByCategory[sub.category_id]) {
			subCatsByCategory[sub.category_id] = [];
		}
		subCatsByCategory[sub.category_id].push({
			id: sub.id,
			name: sub.name,
			type: sub.type,
			order: sub.order_index,
		});
	}

	// Ordenar subcategorías dentro de cada categoría
	for (const catId in subCatsByCategory) {
		subCatsByCategory[catId].sort(
			(a, b) => (a.order ?? 0) - (b.order ?? 0)
		);
	}

	// 5. Construir la estructura final solo con categorías que tengan subcategorías válidas
	const result: PublicCategory[] = categories
		.map((cat) => {
			const subcats = subCatsByCategory[cat.id] || [];
			return subcats.length > 0
				? {
						id: cat.id,
						name: cat.name,
						icon: cat.icon,
						order_index: cat.order_index,
						sub_categories: subcats,
				  }
				: null;
		})
		.filter(Boolean) as PublicCategory[];

	return result;
}
