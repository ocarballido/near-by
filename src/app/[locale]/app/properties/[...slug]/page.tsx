import { notFound, redirect } from 'next/navigation';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';

import { PropertyDataBySubCategory } from '@/components/templates/property-data';

import AppContentTemplate from '@/components/templates/app-content';
import { createSSRClient } from '@/lib/supabase/server';
import PropertyNameTitle from '@/components/atoms/property-name-title';

type PageProps = {
	params: Promise<{ slug: string[] }>;
};

export const dynamic = 'force-dynamic';

export default async function Property({ params }: PageProps) {
	const { slug } = await params;
	const [propertyId, categoryId, subCategoryId] = slug;

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
		.eq('id', propertyId)
		.single();
	if (propErr || !property?.id) notFound();

	const { data: propertyData, error: errorPropertyData } = await supabase
		.from('property_data')
		.select(
			'id,name,description,image_url,type,name,latitude,longitude,featured,address'
		)
		.eq('property_id', propertyId)
		.eq('sub_category_id', subCategoryId)
		.order('featured', { ascending: false })
		.order('name', { ascending: true });

	const { data: categoryType, error: errorCategoryType } = await supabase
		.from('categories')
		.select('type,name')
		.eq('id', categoryId)
		.single();

	const { data: subCategoryName, error: errorsubCategoryName } =
		await supabase
			.from('sub_categories')
			.select('name')
			.eq('id', subCategoryId)
			.single();

	if (errorCategoryType) notFound();
	if (errorPropertyData) notFound();
	if (errorsubCategoryName) notFound();

	return (
		<AppContentTemplate
			sidebar="PROPERTY"
			categoryId={categoryId}
			subCategoryId={subCategoryId}
			subcategoryGroupId={subCategoryId}
			propertyId={propertyId}
		>
			<div className="p-4 font-roboto flex flex-col grow gap-4 bg-white rounded-lg overflow-hidden">
				<PropertyNameTitle
					propertyName={property.name}
					subCategoryName={subCategoryName?.name}
				/>
				<PropertyDataBySubCategory
					propertyId={propertyId}
					subCategoryId={subCategoryId}
					categoryId={categoryId}
					type={categoryType?.type}
					propertyData={propertyData ?? []}
					lat={property.latitude}
					lng={property.longitude}
				/>
			</div>
		</AppContentTemplate>
	);
}
