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
}

export function PropertyInfoContent({ infos }: PropertyInfoProps) {
	let info;

	if (infos) {
		info = infos[0];
	}

	return (
		<>
			{info?.description && (
				<div className="font-medium whitespace-pre-wrap">
					{info?.description}
				</div>
			)}
		</>
	);
}
