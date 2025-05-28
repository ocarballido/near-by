import { notFound } from 'next/navigation';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import PublicContentTemplate from '@/components/templates/public-content';
import { getPublicSidebarData } from '@/utils/get-public-sidebar-data';
import { EditPublicMenuProvider } from '@/lib/context/EditPublicMenuContext';
import { PropertyDataPublicBySubCategory } from '@/components/templates/property-data-public';

type PageProps = { params: Promise<{ slug: string[] }> };

export default async function Property({ params }: PageProps) {
	const { slug } = await params;
	const [propertyId] = slug;

	const sidebarData = await getPublicSidebarData(propertyId);

	const supabase = await createServerAdminClient();

	const { data: property, error: propErr } = await supabase
		.from('properties')
		.select('id,name,slug,image_url,address,latitude,longitude')
		.eq('id', propertyId)
		.single();
	if (propErr || !property?.id) notFound();

	return (
		<EditPublicMenuProvider initialData={sidebarData}>
			<PublicContentTemplate
				address={property.address}
				name={property.name}
				latitude={property.latitude}
				longitude={property.longitude}
				image={property.image_url}
			>
				<div className="p-4 font-roboto flex flex-col grow gap-4 bg-white rounded-lg overflow-hidden">
					<PropertyDataPublicBySubCategory
						propertyId={propertyId}
						lat={property.latitude}
						lng={property.longitude}
					/>
				</div>
			</PublicContentTemplate>
		</EditPublicMenuProvider>
	);
}
