// import { useTranslations } from 'next-intl';
import {
	// notFound,
	redirect,
} from 'next/navigation';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { createSSRClient } from '@/lib/supabase/server';

import Image from 'next/image';

import addProperty from '../../../../../public/static/img/add-property.webp';

import PropertiesContent from '@/components/templates/properties-content';
import PropertiesContentEmpty from '@/components/templates/properties-content-empty';
import AppContentTemplate from '@/components/templates/app-content';

interface InfoGeneral {
	id: string;
	property_id: string;
	category_id: string;
}

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

	const { data: properties, error: propError } = await supabase
		.from('properties')
		.select('id,name,slug,address,image_url')
		.eq('user_id', user.id);

	if (propError) {
		throw new Error('Error cargando propiedades: ' + propError.message);
	}

	const propertyIds = properties.map((p) => p.id);

	const { data: infos, error: infoError } = await supabase
		.from<'property_info', InfoGeneral>('property_info')
		.select('id,property_id,category_id')
		.in('property_id', propertyIds)
		.eq('title', 'Información general')
		.order('created_at', { ascending: true });
	if (infoError) {
		throw new Error(
			'Error cargando información general: ' + infoError.message
		);
	}

	const firstInfoByProperty: Record<string, InfoGeneral> = {};
	(infos || []).forEach((info) => {
		if (!firstInfoByProperty[info.property_id]) {
			firstInfoByProperty[info.property_id] = info;
		}
	});

	const items = properties.map((p) => ({
		...p,
		infoGeneral: firstInfoByProperty[p.id] || null,
	}));

	const { data: firstCategory, error: catError } = await supabase
		.from('categories')
		.select('id,name,icon')
		.order('order_index', { ascending: true })
		.limit(1)
		.single();
	if (catError) {
		throw new Error('Error cargando categorías: ' + catError.message);
	}

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
				<div className="p-4 font-roboto bg-white rounded-lg overflow-hiddengrid grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-min h-full">
					<PropertiesContent
						firstCategory={firstCategory}
						properties={items}
					/>
				</div>
			)}
		</AppContentTemplate>
	);
}
