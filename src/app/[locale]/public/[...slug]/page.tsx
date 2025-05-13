import { notFound } from 'next/navigation';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import PlacePublic from '@/components/molecules/card/place-public';
import { LODGING_CATEGORY_ID } from '@/config/config-constants';
import PublicContentTemplate from '@/components/templates/public-content';

type PageProps = { params: Promise<{ slug: string[] }> };
interface PropertyInfo {
	id: string;
	category_id: string;
	title: string;
	content: string;
}
interface Location {
	id: string;
	group_id: string;
	name: string;
	address: string;
	latitude: number;
	longitude: number;
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

function groupBy<T, K extends string>(
	arr: T[],
	key: (item: T) => K
): Map<K, T[]> {
	return arr.reduce((map, item) => {
		const k = key(item);
		const bucket = map.get(k) || [];
		bucket.push(item);
		map.set(k, bucket);
		return map;
	}, new Map<K, T[]>());
}

export default async function Property({ params }: PageProps) {
	// const t = useTranslations();

	const { slug } = await params;
	const [propertySlug, categoryId, subcategoryId] = slug;
	const isLodging = categoryId === LODGING_CATEGORY_ID;

	console.log(propertySlug, categoryId, subcategoryId);

	const supabase = await createServerAdminClient();

	// 1) Propiedad
	const { data: property, error: propErr } = await supabase
		.from('properties')
		.select('id,address,name,image_url,latitude,longitude')
		.eq('slug', propertySlug)
		.single();
	if (propErr || !property) notFound();
	const propertyId = property.id;

	// 2) Infos con contenido → array non-null
	const { data: infosData, error: infosErr } = await supabase
		.from('property_info')
		.select('id,category_id,title,content')
		.eq('property_id', property.id)
		.neq('content', '');
	if (infosErr) notFound();
	const infos = infosData!; // ahora no es null

	// 3) Locations para saber qué grupos tienen ≥1
	const { data: locsData, error: locsErr } = await supabase
		.from('locations')
		// .select('id,category_id,title,content')
		// .eq('property_id', property.id)
		.select('id,group_id');
	if (locsErr) notFound();
	const locs = locsData!;

	// 4) Todos los grupos de la propiedad
	const { data: grpData, error: grpErr } = await supabase
		.from('location_groups')
		.select('id,category_id,name,slug,order_index')
		.eq('property_id', propertyId);
	if (grpErr) notFound();
	const allGroups = grpData!;

	// 5) Todas las categorías
	const { data: catData, error: catErr } = await supabase
		.from('categories')
		.select('id,name,icon,order_index')
		.order('order_index', { ascending: true });
	if (catErr) notFound();
	const categories = catData!;

	// — construir mapas filtrados solo con contenido —
	const groupIdsWithLocs = new Set(locs.map((l) => l.group_id));
	const groupsByCat = groupBy(
		allGroups.filter((g) => groupIdsWithLocs.has(g.id)),
		(g) => g.category_id
	);
	const infosByCat = groupBy(infos, (i) => i.category_id);

	// — sidebarCategories solo si tienen algo dentro —
	const sidebarCategories: SidebarCategory[] = categories
		.filter((cat) =>
			cat.id === LODGING_CATEGORY_ID
				? (infosByCat.get(cat.id) || []).length > 0
				: (groupsByCat.get(cat.id) || []).length > 0
		)
		.map((cat) => ({
			...cat,
			firstEntryId:
				cat.id === LODGING_CATEGORY_ID
					? infosByCat.get(cat.id)![0].id
					: groupsByCat.get(cat.id)![0].id,
			propertySlug,
		}));

	// — sidebarSubcategories depende de isLodging —
	const sidebarSubcategories: SidebarItem[] = isLodging
		? (infosByCat.get(categoryId) || []).map((i) => ({
				id: i.id,
				label: i.title,
				href: `/app/properties/${propertySlug}/${categoryId}/${i.id}`,
		  }))
		: (groupsByCat.get(categoryId) || []).map((g) => ({
				id: g.id,
				label: g.name,
				href: `/app/properties/${propertySlug}/${categoryId}/${g.id}`,
		  }));

	// — elegir un subcategory “activo” incluso si no viene en URL —
	const firstInfoId = infosByCat.get(categoryId)?.[0]?.id;
	const firstGroupId = groupsByCat.get(categoryId)?.[0]?.id;

	const activeSubcatId = subcategoryId
		? subcategoryId
		: isLodging
		? firstInfoId
		: firstGroupId;

	// 2) Cargar los arrays por separado
	let infosToShow: PropertyInfo[] = [];
	let locsToShow: Location[] = [];

	if (isLodging) {
		// filtramos en memoria, nunca null
		infosToShow = (infosByCat.get(categoryId) || []).filter(
			(i) => i.id === activeSubcatId
		);
	} else if (activeSubcatId) {
		const { data: fetched, error: locErr } = await supabase
			.from<'locations', Location>('locations')
			.select('id,group_id,name,address,image_url,latitude,longitude')
			.eq('group_id', activeSubcatId)
			.order('name', { ascending: true });
		if (locErr) notFound();
		locsToShow = fetched || [];
	}

	return (
		<PublicContentTemplate
			address={property.address}
			name={property.name}
			latitude={property.latitude}
			longitude={property.longitude}
			image={property.image_url}
			categoryId={categoryId}
			categories={sidebarCategories}
			subCategories={sidebarSubcategories}
			subcategoryGroupId={subcategoryId}
			propertySlug={propertySlug}
		>
			<div className="p-4 font-roboto flex flex-col grow gap-4 bg-white rounded-lg overflow-hidden">
				{isLodging ? (
					<div className="whitespace-pre-wrap">
						{infosToShow[0].content}
					</div>
				) : (
					locsToShow.map((loc) => (
						<PlacePublic
							key={loc.id}
							name={loc.name}
							latitude={loc.latitude}
							longitude={loc.longitude}
							address={loc.address}
							image={loc.image_url}
						/>
					))
				)}
			</div>
		</PublicContentTemplate>
	);
}
