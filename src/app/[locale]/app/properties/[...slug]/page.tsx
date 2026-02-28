import { notFound, redirect } from 'next/navigation';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { createSSRClient } from '@/lib/supabase/server';

import AppContentTemplate from '@/components/templates/app-content';
import PropertyNameTitle from '@/components/atoms/property-name-title';
import PropertyDataBoard from '@/components/molecules/property-data-board';
import { PropertyDataBySubCategory } from '@/components/templates/property-data';

import type { Tables } from '@/lib/types';

type FullProperty = Tables<'properties'>;
type SubCategoryForPage = Pick<
	Tables<'sub_categories'>,
	'name' | 'type' | 'category_id'
>;

type PageProps = {
	params: Promise<{ slug: string[] }>;
};

export default async function Property({ params }: PageProps) {
	const { slug } = await params;
	const [propertyId, categoryId, subCategoryId] = slug;

	// Auth (cookie-based)
	const ssrClient = await createSSRClient();
	const {
		data: { user },
		error: authError,
	} = await ssrClient.auth.getUser();

	if (authError || !user) redirect('/auth/login');

	// Admin client (bypasses RLS) — but we will enforce ownership manually
	const supabase = await createServerAdminClient();

	// 1) Fetch property INCLUDING owner field
	const { data: property, error: propErr } = await supabase
		.from('properties')
		.select(
			'id,name,slug,image_url,address,latitude,longitude,check_in_date,check_in_time,check_out_date,check_out_time,user_id',
		)
		.eq('id', propertyId)
		.single()
		.overrideTypes<FullProperty & { user_id: string }, { merge: false }>();

	// Guards: exists
	if (propErr || !property?.id) notFound();

	// 2) Ownership guard (THIS is the missing protection)
	if (property.user_id !== user.id) notFound();

	// 3) Remaining queries in parallel (safe now because we already verified ownership)
	const propertyDataPromise = supabase
		.from('property_data')
		.select(
			'id,name,description,image_url,type,latitude,longitude,featured,address,must_visit',
		)
		.eq('property_id', propertyId)
		.eq('sub_category_id', subCategoryId)
		.order('featured', { ascending: false })
		.order('must_visit', { ascending: false })
		.order('name', { ascending: true });

	const subCategoryPromise = supabase
		.from('sub_categories')
		.select('name,type,category_id')
		.eq('id', subCategoryId)
		.single()
		.overrideTypes<SubCategoryForPage, { merge: false }>();

	const [
		{ data: propertyData, error: propertyDataErr },
		{ data: subCategory, error: subCategoryErr },
	] = await Promise.all([propertyDataPromise, subCategoryPromise]);

	if (propertyDataErr || subCategoryErr || !subCategory) notFound();

	// URL consistency
	if (subCategory.category_id !== categoryId) notFound();

	// Strict guard for map context
	if (property.latitude == null || property.longitude == null) notFound();

	return (
		<AppContentTemplate
			sidebar="PROPERTY"
			categoryId={categoryId}
			subCategoryId={subCategoryId}
			subcategoryGroupId={subCategoryId}
			propertyId={propertyId}
		>
			<PropertyDataBoard
				propertyName={property.name}
				propertyAddress={property.address}
				propertyCheckInDate={property.check_in_date ?? ''}
				propertyCheckInTime={property.check_in_time ?? ''}
				propertyCheckOutDate={property.check_out_date ?? ''}
				propertyCheckOutTime={property.check_out_time ?? ''}
				propertyId={propertyId}
				categoryId={categoryId}
				subCategoryId={subCategoryId}
			/>

			<div className="p-4 pt-0 font-roboto flex flex-col grow gap-4 rounded-lg overflow-hidden">
				<PropertyNameTitle subCategoryName={subCategory.name} />
				<PropertyDataBySubCategory
					propertyId={propertyId}
					subCategoryId={subCategoryId}
					categoryId={categoryId}
					type={subCategory.type ?? 'location'}
					propertyData={propertyData ?? []}
					lat={property.latitude}
					lng={property.longitude}
				/>
			</div>
		</AppContentTemplate>
	);
}
