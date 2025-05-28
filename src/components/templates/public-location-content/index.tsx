'use client';

import { useState } from 'react';

import IconLocationOn from '@/components/atoms/icon/location-on';
import PlacePublic from '@/components/molecules/card/place-public';
import IconList from '@/components/atoms/icon/list';
import Map from '@/components/organisms/map';
import { PropertyLocation } from '@/lib/types';

const PublicLocationContent = ({
	locations = [],
}: {
	locations: PropertyLocation[];
}) => {
	const [activeView, setActiveView] = useState('list');
	console.log(locations);

	return (
		<>
			<div className="bg-white flex gap-1 rounded-lg p-1 justify-end top-2 right-2">
				<button
					type="button"
					className={`w-[36px] h-[36px] hover:cursor-pointer hover:${
						activeView === 'list'
							? 'bg-primary-500'
							: 'bg-primary-100'
					} flex justify-center items-center rounded-md ${
						activeView === 'list' ? 'bg-primary-500' : 'bg-white'
					}`}
					onClick={() => setActiveView('list')}
				>
					<IconList
						color={activeView === 'list' ? 'white' : 'primary'}
					/>
				</button>
				<button
					type="button"
					className={`w-[36px] h-[36px] hover:cursor-pointer hover:${
						activeView === 'map'
							? 'bg-primary-500'
							: 'bg-primary-100'
					} flex justify-center items-center rounded-md ${
						activeView === 'map' ? 'bg-primary-500' : 'bg-white'
					}`}
					onClick={() => setActiveView('map')}
				>
					<IconLocationOn
						color={activeView === 'map' ? 'white' : 'primary'}
					/>
				</button>
			</div>

			{activeView === 'list' ? (
				locations.map((loc) => (
					<PlacePublic
						key={loc.id}
						name={loc.name}
						latitude={loc.latitude}
						longitude={loc.longitude}
						address={loc.address}
						featured={loc.featured}
						image={loc.image_url}
					/>
				))
			) : (
				<Map locations={locations} />
			)}
		</>
	);
};

export default PublicLocationContent;
