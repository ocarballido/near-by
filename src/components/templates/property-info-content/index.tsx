import { PropertyDataItem } from '../property-data-public';
import Typography from '@/components/atoms/typography';

export interface PropertyInfo {
	id: string;
	name: string;
	address: string;
	description?: string;
	image_url: string;
	latitude?: number;
	longitude?: number;
	type?: string;
	featured?: boolean;
	mustSee?: boolean;
}

interface PropertyInfoProps {
	infos: PropertyDataItem[];
	sub_category_name?: string;
}

export function PropertyInfoContent({
	infos,
	sub_category_name,
}: PropertyInfoProps) {
	let info;

	if (infos) {
		info = infos[0];
	}

	return (
		<>
			{info?.description && (
				<>
					{sub_category_name && (
						<Typography component="h2" size="lg">
							{sub_category_name}
						</Typography>
					)}
					<div className="font-medium whitespace-pre-wrap">
						{info?.description}
					</div>
				</>
			)}
		</>
	);
}
