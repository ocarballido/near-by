'use client';

import { useEffect, useRef } from 'react';
import { PropertyDataItem } from '@/components/templates/property-data-public';
import { waitForGoogleMapsReady } from '@/lib/google-maps/ready';

type MapProps = {
	locations: PropertyDataItem[];
};

const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID;

const Map: React.FC<MapProps> = ({ locations }) => {
	const mapRef = useRef<HTMLDivElement>(null);

	// Para limpiar markers entre renders
	const markersRef = useRef<Array<google.maps.marker.AdvancedMarkerElement>>(
		[],
	);

	useEffect(() => {
		let cancelled = false;

		const render = async () => {
			if (!mapRef.current || locations.length === 0) return;

			// Asegura que la Google Maps JS API está cargada
			await waitForGoogleMapsReady();
			if (cancelled) return;

			// Carga libs modernas
			await google.maps.importLibrary('maps');
			await google.maps.importLibrary('marker');
			if (cancelled) return;

			const first = locations[0];
			if (first.latitude == null || first.longitude == null) return;

			const map = new google.maps.Map(mapRef.current, {
				center: { lat: first.latitude, lng: first.longitude },
				zoom: 12,
				mapId: MAP_ID,
			});

			// Limpia markers anteriores
			markersRef.current.forEach((m) => {
				m.map = null;
			});
			markersRef.current = [];

			// Crea markers
			locations.forEach(({ latitude, longitude, name }) => {
				if (latitude == null || longitude == null) return;

				const marker = new google.maps.marker.AdvancedMarkerElement({
					map,
					position: { lat: latitude, lng: longitude },
					title: name,
				});

				markersRef.current.push(marker);
			});
		};

		render().catch((err) => {
			console.error('Error loading Google Map:', err);
		});

		return () => {
			cancelled = true;
			// Limpieza por si desmonta
			markersRef.current.forEach((m) => {
				m.map = null;
			});
			markersRef.current = [];
		};
	}, [locations]);

	return (
		<div
			ref={mapRef}
			className="w-full h-full min-h-[400px] max-h-[800px] rounded-md overflow-hidden"
		/>
	);
};

export default Map;
