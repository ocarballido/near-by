import { notFound, redirect } from 'next/navigation';
import AddPropertyForm from '@/components/organisms/form/property';

import { createSSRClient } from '@/lib/supabase/server';
import type { Tables } from '@/lib/types';

type FullProperty = Tables<'properties'>;

type PageProps = {
	params: Promise<{ id: string }>; // ✅ Next 15
};

export const dynamic = 'force-dynamic';

export default async function EditProperty({ params }: PageProps) {
	const { id: propertyId } = await params;

	// 1) Auth (SSR client)
	const supabase = await createSSRClient();
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) {
		redirect('/auth/login');
	}

	// 2) Query property (SSR client => RLS applies)
	const { data: property, error: propErr } = await supabase
		.from('properties')
		.select(
			'id,user_id,name,address,latitude,longitude,image_url,check_in_date,check_in_time,check_out_date,check_out_time,access_instructions',
		)
		.eq('id', propertyId)
		.single()
		.overrideTypes<FullProperty, { merge: false }>();

	// With RLS, if it's not yours you'll get 0 rows => notFound
	if (propErr || !property?.id) notFound();

	// (Optional) extra guard, harmless, but no longer required for security
	// if (property.user_id !== user.id) redirect('/app/properties');

	// 3) initialValues para el form
	const initialValues = {
		name: property.name ?? '',
		address: property.address ?? '',
		latitude: property.latitude ?? null,
		longitude: property.longitude ?? null,
		check_in_date: property.check_in_date ?? null,
		check_in_time: property.check_in_time ?? null,
		check_out_date: property.check_out_date ?? null,
		check_out_time: property.check_out_time ?? null,
		image_url: property.image_url ?? null,
		access_instructions: property.access_instructions ?? null,
	};

	return (
		<div className="p-4 font-roboto flex flex-col grow gap-4 rounded-lg overflow-hidden justify-center items-center relative">
			<AddPropertyForm
				propertyId={propertyId}
				initialValues={initialValues}
			/>
		</div>
	);
}
