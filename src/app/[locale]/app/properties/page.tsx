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

import type { Tables } from '@/lib/types';

type PropertyMini = Pick<
	Tables<'properties'>,
	'id' | 'name' | 'slug' | 'address' | 'image_url'
>;
type InfoGeneralDB = Pick<
	Tables<'property_info'>,
	'id' | 'property_id' | 'category_id'
>;
type FirstCategoryDB = Pick<Tables<'categories'>, 'id' | 'name' | 'icon'>;

type InfoGeneral = { id: string; property_id: string; category_id: string };

type CategoryUI = { id: string; name: string; icon: string };
type PropertyUI = {
	id: string;
	name: string;
	slug: string;
	address: string;
	image_url: string;
	infoGeneral: InfoGeneral;
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

	const { data: propertiesRes, error: propError } = await supabase
		.from('properties')
		.select('id,name,slug,address,image_url')
		.eq('user_id', user.id)
		.overrideTypes<PropertyMini[], { merge: false }>();

	if (propError) {
		throw new Error('Error cargando propiedades: ' + propError.message);
	}
	const propertiesDB: PropertyMini[] = propertiesRes ?? [];

	const propertyIds: string[] = propertiesDB.map((p) => p.id);

	let infosDB: InfoGeneralDB[] = [];
	if (propertyIds.length > 0) {
		const { data: infosRes, error: infoError } = await supabase
			.from('property_info')
			.select('id,property_id,category_id')
			.in('property_id', propertyIds)
			.eq('title', 'Información general')
			.order('created_at', { ascending: true })
			.overrideTypes<InfoGeneralDB[], { merge: false }>();

		if (infoError) {
			throw new Error(
				'Error cargando información general: ' + infoError.message
			);
		}
		infosDB = infosRes ?? [];
	}

	const firstInfoByProperty: Record<string, InfoGeneralDB> = {};
	for (const info of infosDB) {
		if (!firstInfoByProperty[info.property_id]) {
			firstInfoByProperty[info.property_id] = info;
		}
	}

	const items: PropertyUI[] = propertiesDB.map((p) => ({
		id: p.id,
		name: p.name,
		slug: p.slug ?? '', // <- fallback
		address: p.address,
		image_url: p.image_url ?? '', // <- fallback
		infoGeneral: firstInfoByProperty[p.id] ?? null,
	}));

	const { data: firstCategoryDB, error: catError } = await supabase
		.from('categories')
		.select('id,name,icon')
		.order('order_index', { ascending: true })
		.limit(1)
		.single()
		.overrideTypes<FirstCategoryDB, { merge: false }>();

	if (catError) {
		throw new Error('Error cargando categorías: ' + catError.message);
	}

	const firstCategory: CategoryUI = {
		id: firstCategoryDB.id,
		name: firstCategoryDB.name,
		icon: firstCategoryDB.icon ?? '', // <- fallback a string vacío o a tu icono por defecto
	};

	return (
		<AppContentTemplate>
			{items.length === 0 ? (
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
