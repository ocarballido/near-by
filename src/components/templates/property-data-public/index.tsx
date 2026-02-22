'use client';

import { PropertyInfoContent } from '../property-info-content';
import PublicLocationContent from '../public-location-content';

export type PropertyDataItem = {
	id: string;
	name: string;
	address: string;
	description?: string;
	image_url?: string;
	latitude?: number;
	longitude?: number;
	type?: 'info' | 'location';
	featured?: boolean;
	must_visit?: boolean;
};

export function PropertyDataPublicBySubCategory({
	propertyData,
	type,
	sub_category_name,
	categoryId,
}: {
	propertyData: PropertyDataItem[];
	type: string;
	sub_category_name?: string;
	categoryId?: string;
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
					categoryId={categoryId}
					sub_category_name={sub_category_name}
				/>
			)}
		</>
	);
}
