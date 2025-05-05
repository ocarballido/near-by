'use client';

import { useRouter } from 'next/navigation';

import EmptyContentAction from '@/components/molecules/empty-content-action';
import House from '@/components/molecules/card/house';

export interface PropertyInfo {
	id: string;
	category_id: string;
	title: string;
	content: string;
	created_at: string;
}

type Property = {
	id: string;
	name: string;
	slug: string;
	image_url: string | null;
	address: string;
};

interface PropertyInfoProps {
	infos: PropertyInfo[] | null;
	property: Property;
	categoryId: string;
	subCategoryId: string;
}

export function PropertyInfoContent({
	property,
	categoryId,
	subCategoryId,
	infos,
}: PropertyInfoProps) {
	const router = useRouter();

	let info;

	if (infos) {
		info = infos[0];
	}

	if (!info) {
		return (
			<>
				<House
					key={property?.id}
					name={property?.name}
					image={property?.image_url || null}
					address={property?.address}
					deleatable={false}
					editeable={false}
				/>
			</>
		);
	}

	return info && info.content ? (
		<>
			<h2 className="font-heading text-lg font-bold">{info.title}</h2>
			<div className="font-medium whitespace-pre-wrap">
				{info.content}
			</div>
		</>
	) : (
		<EmptyContentAction
			className="mt-12"
			onClick={() =>
				router.push(
					`/app/info/${property.slug}/${categoryId}/${subCategoryId}`
				)
			}
		/>
	);
}
