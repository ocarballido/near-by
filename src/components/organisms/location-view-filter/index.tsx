'use client';

import { Fragment, useState } from 'react';

import IconList from '@/components/atoms/icon/list';
import IconLocationOn from '@/components/atoms/icon/location-on';

const LocationViewFilter = () => {
	const [activeView, setActiveView] = useState('list');

	return (
		<Fragment>
			<button
				type="button"
				className={`w-[36px] h-[36px] hover:cursor-pointer hover:${
					activeView === 'list' ? 'bg-primary-500' : 'bg-primary-100'
				} flex justify-center items-center rounded-md ${
					activeView === 'list' ? 'bg-primary-500' : 'bg-white'
				}`}
				onClick={() => setActiveView('list')}
			>
				<IconList color={activeView === 'list' ? 'white' : 'primary'} />
			</button>
			<button
				type="button"
				className={`w-[36px] h-[36px] hover:cursor-pointer hover:${
					activeView === 'map' ? 'bg-primary-500' : 'bg-primary-100'
				} flex justify-center items-center rounded-md ${
					activeView === 'map' ? 'bg-primary-500' : 'bg-white'
				}`}
				onClick={() => setActiveView('map')}
			>
				<IconLocationOn
					color={activeView === 'map' ? 'white' : 'primary'}
				/>
			</button>
		</Fragment>
	);
};

export default LocationViewFilter;
