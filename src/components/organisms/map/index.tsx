'use client';

import { useEffect, useRef } from 'react';

type Location = {
	latitude: number;
	longitude: number;
	name: string;
	address: string;
	image_url: string;
	group_id: string;
};

type MapProps = {
	locations: Location[];
};

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID;

let isScriptLoaded = false;

const Map: React.FC<MapProps> = ({ locations }) => {
	const mapRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const initMap = () => {
			if (
				!mapRef.current ||
				locations.length === 0 ||
				!window.google?.maps
			)
				return;

			const map = new window.google.maps.Map(mapRef.current, {
				center: {
					lat: locations[0].latitude,
					lng: locations[0].longitude,
				},
				zoom: 12,
				mapId: MAP_ID!,
			});

			locations.forEach(({ latitude, longitude, name }) => {
				new window.google.maps.marker.AdvancedMarkerElement({
					map,
					position: new google.maps.LatLng(latitude, longitude),
					title: name,
				});
			});
		};

		if (!GOOGLE_MAPS_API_KEY) {
			console.error('Missing Google Maps API Key');
			return;
		}

		if (!isScriptLoaded) {
			isScriptLoaded = true;

			const script = document.createElement('script');
			script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=marker&callback=initMap`;
			script.async = true;
			window.initMap = initMap;
			document.head.appendChild(script);
		} else {
			initMap();
		}
	}, [locations]);

	return (
		<div
			ref={mapRef}
			className="w-full h-full max-h-[800px] rounded-md overflow-hidden"
		/>
	);
};

export default Map;
