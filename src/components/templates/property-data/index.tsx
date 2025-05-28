'use client';

import { useSidebarData } from '@/lib/context/EditMenuContext';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import addProperty from '../../../../public/static/img/add-property.webp';

import Image from 'next/image';

import { PropertyInfoContent } from '../property-info-content';
import EmptyContentAction from '@/components/molecules/empty-content-action';
import { LocationsContent } from '../locations-content';
import ButtonLinkMagic from '@/components/molecules/button-link-magic';

type PropertyDataItem = {
	id: string;
	name: string;
	address: string;
	description?: string;
	image_url: string;
	latitude?: number;
	longitude?: number;
	type?: 'info' | 'location';
	featured?: boolean;
};

export function PropertyDataBySubCategory({
	propertyId,
	lat,
	lng,
}: {
	propertyId: string;
	lat: number;
	lng: number;
}) {
	const t = useTranslations();

	const { activeSubCategoryId, activeCategoryId, activeSubCategoryType } =
		useSidebarData();
	const [data, setData] = useState<PropertyDataItem[]>([]);
	const [loading, setLoading] = useState(false);

	const router = useRouter();

	useEffect(() => {
		if (!activeSubCategoryId) return;

		const fetchData = async () => {
			setLoading(true);

			const res = await fetch('/api/property-data', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					propertyId,
					subCategoryId: activeSubCategoryId,
				}),
			});

			const { data } = await res.json();
			setData(data);
			setLoading(false);
		};

		fetchData();
	}, [activeSubCategoryId, propertyId]);

	if (loading || !activeSubCategoryId)
		return (
			<>
				{[1, 2, 3].map((item) => (
					<div
						key={item}
						className="w-full py-12 px-2 rounded-md bg-gray-200 animate-pulse"
					></div>
				))}
			</>
		);

	if (data.length === 0)
		return (
			<>
				{activeSubCategoryType === 'info' ? (
					<div className="block ml-auto mr-auto">
						<Image
							alt="Add location"
							src={addProperty}
							height={184}
							width={248}
						/>
						<EmptyContentAction
							className="mt-12"
							onClick={() =>
								router.push(
									`/app/info/${propertyId}/${activeCategoryId}/${activeSubCategoryId}`
								)
							}
						/>
					</div>
				) : (
					<div className="block ml-auto mr-auto">
						<Image
							alt="Add location"
							src={addProperty}
							height={184}
							width={248}
						/>
						<EmptyContentAction
							className="mt-12"
							onClick={() =>
								router.push(
									`/app/location/${propertyId}/${activeCategoryId}/${activeSubCategoryId}`
								)
							}
						/>
						<ButtonLinkMagic
							label={t('Buscador mágico')}
							url={`/app/magic-finder/${propertyId}/${lat}/${lng}/${activeCategoryId}/${activeSubCategoryId}`}
							className="w-fit ml-auto mr-auto mt-2"
						/>
					</div>
				)}
			</>
		);

	return (
		<>
			{activeSubCategoryType === 'info' ? (
				<PropertyInfoContent infos={data} />
			) : (
				<LocationsContent
					locations={data}
					propertyId={propertyId}
					categoryId={activeCategoryId}
					subCategoryId={activeSubCategoryId}
					lat={lat}
					lng={lng}
					setLocations={setData}
				/>
			)}
		</>
	);
}
