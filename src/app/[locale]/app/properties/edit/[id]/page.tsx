import { notFound, redirect } from 'next/navigation';
import AddPropertyForm from '@/components/organisms/form/property';

import { createSSRClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';

import type { Tables } from '@/lib/types';

type FullProperty = Tables<'properties'>;

type PageProps = {
	params: Promise<{ id: string }>; // ✅ Next 15
};

export const dynamic = 'force-dynamic';

export default async function EditProperty({ params }: PageProps) {
	const { id: propertyId } = await params;

	// 1) Auth (SSR client)
	const ssrClient = await createSSRClient();
	const {
		data: { user },
		error: authError,
	} = await ssrClient.auth.getUser();

	if (authError || !user) {
		redirect('/auth/login');
	}

	// 2) Query property (Admin client, igual que ya haces)
	const supabase = await createServerAdminClient();

	const { data: property, error: propErr } = await supabase
		.from('properties')
		.select(
			'id,user_id,name,address,latitude,longitude,image_url,check_in_date,check_in_time,check_out_date,check_out_time',
		)
		.eq('id', propertyId)
		.single()
		// ✅ Tipado EXACTO como en tu otra página
		.overrideTypes<FullProperty, { merge: false }>();

	if (propErr || !property?.id) notFound();

	// 3) Ownership guard (extra)
	if (property.user_id !== user.id) {
		redirect('/app/properties');
	}

	// 4) initialValues para el form (nombres que espera AddPropertyForm)
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
