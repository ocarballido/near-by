import { PropertyLocation } from '@/lib/types';

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
}

interface PropertyInfoProps {
	infos: PropertyLocation[];
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
						<h3 className="font-heading font-bold mr-auto">
							{sub_category_name}
						</h3>
					)}
					<div className="font-medium whitespace-pre-wrap">
						{info?.description}
					</div>
				</>
			)}
		</>
	);
}
