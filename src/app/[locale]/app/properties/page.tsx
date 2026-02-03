import { redirect } from 'next/navigation';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { createSSRClient } from '@/lib/supabase/server';

import PropertiesContent from '@/components/templates/properties-content';
import AppContentTemplate from '@/components/templates/app-content';

type PropertyWithData = {
	id: string;
	name: string;
	slug: string;
	address: string | null;
	image_url: string | null;
	property_data: { type: string | null }[] | null;
};

export default async function Properties() {
	const ssrClient = await createSSRClient();
	const {
		data: { user },
		error: authError,
	} = await ssrClient.auth.getUser();

	if (authError || !user) {
		redirect('/auth/login');
	}

	const supabase = await createServerAdminClient();

	const { data, error } = await supabase
		.from('properties')
		.select(
			`
				id,
				name,
				slug,
				address,
				image_url,
				property_data ( type )
			`,
		)
		.eq('user_id', user.id)
		.overrideTypes<PropertyWithData[], { merge: false }>();

	if (error) {
		throw new Error('Error cargando propiedades: ' + error.message);
	}

	const properties = (data ?? []).map((p) => {
		const types = (p.property_data ?? []).map((x) =>
			(x?.type ?? '').toString().trim().toLowerCase(),
		);

		return {
			id: p.id,
			name: p.name,
			slug: p.slug,
			address: p.address ?? '',
			image_url: p.image_url ?? undefined,
			hasLocation: types.includes('location'),
			hasInfo: types.includes('info'),
		};
	});

	return (
		<AppContentTemplate>
			<div className="p-4 font-roboto bg-white rounded-lg overflow-hidden grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-min h-full">
				<PropertiesContent properties={properties} />
			</div>
		</AppContentTemplate>
	);
}
