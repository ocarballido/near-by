import { redirect } from 'next/navigation';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { createSSRClient } from '@/lib/supabase/server';

import Image from 'next/image';

import addProperty from '../../../../../public/static/img/add-property.webp';

import PropertiesContent from '@/components/templates/properties-content';
import PropertiesContentEmpty from '@/components/templates/properties-content-empty';
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
			address: p.address ?? '', // ✅ aquí
			image_url: p.image_url ?? undefined, // ✅ opcional para que case con el tipo del cliente
			hasLocation: types.includes('location'),
			hasInfo: types.includes('info'),
		};
	});

	return (
		<AppContentTemplate>
			{properties.length === 0 ? (
				<div className="p-4 font-roboto flex flex-col grow gap-4 bg-white rounded-lg overflow-hidden">
					<div className="block ml-auto mr-auto">
						<Image
							alt="Add location"
							src={addProperty}
							height={184}
							width={248}
						/>
					</div>
					<PropertiesContentEmpty url="/app/properties/new" />
				</div>
			) : (
				<div className="p-4 font-roboto bg-white rounded-lg overflow-hidden grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-min h-full">
					<PropertiesContent properties={properties} />
				</div>
			)}
		</AppContentTemplate>
	);
}
