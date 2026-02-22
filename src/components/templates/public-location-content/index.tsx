import PlacePublic from '@/components/molecules/card/place-public';
import Typography from '@/components/atoms/typography';

import { PropertyDataItem } from '../property-data-public';

const PublicLocationContent = ({
	sub_category_name,
	categoryId,
	locations = [],
}: {
	locations: PropertyDataItem[];
	sub_category_name?: string;
	categoryId?: string;
}) => {
	return (
		<div className="flex flex-col gap-3">
			{sub_category_name && (
				<Typography component="h2" size="lg">
					{sub_category_name}
				</Typography>
			)}
			<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-min">
				{locations.map((loc) => (
					<PlacePublic
						key={loc.id}
						name={loc.name}
						categoryId={categoryId}
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
