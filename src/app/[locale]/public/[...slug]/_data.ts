import { notFound } from 'next/navigation';

import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';

import type { Tables } from '@/lib/types';

type FullProperty = Tables<'properties'>;
type PropertyDataRow = Tables<'property_data'>;
type CategoryTypeOnly = Pick<Tables<'categories'>, 'type'>;
type SubcatMini = Pick<Tables<'sub_categories'>, 'id' | 'name'>;
type SubcatMiniWithOrder = {
	id: string;
	name: string;
	order_index: number | null;
};

export const PROPERTY_DATA_SELECT =
	'id, name, description, image_url, type, latitude, longitude, featured, must_visit, address, sub_category_id';

export const toPublicItem = (r: PropertyDataRow) => ({
	id: r.id,
	name: r.name ?? 'Sin nombre',
	address: r.address ?? '',
	description: r.description ?? undefined,
	image_url: r.image_url ?? undefined,
	latitude: r.latitude ?? undefined,
	longitude: r.longitude ?? undefined,
	type: (r.type as 'info' | 'location') ?? undefined,
	featured: r.featured ?? false,
	must_visit: r.must_visit ?? false,
});

export type HighlightGroup = {
	sub_category_id: string;
	sub_category_name: string;
	items: ReturnType<typeof toPublicItem>[];
};

export type InfoGroup = {
	sub_category_id: string;
	sub_category_name: string;
	description: string;
	order: number;
};

type InfoRow = {
	description: string | null;
	sub_category_id: string | null;
};

export async function fetchPropertyBase(propertyId: string) {
	const supabase = await createServerAdminClient();

	const { data: property, error: propErr } = await supabase
		.from('properties')
		.select('*')
		.eq('id', propertyId)
		.single()
		.overrideTypes<FullProperty, { merge: false }>();

	if (propErr || !property?.id) notFound();
	if (property.latitude == null || property.longitude == null) notFound();

	return {
		property,
		lat: property.latitude as number,
		lng: property.longitude as number,
	};
}

export async function fetchSubcategoryPageData(
	propertyId: string,
	categoryId: string,
	subCategoryId: string,
) {
	const supabase = await createServerAdminClient();

	const [
		{ data: items, error: errorPropertyData },
		{ data: typeRow, error: errorCategoryType },
		{ data: subcatRow, error: errorSubcats },
	] = await Promise.all([
		supabase
			.from('property_data')
			.select(PROPERTY_DATA_SELECT)
			.eq('property_id', propertyId)
			.eq('sub_category_id', subCategoryId)
			.order('featured', { ascending: false })
			.order('must_visit', { ascending: false })
			.order('name', { ascending: true })
			.overrideTypes<PropertyDataRow[], { merge: false }>(),
		supabase
			.from('categories')
			.select('type')
			.eq('id', categoryId)
			.single()
			.overrideTypes<CategoryTypeOnly, { merge: false }>(),
		supabase
			.from('sub_categories')
			.select('id, name')
			.eq('id', subCategoryId)
			.single()
			.overrideTypes<SubcatMini, { merge: false }>(),
	]);

	if (errorPropertyData || errorCategoryType || errorSubcats) notFound();

	return {
		propertyData: (items ?? []).map(toPublicItem),
		categoryType: typeRow ?? null,
		subCategory: subcatRow ?? null,
	};
}

function groupBySubcategory(
	items: PropertyDataRow[],
	subCategoryMap: Record<string, string>,
): HighlightGroup[] {
	const subCategoryIds = Array.from(
		new Set(
			(items ?? [])
				.map((i) => i.sub_category_id)
				.filter(
					(id): id is string =>
						typeof id === 'string' && id.length > 0,
				),
		),
	);

	return subCategoryIds.map((id) => ({
		sub_category_id: id,
		sub_category_name: subCategoryMap[id] ?? 'Sin nombre',
		items: (items ?? [])
			.filter((item) => item.sub_category_id === id)
			.map(toPublicItem),
	}));
}

export async function fetchWelcomeHighlightsTabsData(
	propertyId: string,
): Promise<{
	featuredGroups: HighlightGroup[];
	mustVisitGroups: HighlightGroup[];
}> {
	const supabase = await createServerAdminClient();

	const [
		{ data: featuredData, error: featuredErr },
		{ data: mustVisitData, error: mustVisitErr },
	] = await Promise.all([
		supabase
			.from('property_data')
			.select(PROPERTY_DATA_SELECT)
			.eq('property_id', propertyId)
			.eq('featured', true)
			.order('name', { ascending: true })
			.overrideTypes<PropertyDataRow[], { merge: false }>(),
		supabase
			.from('property_data')
			.select(PROPERTY_DATA_SELECT)
			.eq('property_id', propertyId)
			.eq('must_visit', true)
			.order('name', { ascending: true })
			.overrideTypes<PropertyDataRow[], { merge: false }>(),
	]);

	if (featuredErr || mustVisitErr) notFound();

	const featuredItems = featuredData ?? [];
	const mustVisitItems = mustVisitData ?? [];

	const allSubCategoryIds = Array.from(
		new Set(
			[...featuredItems, ...mustVisitItems]
				.map((i) => i.sub_category_id)
				.filter(
					(id): id is string =>
						typeof id === 'string' && id.length > 0,
				),
		),
	);

	if (allSubCategoryIds.length === 0) {
		return { featuredGroups: [], mustVisitGroups: [] };
	}

	const { data: subCategories, error: subErr } = await supabase
		.from('sub_categories')
		.select('id, name')
		.in('id', allSubCategoryIds)
		.overrideTypes<SubcatMini[], { merge: false }>();

	if (subErr || !subCategories) notFound();

	const subCategoryMap: Record<string, string> = Object.fromEntries(
		subCategories.map((s) => [s.id, s.name]),
	);

	return {
		featuredGroups: groupBySubcategory(featuredItems, subCategoryMap),
		mustVisitGroups: groupBySubcategory(mustVisitItems, subCategoryMap),
	};
}

export async function fetchInfoSectionsData(
	propertyId: string,
): Promise<InfoGroup[]> {
	const supabase = await createServerAdminClient();

	const { data: items, error } = await supabase
		.from('property_data')
		.select('description, sub_category_id')
		.eq('property_id', propertyId)
		.eq('type', 'info')
		.overrideTypes<InfoRow[], { merge: false }>();

	if (error || !items || items.length === 0) return [];

	const validItems = items.filter(
		(i): i is { description: string; sub_category_id: string } =>
			typeof i.description === 'string' &&
			i.description.trim().length > 0 &&
			typeof i.sub_category_id === 'string' &&
			i.sub_category_id.length > 0,
	);

	if (validItems.length === 0) return [];

	const subCategoryIds = validItems.map((i) => i.sub_category_id);

	const { data: subCats, error: subError } = await supabase
		.from('sub_categories')
		.select('id, name, order_index')
		.in('id', subCategoryIds)
		.overrideTypes<SubcatMiniWithOrder[], { merge: false }>();

	if (subError || !subCats) return [];

	const nameMap: Record<string, string> = Object.fromEntries(
		subCats.map((s) => [s.id, s.name]),
	);

	const orderMap: Record<string, number> = Object.fromEntries(
		subCats.map((s) => [s.id, s.order_index ?? 999]),
	);

	return validItems
		.map((i) => ({
			sub_category_id: i.sub_category_id,
			sub_category_name: nameMap[i.sub_category_id] ?? '',
			description: i.description,
			order: orderMap[i.sub_category_id],
		}))
		.sort((a, b) => a.order - b.order);
}
