import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import PublicContentTemplate from '@/components/templates/public-content';
import { getPublicSidebarData } from '@/utils/get-public-sidebar-data';
import { EditPublicMenuProvider } from '@/lib/context/EditPublicMenuContext';
import { PropertyDataPublicBySubCategory } from '@/components/templates/property-data-public';
import IconStarShine from '@/components/atoms/icon/star-shine';
import ItineraryForm from '@/components/organisms/form/custom-plan';

interface PageProps {
	params: Promise<{ locale: string; slug: string[] }>;
}

export default async function Property({ params }: PageProps) {
	const t = await getTranslations();

	const { slug, locale } = await params;
	const [propertyId, categoryId, subCategoryId] = slug;
	console.log(locale);

	const sidebarData = await getPublicSidebarData(propertyId);

	const supabase = await createServerAdminClient();

	const { data: property, error: propErr } = await supabase
		.from('properties')
		.select('id,name,slug,image_url,address,latitude,longitude')
		.eq('id', propertyId)
		.single();
	if (propErr || !property?.id) notFound();

	let categoryType;
	let propertyData;
	let highlightsData;
	console.log(categoryId);

	if (categoryId !== 'welcome' && categoryId !== 'custom-plans') {
		const { data, error: errorPropertyData } = await supabase
			.from('property_data')
			.select(
				'id,name,description,image_url,type,name,latitude,longitude,featured,address'
			)
			.eq('property_id', propertyId)
			.eq('sub_category_id', subCategoryId)
			.order('featured', { ascending: false })
			.order('name', { ascending: true });

		const { data: type, error: errorCategoryType } = await supabase
			.from('categories')
			.select('type')
			.eq('id', categoryId)
			.single();

		propertyData = data;
		categoryType = type;

		if (errorPropertyData) notFound();
		if (errorCategoryType) notFound();
	}

	if (categoryId === 'welcome') {
		const { data, error: errorHighlights } = await supabase
			.from('property_data')
			.select(
				'id, name, description, image_url, type, latitude, longitude, featured, address'
			)
			.eq('property_id', propertyId)
			.eq('featured', true);

		highlightsData = data;

		if (errorHighlights) notFound();
	}

	return (
		<EditPublicMenuProvider initialData={sidebarData}>
			<PublicContentTemplate
				address={property.address}
				propertyId={propertyId}
				categoryId={categoryId}
				subCategoryId={subCategoryId}
				name={property.name}
				latitude={property.latitude}
				longitude={property.longitude}
				image={property.image_url}
			>
				<div className="p-4 font-roboto flex flex-col grow gap-4 bg-white rounded-lg overflow-hidden">
					{categoryId === 'welcome' && (
						<>
							<h1 className="font-heading text-3xl font-bold">
								{t(
									'¡Te damos la bienvenida con los brazos abiertos!'
								)}
							</h1>
							<p className="font-body">
								{t(
									'Nos alegra que hayas elegido nuestro alojamiento para tu estancia'
								)}
							</p>
							<p className="font-body">
								{t(
									'Nuestro espacio está preparado para que descanses, te relajes y vivas una experiencia cómoda y sin complicaciones'
								)}
							</p>
							{highlightsData && highlightsData.length > 0 && (
								<>
									<div className="flex items-center mt-6 py-2 px-3 bg-warning-100 rounded-full w-fit">
										<IconStarShine color="warning" />
										<h2 className="font-heading ml-2 text-md font-medium flex text-warning-500">
											{t('Destacados')}
										</h2>
									</div>
									<PropertyDataPublicBySubCategory
										propertyData={highlightsData || []}
										lat={property.latitude}
										lng={property.longitude}
										type="location"
									/>
								</>
							)}
						</>
					)}

					{categoryId === 'custom-plans' && (
						<ItineraryForm
							locale={locale}
							lat={property.latitude}
							lng={property.longitude}
						/>
					)}

					{categoryId !== 'welcome' &&
						categoryId !== 'custom-plans' && (
							<PropertyDataPublicBySubCategory
								propertyData={propertyData || []}
								type={categoryType?.type}
								lat={property.latitude}
								lng={property.longitude}
							/>
						)}
				</div>
			</PublicContentTemplate>
		</EditPublicMenuProvider>
	);
}
