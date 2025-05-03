import { notFound, redirect } from 'next/navigation';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';

import { LODGING_CATEGORY_ID } from '@/config/config-constants';
// import { useTranslations } from 'next-intl';
import AppContentTemplate from '@/components/templates/app-content';
import { createSSRClient } from '@/lib/supabase/server';
import { LocationsContent } from '@/components/templates/locations-content';
import { PropertyInfoContent } from '@/components/templates/property-info-content';

type PageProps = {
	params: Promise<{ slug: string[] }>;
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
	image_url: string;
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

	// const { data: rawCategories, error: catErr } = await supabase
	// 	.from('categories')
	// 	.select('id,name,icon,order_index')
	// 	.order('order_index', { ascending: true });
	// if (catErr || !rawCategories) notFound();
	// const categories = rawCategories;

	// const [groupsRes, infosRes] = await Promise.all([
	// 	supabase
	// 		.from('location_groups')
	// 		.select('id,category_id,name,slug,order_index')
	// 		.eq('property_id', propertyId)
	// 		.order('order_index'),
	// 	supabase
	// 		.from('property_info')
	// 		.select('id,category_id,title,content,created_at')
	// 		.eq('property_id', propertyId)
	// 		.order('created_at'),
	// ]);
	// if (groupsRes.error || infosRes.error) notFound();
	// const allGroups = groupsRes.data;
	// const allInfos = infosRes.data;

	const [catRes, grpRes, infoRes] = await Promise.all([
		supabase
			.from('categories')
			.select('id,name,icon,order_index')
			.order('order_index', { ascending: true }),
		supabase
			.from('location_groups')
			.select('id,category_id,name,slug,order_index')
			.eq('property_id', propertyId)
			.order('order_index', { ascending: true }),
		supabase
			.from('property_info')
			.select('id,category_id,title,content,created_at')
			.eq('property_id', propertyId)
			.order('created_at', { ascending: true }),
	]);

	// must have categories
	if (catRes.error || !catRes.data) notFound();
	const categories = catRes.data;

	// coerce null → []
	if (grpRes.error) notFound();
	const groups = grpRes.data ?? [];

	if (infoRes.error) notFound();
	const infos = infoRes.data ?? [];

	const firstGroupByCat = new Map<string, string>();
	groups.forEach((g) => {
		if (!firstGroupByCat.has(g.category_id)) {
			firstGroupByCat.set(g.category_id, g.id);
		}
	});
	const firstInfoByCat = new Map<string, string>();
	infos.forEach((i) => {
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
		? infos
				.filter((i) => i.category_id === categoryId)
				.map((i) => ({
					id: i.id,
					label: i.title,
					href: `/app/properties/${propertySlug}/${categoryId}/${i.id}`,
				}))
		: groups
				.filter((g) => g.category_id === categoryId)
				.map((g) => ({
					id: g.id,
					label: g.name,
					href: `/app/properties/${propertySlug}/${categoryId}/${g.id}`,
				}));

	// --- determine what to render in content area
	// let contentItems: Array<PropertyInfo | Location> = [];

	// if (isLodging) {
	// 	// show exactly the selected info subcategory if any
	// 	if (subcategoryId) {
	// 		contentItems = infos.filter(
	// 			(i) => i.category_id === categoryId && i.id === subcategoryId
	// 		);
	// 	}
	// } else {
	// 	// for non-lodging, load the locations for the chosen group
	// 	if (subcategoryId) {
	// 		const { data: locs, error: locErr } = await supabase
	// 			.from<'locations', Location>('locations')
	// 			.select('id,group_id,name,address,image_url')
	// 			.eq('group_id', subcategoryId)
	// 			.order('name', { ascending: true });
	// 		if (locErr) notFound();
	// 		contentItems = locs;
	// 	}
	// }

	// --- determinar las infos filtradas para Lodging
	const lodgingInfos: PropertyInfo[] = [];
	if (isLodging && subcategoryId) {
		lodgingInfos.push(
			...infos.filter(
				(i) => i.category_id === categoryId && i.id === subcategoryId
			)
		);
	}

	// --- determinar las locations para non-lodging
	let locationsList: Location[] = [];
	if (!isLodging && subcategoryId) {
		const { data: locs, error: locErr } = await supabase
			.from<'locations', Location>('locations')
			.select('id,group_id,name,address,image_url')
			.eq('group_id', subcategoryId)
			.order('name', { ascending: true });
		if (locErr) notFound();
		locationsList = locs;
	}

	// console.log('/////', contentItems);

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
					<PropertyInfoContent
						infos={infos.filter(
							(i) =>
								i.category_id === categoryId &&
								i.id === subcategoryId
						)}
					/>
				) : (
					<LocationsContent
						locations={locationsList}
						propertyId={propertyId}
						categoryId={categoryId}
						subCategoryId={subcategoryId}
						emptyUrl={`/app/(modal)/${propertySlug}/${propertyId}/${categoryId}/${subcategoryId}`}
					/>
				)}
			</div>
		</AppContentTemplate>
	);
}
