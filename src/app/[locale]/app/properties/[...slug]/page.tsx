import { notFound, redirect } from 'next/navigation';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';

import { LODGING_CATEGORY_ID } from '@/config/config-constants';

import AppContentTemplate from '@/components/templates/app-content';
import { createSSRClient } from '@/lib/supabase/server';
import { LocationsContent } from '@/components/templates/locations-content';
import { PropertyInfoContent } from '@/components/templates/property-info-content';
import PropertyNameTitle from '@/components/atoms/property-name-title';

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
		.select('id,name,slug,image_url,address,latitude,longitude')
		.eq('slug', propertySlug)
		.single();
	if (propErr || !property?.id) notFound();
	const propertyId = property.id;

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

	if (catRes.error || !catRes.data) notFound();
	const categories = catRes.data;

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

	const realSubcats: SidebarItem[] = isLodging
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

	let subCategoriesToRender: SidebarItem[];

	if (isLodging) {
		const overview: SidebarItem = {
			id: '',
			label: 'Información general',
			href: `/app/properties/${propertySlug}/${categoryId}`,
		};
		subCategoriesToRender = [overview, ...realSubcats];
	} else {
		subCategoriesToRender = realSubcats;
	}

	const lodgingInfos: PropertyInfo[] = [];
	if (isLodging && subcategoryId) {
		lodgingInfos.push(
			...infos.filter(
				(i) => i.category_id === categoryId && i.id === subcategoryId
			)
		);
	}

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

	if (!propertySlug || !categoryId || !subcategoryId || !slug) {
		return notFound();
	}

	if (slug.length > 3) {
		return notFound();
	}

	return (
		<AppContentTemplate
			sidebar="PROPERTY"
			categoryId={categoryId}
			categories={sidebarCategories}
			subCategories={subCategoriesToRender}
			subcategoryGroupId={subcategoryId}
			propertySlug={propertySlug}
		>
			<div className="p-4 font-roboto flex flex-col grow gap-4 bg-white rounded-lg overflow-hidden">
				<PropertyNameTitle
					subcategories={subCategoriesToRender}
					subcategoryId={subcategoryId}
					propertyName={property.name}
				/>
				{isLodging ? (
					<PropertyInfoContent
						infos={
							subcategoryId
								? infos.filter(
										(i) =>
											i.category_id === categoryId &&
											i.id === subcategoryId
								  )
								: null
						}
						property={property}
						subCategoryId={subcategoryId}
						categoryId={categoryId}
					/>
				) : (
					<LocationsContent
						locations={locationsList}
						propertyId={propertyId}
						categoryId={categoryId}
						subCategoryId={subcategoryId}
						propertySlug={propertySlug}
						lat={property.latitude}
						lng={property.longitude}
					/>
				)}
			</div>
		</AppContentTemplate>
	);
}
