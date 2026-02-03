import PlacePublic from '@/components/molecules/card/place-public';

import { PropertyDataItem } from '../property-data-public';

const PublicLocationContent = ({
	sub_category_name,
	locations = [],
}: {
	locations: PropertyDataItem[];
	sub_category_name?: string;
}) => {
	return (
		<div className="flex flex-col gap-3">
			{sub_category_name && (
				<h3 className="font-heading font-bold mr-auto">
					{sub_category_name}
				</h3>
			)}
			<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-min">
				{locations.map((loc) => (
					<PlacePublic
						key={loc.id}
						name={loc.name}
						description={loc.description}
						latitude={loc.latitude}
						longitude={loc.longitude}
						address={loc.address}
						featured={loc.featured}
						mustSee={loc.must_visit}
						image={loc.image_url}
					/>
				))}
			</div>
		</div>
	);
};

export default PublicLocationContent;
