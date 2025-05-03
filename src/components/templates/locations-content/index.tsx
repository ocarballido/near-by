'use client';

import PropertiesContentEmpty from '@/components/templates/properties-content-empty';
import Place from '@/components/molecules/card/place';
import ButtonLink from '@/components/molecules/button-link';

export interface Location {
	id: string;
	group_id: string;
	name: string;
	address: string;
	image_url: string;
}

interface LocationsProps {
	locations: Location[];
	emptyUrl: string;
}

export function LocationsContent({ locations, emptyUrl }: LocationsProps) {
	if (locations.length === 0) {
		return <PropertiesContentEmpty url={emptyUrl} />;
	}
	return (
		<>
			{locations.map((loc) => (
				<Place
					key={loc.id}
					name={loc.name}
					address={loc.address}
					image={loc.image_url}
				/>
			))}
			<ButtonLink label="Nuevo sitio" color="secondary" href={emptyUrl} />
		</>
	);
}
