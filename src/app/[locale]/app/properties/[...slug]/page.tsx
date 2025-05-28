import { notFound, redirect } from 'next/navigation';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';

import { PropertyDataBySubCategory } from '@/components/templates/property-data';

import AppContentTemplate from '@/components/templates/app-content';
import { createSSRClient } from '@/lib/supabase/server';
import PropertyNameTitle from '@/components/atoms/property-name-title';

type PageProps = {
	params: Promise<{ slug: string[] }>;
};

export default async function Property({ params }: PageProps) {
	const { slug } = await params;
	const [propertyId, categoryId, subcategoryId] = slug;

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

	return (
		<AppContentTemplate
			sidebar="PROPERTY"
			categoryId={categoryId}
			subcategoryGroupId={subcategoryId}
			propertyId={propertyId}
		>
			<div className="p-4 font-roboto flex flex-col grow gap-4 bg-white rounded-lg overflow-hidden">
				<PropertyNameTitle propertyName={property.name} />
				<PropertyDataBySubCategory
					propertyId={propertyId}
					lat={property.latitude}
					lng={property.longitude}
				/>
			</div>
		</AppContentTemplate>
	);
}
