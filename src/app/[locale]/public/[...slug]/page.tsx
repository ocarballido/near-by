import { cookies } from 'next/headers';

import PublicContentTemplate from '@/components/templates/public-content';
import { getPublicSidebarData } from '@/utils/get-public-sidebar-data';
import { EditPublicMenuProvider } from '@/lib/context/EditPublicMenuContext';
import ItineraryForm from '@/components/organisms/form/custom-plan';

import { trackEvent } from '@/lib/analytics/mixpanel';

import { fetchPropertyBase } from './_data';
import WelcomeSection from './WelcomeSection';
import SubcategorySection from './SubcategorySection';

type PageMode = 'welcome' | 'custom-plans' | 'subcategory';

const getMode = (categoryId?: string): PageMode => {
	if (categoryId === 'welcome') return 'welcome';
	if (categoryId === 'custom-plans') return 'custom-plans';
	return 'subcategory';
};

interface PageProps {
	params: Promise<{ locale: string; slug: string[] }>;
}

export default async function Property({ params }: PageProps) {
	const cookieStore = await cookies();
	const anonId = cookieStore.get('be_anon_id')?.value ?? 'anon-missing';

	const { slug, locale } = await params;
	const [propertyId, categoryId, subCategoryId] = slug;

	// Analytics: no bloqueamos render si falla
	try {
		await trackEvent({
			event: 'tenant_visit_public_page',
			distinctId: anonId,
			props: { property_id: propertyId, page: 'public_property' },
		});
	} catch (e) {
		console.error('Mixpanel trackEvent failed:', e);
	}

	// Shared data
	const sidebarData = await getPublicSidebarData(propertyId);
	const { property, lat, lng } = await fetchPropertyBase(propertyId);

	const mode = getMode(categoryId);

	return (
		<EditPublicMenuProvider initialData={sidebarData}>
			<PublicContentTemplate
				address={property.address}
				propertyId={propertyId}
				categoryId={categoryId}
				subCategoryId={subCategoryId}
				name={property.name}
				latitude={lat}
				longitude={lng}
				image={property.image_url}
			>
				<div className="p-4 font-roboto flex flex-col grow gap-4 bg-white rounded-lg overflow-hidden">
					{mode === 'welcome' && (
						<WelcomeSection
							propertyId={propertyId}
							lat={lat}
							lng={lng}
						/>
					)}

					{mode === 'custom-plans' && (
						<ItineraryForm locale={locale} lat={lat} lng={lng} />
					)}

					{mode === 'subcategory' && (
						<SubcategorySection
							propertyId={propertyId}
							categoryId={categoryId}
							subCategoryId={subCategoryId}
							lat={lat}
							lng={lng}
						/>
					)}
				</div>
			</PublicContentTemplate>
		</EditPublicMenuProvider>
	);
}

// import { notFound } from 'next/navigation';
// import { getTranslations } from 'next-intl/server';
// import { cookies } from 'next/headers';

// import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
// import PublicContentTemplate from '@/components/templates/public-content';
// import { getPublicSidebarData } from '@/utils/get-public-sidebar-data';
// import { EditPublicMenuProvider } from '@/lib/context/EditPublicMenuContext';
// import { PropertyDataPublicBySubCategory } from '@/components/templates/property-data-public';
// import ItineraryForm from '@/components/organisms/form/custom-plan';
// import FeaturedMustVisit from '@/components/templates/featured-must-visit';

// import { trackEvent } from '@/lib/analytics/mixpanel';

// import type { Tables } from '@/lib/types';

// type FullProperty = Tables<'properties'>;
// type PropertyDataRow = Tables<'property_data'>;
// type CategoryTypeOnly = Pick<Tables<'categories'>, 'type'>;
// type SubcatMini = Pick<Tables<'sub_categories'>, 'id' | 'name'>;

// const PROPERTY_DATA_SELECT =
// 	'id, name, description, image_url, type, latitude, longitude, featured, must_visit, address, sub_category_id';

// const toPublicItem = (r: PropertyDataRow) => ({
// 	id: r.id,
// 	name: r.name ?? 'Sin nombre',
// 	address: r.address ?? '',
// 	description: r.description ?? undefined,
// 	image_url: r.image_url ?? undefined,
// 	latitude: r.latitude ?? undefined,
// 	longitude: r.longitude ?? undefined,
// 	type: (r.type as 'info' | 'location') ?? undefined,
// 	featured: r.featured ?? false,
// 	must_visit: r.must_visit ?? false,
// });

// type HighlightGroup = {
// 	sub_category_id: string;
// 	sub_category_name: string;
// 	items: ReturnType<typeof toPublicItem>[];
// };

// type PageMode = 'welcome' | 'custom-plans' | 'subcategory';

// const getMode = (categoryId?: string): PageMode => {
// 	if (categoryId === 'welcome') return 'welcome';
// 	if (categoryId === 'custom-plans') return 'custom-plans';
// 	return 'subcategory';
// };

// async function fetchProperty(
// 	supabase: Awaited<ReturnType<typeof createServerAdminClient>>,
// 	propertyId: string,
// ) {
// 	const { data: property, error: propErr } = await supabase
// 		.from('properties')
// 		.select('*')
// 		.eq('id', propertyId)
// 		.single()
// 		.overrideTypes<FullProperty, { merge: false }>();

// 	if (propErr || !property?.id) notFound();
// 	if (property.latitude == null || property.longitude == null) notFound();

// 	return {
// 		property,
// 		lat: property.latitude as number,
// 		lng: property.longitude as number,
// 	};
// }

// async function fetchSubcategoryPageData(
// 	supabase: Awaited<ReturnType<typeof createServerAdminClient>>,
// 	propertyId: string,
// 	categoryId: string,
// 	subCategoryId: string,
// ) {
// 	const [
// 		{ data: items, error: errorPropertyData },
// 		{ data: typeRow, error: errorCategoryType },
// 		{ data: subcatRow, error: errorSubcats },
// 	] = await Promise.all([
// 		supabase
// 			.from('property_data')
// 			.select(PROPERTY_DATA_SELECT)
// 			.eq('property_id', propertyId)
// 			.eq('sub_category_id', subCategoryId)
// 			.order('featured', { ascending: false })
// 			.order('must_visit', { ascending: false })
// 			.order('name', { ascending: true })
// 			.overrideTypes<PropertyDataRow[], { merge: false }>(),
// 		supabase
// 			.from('categories')
// 			.select('type')
// 			.eq('id', categoryId)
// 			.single()
// 			.overrideTypes<CategoryTypeOnly, { merge: false }>(),
// 		supabase
// 			.from('sub_categories')
// 			.select('id, name')
// 			.eq('id', subCategoryId)
// 			.single()
// 			.overrideTypes<SubcatMini, { merge: false }>(),
// 	]);

// 	if (errorPropertyData || errorCategoryType || errorSubcats) notFound();

// 	return {
// 		propertyData: (items ?? []).map(toPublicItem),
// 		categoryType: typeRow ?? null,
// 		subCategory: subcatRow ?? null,
// 	};
// }

// function groupBySubcategory(
// 	items: PropertyDataRow[],
// 	subCategoryMap: Record<string, string>,
// ): HighlightGroup[] {
// 	const subCategoryIds = Array.from(
// 		new Set(
// 			(items ?? [])
// 				.map((i) => i.sub_category_id)
// 				.filter(
// 					(id): id is string =>
// 						typeof id === 'string' && id.length > 0,
// 				),
// 		),
// 	);

// 	return subCategoryIds.map((id) => ({
// 		sub_category_id: id,
// 		sub_category_name: subCategoryMap[id] ?? 'Sin nombre',
// 		items: (items ?? [])
// 			.filter((item) => item.sub_category_id === id)
// 			.map(toPublicItem),
// 	}));
// }

// async function fetchWelcomeHighlightsTabsData(
// 	supabase: Awaited<ReturnType<typeof createServerAdminClient>>,
// 	propertyId: string,
// ): Promise<{
// 	featuredGroups: HighlightGroup[];
// 	mustVisitGroups: HighlightGroup[];
// }> {
// 	const [
// 		{ data: featuredData, error: featuredErr },
// 		{ data: mustVisitData, error: mustVisitErr },
// 	] = await Promise.all([
// 		supabase
// 			.from('property_data')
// 			.select(PROPERTY_DATA_SELECT)
// 			.eq('property_id', propertyId)
// 			.eq('featured', true)
// 			.order('name', { ascending: true })
// 			.overrideTypes<PropertyDataRow[], { merge: false }>(),
// 		supabase
// 			.from('property_data')
// 			.select(PROPERTY_DATA_SELECT)
// 			.eq('property_id', propertyId)
// 			.eq('must_visit', true)
// 			.order('name', { ascending: true })
// 			.overrideTypes<PropertyDataRow[], { merge: false }>(),
// 	]);

// 	if (featuredErr || mustVisitErr) notFound();

// 	const featuredItems = featuredData ?? [];
// 	const mustVisitItems = mustVisitData ?? [];

// 	const allSubCategoryIds = Array.from(
// 		new Set(
// 			[...featuredItems, ...mustVisitItems]
// 				.map((i) => i.sub_category_id)
// 				.filter(
// 					(id): id is string =>
// 						typeof id === 'string' && id.length > 0,
// 				),
// 		),
// 	);

// 	if (allSubCategoryIds.length === 0) {
// 		return { featuredGroups: [], mustVisitGroups: [] };
// 	}

// 	const { data: subCategories, error: subErr } = await supabase
// 		.from('sub_categories')
// 		.select('id, name')
// 		.in('id', allSubCategoryIds)
// 		.overrideTypes<SubcatMini[], { merge: false }>();

// 	if (subErr || !subCategories) notFound();

// 	const subCategoryMap: Record<string, string> = Object.fromEntries(
// 		subCategories.map((s) => [s.id, s.name]),
// 	);

// 	return {
// 		featuredGroups: groupBySubcategory(featuredItems, subCategoryMap),
// 		mustVisitGroups: groupBySubcategory(mustVisitItems, subCategoryMap),
// 	};
// }

// interface PageProps {
// 	params: Promise<{ locale: string; slug: string[] }>;
// }

// export default async function Property({ params }: PageProps) {
// 	const t = await getTranslations();

// 	const cookieStore = await cookies();
// 	const anonId = cookieStore.get('be_anon_id')?.value ?? 'anon-missing';

// 	const { slug, locale } = await params;
// 	const [propertyId, categoryId, subCategoryId] = slug;

// 	// Tracking (no bloqueamos render si falla)
// 	try {
// 		await trackEvent({
// 			event: 'tenant_visit_public_page',
// 			distinctId: anonId,
// 			props: { property_id: propertyId, page: 'public_property' },
// 		});
// 	} catch (e) {
// 		console.error('Mixpanel trackEvent failed:', e);
// 	}

// 	const sidebarData = await getPublicSidebarData(propertyId);

// 	const supabase = await createServerAdminClient();
// 	const { property, lat, lng } = await fetchProperty(supabase, propertyId);

// 	const mode = getMode(categoryId);

// 	const welcomeTabsData =
// 		mode === 'welcome'
// 			? await fetchWelcomeHighlightsTabsData(supabase, propertyId)
// 			: null;

// 	const subcategoryData =
// 		mode === 'subcategory'
// 			? await fetchSubcategoryPageData(
// 					supabase,
// 					propertyId,
// 					categoryId,
// 					subCategoryId,
// 				)
// 			: null;

// 	return (
// 		<EditPublicMenuProvider initialData={sidebarData}>
// 			<PublicContentTemplate
// 				address={property.address}
// 				propertyId={propertyId}
// 				categoryId={categoryId}
// 				subCategoryId={subCategoryId}
// 				name={property.name}
// 				latitude={lat}
// 				longitude={lng}
// 				image={property.image_url}
// 			>
// 				<div className="p-4 font-roboto flex flex-col grow gap-4 bg-white rounded-lg overflow-hidden">
// 					{mode === 'welcome' && (
// 						<>
// 							<h1 className="font-heading text-3xl font-bold">
// 								{t(
// 									'¡Te damos la bienvenida con los brazos abiertos!',
// 								)}
// 							</h1>
// 							<p className="font-body">
// 								{t(
// 									'Nos alegra que hayas elegido nuestro alojamiento para tu estancia',
// 								)}
// 							</p>
// 							<p className="font-body">
// 								{t(
// 									'Nuestro espacio está preparado para que descanses, te relajes y vivas una experiencia cómoda y sin complicaciones',
// 								)}
// 							</p>

// 							<FeaturedMustVisit
// 								lat={lat}
// 								lng={lng}
// 								featuredGroups={
// 									welcomeTabsData?.featuredGroups ?? []
// 								}
// 								mustVisitGroups={
// 									welcomeTabsData?.mustVisitGroups ?? []
// 								}
// 								labels={{
// 									featuredTab: t('Destacados'),
// 									mustVisitTab: t('Imprescindibles'),
// 									featuredHeading: t(
// 										'Destacados del anfitrión',
// 									),
// 									mustVisitHeading: t('Visita obligatoria'),
// 									emptyFeatured: t(
// 										'Aún no hay destacados para mostrar.',
// 									),
// 									emptyMustVisit: t(
// 										'Aún no hay imprescindibles para mostrar.',
// 									),
// 								}}
// 							/>
// 						</>
// 					)}

// 					{mode === 'custom-plans' && (
// 						<ItineraryForm locale={locale} lat={lat} lng={lng} />
// 					)}

// 					{mode === 'subcategory' && subcategoryData && (
// 						<PropertyDataPublicBySubCategory
// 							propertyData={subcategoryData.propertyData}
// 							type={
// 								subcategoryData.categoryType?.type ?? 'location'
// 							}
// 							lat={lat}
// 							lng={lng}
// 							sub_category_name={
// 								subcategoryData.subCategory?.name
// 							}
// 						/>
// 					)}
// 				</div>
// 			</PublicContentTemplate>
// 		</EditPublicMenuProvider>
// 	);
// }

// import { notFound } from 'next/navigation';
// import { getTranslations } from 'next-intl/server';

// import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
// import PublicContentTemplate from '@/components/templates/public-content';
// import { getPublicSidebarData } from '@/utils/get-public-sidebar-data';
// import { EditPublicMenuProvider } from '@/lib/context/EditPublicMenuContext';
// import { PropertyDataPublicBySubCategory } from '@/components/templates/property-data-public';
// import IconStarShine from '@/components/atoms/icon/star-shine';
// import ItineraryForm from '@/components/organisms/form/custom-plan';

// import { trackEvent } from '@/lib/analytics/mixpanel';
// import { cookies } from 'next/headers';

// import type { Tables } from '@/lib/types';

// type FullProperty = Tables<'properties'>;
// type PropertyDataRow = Tables<'property_data'>;
// type CategoryTypeOnly = Pick<Tables<'categories'>, 'type'>;
// type SubcatMini = Pick<Tables<'sub_categories'>, 'id' | 'name'>;

// const toPublicItem = (r: PropertyDataRow) => ({
// 	id: r.id,
// 	name: r.name ?? 'Sin nombre',
// 	address: r.address ?? '',
// 	description: r.description ?? undefined,
// 	image_url: r.image_url ?? undefined, // ← importante: undefined, no '' ni null
// 	latitude: r.latitude ?? undefined,
// 	longitude: r.longitude ?? undefined,
// 	type: (r.type as 'info' | 'location') ?? undefined,
// 	featured: r.featured ?? false,
// 	must_visit: r.must_visit ?? false,
// });

// interface PageProps {
// 	params: Promise<{ locale: string; slug: string[] }>;
// }

// export default async function Property({ params }: PageProps) {
// 	const t = await getTranslations();

// 	const cookieStore = await cookies(); // <- importante en tu versión
// 	const anonId = cookieStore.get('be_anon_id')?.value ?? 'anon-missing';

// 	const { slug, locale } = await params;
// 	const [propertyId, categoryId, subCategoryId] = slug;

// 	await trackEvent({
// 		event: 'tenant_visit_public_page',
// 		distinctId: anonId,
// 		props: { property_id: propertyId, page: 'public_property' },
// 	});

// 	const sidebarData = await getPublicSidebarData(propertyId);

// 	const supabase = await createServerAdminClient();

// 	const { data: property, error: propErr } = await supabase
// 		.from('properties')
// 		.select('*')
// 		.eq('id', propertyId)
// 		.single()
// 		.overrideTypes<FullProperty, { merge: false }>();

// 	if (propErr || !property?.id) notFound();

// 	let categoryType: CategoryTypeOnly | null = null;
// 	let propertyData: PropertyDataRow[] = [];
// 	let subCategoryName: SubcatMini | null = null;

// 	// Para 'welcome'
// 	let highlightsData:
// 		| {
// 				sub_category_id: string;
// 				sub_category_name: string;
// 				items: PropertyDataRow[];
// 		  }[]
// 		| undefined;

// 	if (categoryId !== 'welcome' && categoryId !== 'custom-plans') {
// 		const { data, error: errorPropertyData } = await supabase
// 			.from('property_data')
// 			.select(
// 				'id,name,description,image_url,type,name,latitude,longitude,featured,must_visit,address',
// 			)
// 			.eq('property_id', propertyId)
// 			.eq('sub_category_id', subCategoryId)
// 			.order('featured', { ascending: false })
// 			.order('must_visit', { ascending: false })
// 			.order('name', { ascending: true })
// 			.overrideTypes<PropertyDataRow[], { merge: false }>();

// 		const { data: typeRow, error: errorCategoryType } = await supabase
// 			.from('categories')
// 			.select('type')
// 			.eq('id', categoryId)
// 			.single()
// 			.overrideTypes<CategoryTypeOnly, { merge: false }>();

// 		const { data: subcatRow, error: errorSubcats } = await supabase
// 			.from('sub_categories')
// 			.select('id, name')
// 			.eq('id', subCategoryId)
// 			.single()
// 			.overrideTypes<SubcatMini, { merge: false }>();

// 		if (errorPropertyData) notFound();
// 		if (errorCategoryType) notFound();
// 		if (errorSubcats) notFound();

// 		propertyData = data ?? [];
// 		categoryType = typeRow ?? null;
// 		subCategoryName = subcatRow ?? null;
// 	}

// 	if (categoryId === 'welcome') {
// 		const { data, error: errorHighlights } = await supabase
// 			.from('property_data')
// 			.select(
// 				'id, name, description, image_url, type, latitude, longitude, featured, must_visit, address, sub_category_id',
// 			)
// 			.eq('property_id', propertyId)
// 			.eq('featured', true)
// 			.eq('must_visit', true)
// 			.overrideTypes<PropertyDataRow[], { merge: false }>();

// 		if (errorHighlights) notFound();

// 		const subCategoryIds: string[] = Array.from(
// 			new Set(
// 				(data ?? [])
// 					.map((item) => item.sub_category_id)
// 					.filter(
// 						(id): id is string =>
// 							typeof id === 'string' && id.length > 0,
// 					),
// 			),
// 		);

// 		const { data: subCategories, error: errorSubcats } = await supabase
// 			.from('sub_categories')
// 			.select('id, name')
// 			.in('id', subCategoryIds)
// 			.overrideTypes<SubcatMini[], { merge: false }>();

// 		if (errorSubcats || !subCategories) notFound();

// 		const subCategoryMap: Record<string, string> = Object.fromEntries(
// 			subCategories.map((sub) => [sub.id, sub.name]),
// 		);

// 		const grouped = subCategoryIds.map((id) => ({
// 			sub_category_id: id,
// 			sub_category_name: subCategoryMap[id] ?? 'Sin nombre',
// 			items: (data ?? []).filter((item) => item.sub_category_id === id),
// 		}));

// 		highlightsData = grouped;
// 	}
// 	console.log(highlightsData);

// 	if (property.latitude == null || property.longitude == null) notFound();
// 	const lat = property.latitude as number;
// 	const lng = property.longitude as number;

// 	return (
// 		<EditPublicMenuProvider initialData={sidebarData}>
// 			<PublicContentTemplate
// 				address={property.address}
// 				propertyId={propertyId}
// 				categoryId={categoryId}
// 				subCategoryId={subCategoryId}
// 				name={property.name}
// 				latitude={lat}
// 				longitude={lng}
// 				image={property.image_url}
// 			>
// 				<div className="p-4 font-roboto flex flex-col grow gap-4 bg-white rounded-lg overflow-hidden">
// 					{categoryId === 'welcome' && (
// 						<>
// 							<h1 className="font-heading text-3xl font-bold">
// 								{t(
// 									'¡Te damos la bienvenida con los brazos abiertos!',
// 								)}
// 							</h1>
// 							<p className="font-body">
// 								{t(
// 									'Nos alegra que hayas elegido nuestro alojamiento para tu estancia',
// 								)}
// 							</p>
// 							<p className="font-body">
// 								{t(
// 									'Nuestro espacio está preparado para que descanses, te relajes y vivas una experiencia cómoda y sin complicaciones',
// 								)}
// 							</p>
// 							{highlightsData && highlightsData.length > 0 && (
// 								<>
// 									<div className="flex items-center mt-6 py-2 px-3 bg-warning-100 rounded-full w-fit">
// 										<IconStarShine color="warning" />
// 										<h2 className="font-heading ml-2 text-md font-medium flex text-warning-500">
// 											{t('Destacados')}
// 										</h2>
// 									</div>
// 									{highlightsData.map((group, index) => (
// 										<PropertyDataPublicBySubCategory
// 											key={index}
// 											propertyData={(
// 												group.items ?? []
// 											).map(toPublicItem)}
// 											lat={lat}
// 											lng={lng}
// 											type="location"
// 											sub_category_name={
// 												group.sub_category_name
// 											}
// 										/>
// 									))}
// 								</>
// 							)}
// 						</>
// 					)}

// 					{categoryId === 'custom-plans' && (
// 						<ItineraryForm locale={locale} lat={lat} lng={lng} />
// 					)}

// 					{categoryId !== 'welcome' &&
// 						categoryId !== 'custom-plans' && (
// 							<PropertyDataPublicBySubCategory
// 								propertyData={(propertyData ?? []).map(
// 									toPublicItem,
// 								)}
// 								type={categoryType?.type ?? 'location'}
// 								lat={lat}
// 								lng={lng}
// 								sub_category_name={subCategoryName?.name}
// 							/>
// 						)}
// 				</div>
// 			</PublicContentTemplate>
// 		</EditPublicMenuProvider>
// 	);
// }
