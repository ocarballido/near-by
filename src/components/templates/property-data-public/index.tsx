'use client';

import { PropertyInfoContent } from '../property-info-content';
import PublicLocationContent from '../public-location-content';

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

export function PropertyDataPublicBySubCategory({
	propertyData,
	type,
	sub_category_name,
}: {
	propertyData: PropertyDataItem[];
	type: string;
	sub_category_name?: string;
	lat: number;
	lng: number;
}) {
	return (
		<>
			{type === 'info' ? (
				<PropertyInfoContent
					infos={propertyData}
					sub_category_name={sub_category_name}
				/>
			) : (
				<PublicLocationContent
					locations={propertyData}
					sub_category_name={sub_category_name}
				/>
			)}
		</>
	);
}
