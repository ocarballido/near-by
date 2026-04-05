'use server';

import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import type { Tables, Enums } from '@/lib/types'; // 👈 añadimos Enums

type PropertyDataType = Enums<'property_data_type'>; // 'info' | 'location'

// ✅ helper de tipos: convierte unknown -> PropertyDataType
const isPropertyDataType = (v: unknown): v is PropertyDataType =>
	v === 'info' || v === 'location';

export type PublicSubCategory = {
	id: string;
	name: string;
	type: PropertyDataType; // 👈 antes string
	order?: number | null;
};

export type PublicCategory = {
	id: string;
	name: string;
	icon: string | null;
	order_index: number;
	type: PropertyDataType; // 👈 antes 'info'|'location' (sin null) + no se devolvía
	sub_categories: PublicSubCategory[];
};

type CategoryLite = Pick<
	Tables<'categories'>,
	'id' | 'name' | 'icon' | 'order_index' | 'type'
>;
type UsedSub = Pick<
	Tables<'property_data'>,
	'sub_category_id' | 'name' | 'description' | 'latitude'
>;
type SubCatRow = Pick<
	Tables<'sub_categories'>,
	'id' | 'name' | 'type' | 'category_id' | 'order_index'
>;

export async function getPublicSidebarData(
	propertyId: string,
): Promise<PublicCategory[]> {
	const supabase = await createServerAdminClient();

	// 1. Obtener todas las categorías ordenadas
	const { data: categories, error: catError } = await supabase
		.from('categories')
		.select('id, name, icon, order_index, type')
		.eq('type', 'location')
		.order('order_index', { ascending: true })
		.overrideTypes<CategoryLite[], { merge: false }>();

	if (catError || !categories) return [];

	// 2. Obtener subcategorías de property_data con contenido real
	const { data: usedSubCategories, error: dataError } = await supabase
		.from('property_data')
		.select('sub_category_id, name, description, latitude')
		.eq('property_id', propertyId)
		.or('name.not.is.null,description.not.is.null,latitude.not.is.null')
		.overrideTypes<UsedSub[], { merge: false }>();

	if (dataError || !usedSubCategories || usedSubCategories.length === 0) {
		console.warn('No se encontraron subcategorías con contenido');
		return [];
	}

	const usedIds = [
		...new Set(
			usedSubCategories
				.filter(
					(item) => item.name || item.description || item.latitude,
				)
				.map((item) => item.sub_category_id)
				.filter(
					(id): id is string =>
						typeof id === 'string' && id.length > 0,
				),
		),
	];

	// 3. Obtener los detalles de esas subcategorías (incluyendo order)
	const { data: subCats, error: subError } = await supabase
		.from('sub_categories')
		.select('id, name, type, category_id, order_index')
		.in('id', usedIds)
		.overrideTypes<SubCatRow[], { merge: false }>();

	if (subError || !subCats) return [];

	// 4. Agrupar subcategorías por categoría y ordenarlas por `order`
	const subCatsByCategory: Record<string, PublicSubCategory[]> = {};
	for (const sub of subCats) {
		if (!subCatsByCategory[sub.category_id]) {
			subCatsByCategory[sub.category_id] = [];
		}

		// ✅ si viene null o algo raro, lo convertimos a 'info' (default)
		// (esto NO cambia la lógica estructural; solo evita que el tipo sea inválido)
		const safeType: PropertyDataType = isPropertyDataType(sub.type)
			? sub.type
			: 'info';

		subCatsByCategory[sub.category_id].push({
			id: sub.id,
			name: sub.name,
			type: safeType,
			order: sub.order_index,
		});
	}

	// Ordenar subcategorías dentro de cada categoría
	for (const catId in subCatsByCategory) {
		subCatsByCategory[catId].sort(
			(a, b) => (a.order ?? 0) - (b.order ?? 0),
		);
	}

	// 5. Construir la estructura final solo con categorías que tengan subcategorías válidas
	const result: PublicCategory[] = categories
		.map((cat) => {
			const subcats = subCatsByCategory[cat.id] || [];

			// ✅ type del category: mismo tratamiento (null -> 'info')
			const safeCatType: PropertyDataType = isPropertyDataType(cat.type)
				? cat.type
				: 'info';

			return subcats.length > 0
				? {
						id: cat.id,
						name: cat.name,
						icon: cat.icon,
						order_index: cat.order_index,
						type: safeCatType,
						sub_categories: subcats,
					}
				: null;
		})
		.filter((x): x is PublicCategory => x !== null);

	return result;
}
