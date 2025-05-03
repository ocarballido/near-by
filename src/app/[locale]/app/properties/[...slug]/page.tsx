import { notFound, redirect } from 'next/navigation';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';

import { LODGING_CATEGORY_ID } from '@/config/config-constants';
// import { useTranslations } from 'next-intl';
import AppContentTemplate from '@/components/templates/app-content';
import { createSSRClient } from '@/lib/supabase/server';
import PropertiesContentEmpty from '@/components/templates/properties-content-empty';

import EmptyContentAction from '@/components/molecules/empty-content-action';

type PageProps = {
	params: Promise<{ slug: string[] }>; // params es un Promise
};

interface PropertyInfo {
	id: string;
	category_id: string;
	title: string;
	content: string;
	created_at: string;
}

interface Location {
	id: string;
	group_id: string;
	name: string;
	address: string;
}

interface SidebarCategory {
	id: string;
	name: string;
	icon: string;
	order_index: number;
	firstEntryId: string;
	propertySlug: string;
}

interface SidebarItem {
	id: string;
	label: string;
	href: string;
}

export default async function Property({ params }: PageProps) {
	// const t = useTranslations();

	const { slug } = await params;
	const [propertySlug, categoryId, subcategoryId] = slug;

	const isLodging = categoryId === LODGING_CATEGORY_ID;

	const ssrClient = await createSSRClient();
	const {
		data: { user },
		error: authError,
	} = await ssrClient.auth.getUser();

	if (authError || !user) {
		redirect('/auth/login');
	}

	const supabase = await createServerAdminClient();

	const { data: property, error: propErr } = await supabase
		.from('properties')
		.select('id,name,slug')
		.eq('slug', propertySlug)
		.single();
	if (propErr || !property?.id) notFound();
	const propertyId = property.id;

	const { data: rawCategories, error: catErr } = await supabase
		.from('categories')
		.select('id,name,icon,order_index')
		.order('order_index', { ascending: true });
	if (catErr || !rawCategories) notFound();
	const categories = rawCategories;

	const [groupsRes, infosRes] = await Promise.all([
		supabase
			.from('location_groups')
			.select('id,category_id,name,slug,order_index')
			.eq('property_id', propertyId)
			.order('order_index'),
		supabase
			.from('property_info')
			.select('id,category_id,title,content,created_at')
			.eq('property_id', propertyId)
			.order('created_at'),
	]);
	if (groupsRes.error || infosRes.error) notFound();
	const allGroups = groupsRes.data;
	const allInfos = infosRes.data;

	const firstGroupByCat = new Map<string, string>();
	allGroups.forEach((g) => {
		if (!firstGroupByCat.has(g.category_id)) {
			firstGroupByCat.set(g.category_id, g.id);
		}
	});
	const firstInfoByCat = new Map<string, string>();
	allInfos.forEach((i) => {
		if (!firstInfoByCat.has(i.category_id)) {
			firstInfoByCat.set(i.category_id, i.id);
		}
	});

	const sidebarCategories: SidebarCategory[] = categories.map((cat) => {
		const firstEntryId =
			cat.id === LODGING_CATEGORY_ID
				? firstInfoByCat.get(cat.id) ?? ''
				: firstGroupByCat.get(cat.id) ?? '';
		return { ...cat, firstEntryId, propertySlug };
	});

	const sidebarSubcategories: SidebarItem[] = isLodging
		? allInfos
				.filter((i) => i.category_id === categoryId)
				.map((i) => ({
					id: i.id,
					label: i.title,
					href: `/app/properties/${propertySlug}/${categoryId}/${i.id}`,
				}))
		: allGroups
				.filter((g) => g.category_id === categoryId)
				.map((g) => ({
					id: g.id,
					label: g.name,
					href: `/app/properties/${propertySlug}/${categoryId}/${g.id}`,
				}));

	let contentItems: Array<PropertyInfo | Location> = [];
	if (isLodging) {
		if (subcategoryId) {
			contentItems = allInfos.filter(
				(i) => i.category_id === categoryId && i.id === subcategoryId
			);
		}
	} else {
		// Otras categorías: solo si viene subcategoryId cargamos locations
		if (subcategoryId) {
			const { data: locs, error: locErr } = await supabase
				.from<'locations', Location>('locations')
				.select('id,group_id,name,address')
				.eq('group_id', subcategoryId)
				.order('name', { ascending: true });
			if (locErr) notFound();
			contentItems = locs;
		}
	}
	console.log('/////', categoryId);

	return (
		<AppContentTemplate
			sidebar="PROPERTY"
			categoryId={categoryId}
			categories={sidebarCategories}
			subCategories={sidebarSubcategories}
			subcategoryGroupId={subcategoryId}
			propertySlug={propertySlug}
		>
			<div className="p-4 font-roboto flex flex-col grow gap-4 bg-white rounded-lg overflow-hidden">
				{isLodging ? (
					(contentItems[0] as PropertyInfo).content !== '' ? (
						<p>La info</p>
					) : (
						<EmptyContentAction className="mt-12" />
					)
				) : contentItems.length === 0 ? (
					<PropertiesContentEmpty
						url={`/app/(modal)/${propertySlug}/${propertyId}/${categoryId}/${subcategoryId}`}
					/>
				) : (
					<p>Locations</p>
				)}
			</div>
		</AppContentTemplate>
	);
}
