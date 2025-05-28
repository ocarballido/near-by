'use client';

import { usePublicSidebarData } from '@/lib/context/EditPublicMenuContext';
import { useEffect, useState } from 'react';

import { PropertyInfoContent } from '../property-info-content';
import PublicLocationContent from '../public-location-content';
import { PropertyLocation } from '@/lib/types';

export function PropertyDataPublicBySubCategory({
	propertyId,
}: {
	propertyId: string;
	lat: number;
	lng: number;
}) {
	const { activeSubCategoryId, activeSubCategoryType } =
		usePublicSidebarData();
	const [data, setData] = useState<PropertyLocation[]>([]);
	const [loading, setLoading] = useState(false);

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

	return (
		<>
			{activeSubCategoryType === 'info' ? (
				<PropertyInfoContent infos={data} />
			) : (
				<PublicLocationContent locations={data} />
			)}
		</>
	);
}
