import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import PublicContentTemplate from '@/components/templates/public-content';
import { getPublicSidebarData } from '@/utils/get-public-sidebar-data';
import { EditPublicMenuProvider } from '@/lib/context/EditPublicMenuContext';
import { PropertyDataPublicBySubCategory } from '@/components/templates/property-data-public';

type PageProps = { params: Promise<{ slug: string[] }> };

export default async function Property({ params }: PageProps) {
	const t = await getTranslations();

	const { slug } = await params;
	const [propertyId, categoryId, subCategoryId] = slug;

	const sidebarData = await getPublicSidebarData(propertyId);

	const supabase = await createServerAdminClient();

	const { data: property, error: propErr } = await supabase
		.from('properties')
		.select('id,name,slug,image_url,address,latitude,longitude')
		.eq('id', propertyId)
		.single();
	if (propErr || !property?.id) notFound();

	const { data: propertyData, error: errorPropertyData } = await supabase
		.from('property_data')
		.select(
			'id,name,description,image_url,type,name,latitude,longitude,featured,address'
		)
		.eq('property_id', propertyId)
		.eq('sub_category_id', subCategoryId);

	const { data: categoryType, error: errorCategoryType } = await supabase
		.from('categories')
		.select('type')
		.eq('id', categoryId)
		.single();

	const { data: highlightsData, error: errorHighlights } = await supabase
		.from('property_data')
		.select(
			'id, name, description, image_url, type, latitude, longitude, featured, address'
		)
		.eq('property_id', propertyId)
		.eq('featured', true);

	if (categoryId !== 'welcome' && errorPropertyData) notFound();
	if (categoryId !== 'welcome' && errorCategoryType) notFound();
	if (categoryId === 'welcome' && errorHighlights) notFound();

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
					{categoryId === 'welcome' ? (
						<>
							<h1 className="font-heading text-3xl font-bold">
								{t(
									'¡Te damos la bienvenida con los brazos abiertos!'
								)}
							</h1>
							<h1 className="font-body">
								{t(
									'Nos alegra que hayas elegido nuestro alojamiento para tu estancia'
								)}
							</h1>
							<h1 className="font-body">
								{t(
									'Nuestro espacio está preparado para que descanses, te relajes y vivas una experiencia cómoda y sin complicaciones'
								)}
							</h1>
							{highlightsData && (
								<>
									<h2 className="font-heading text-xl font-bold mt-6">
										Highlights
									</h2>
									<PropertyDataPublicBySubCategory
										propertyData={highlightsData || []}
										lat={property.latitude}
										lng={property.longitude}
										type="location"
									/>
								</>
							)}
						</>
					) : (
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
