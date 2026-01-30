'use client';

import Script from 'next/script';
import { useEffect } from 'react';

type Props = {
	onReady?: () => void;
};

export default function GoogleMapsScript({ onReady }: Props) {
	const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

	useEffect(() => {
		// Si ya está cargado, dispara onReady al montar
		if (window.google?.maps && onReady) onReady();
	}, [onReady]);

	if (!apiKey) {
		// En producción quizá prefieras renderizar null y reportar por logger
		console.error('Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY');
		return null;
	}

	return (
		<Script
			id="google-maps-js"
			src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&loading=async`}
			strategy="afterInteractive"
			onLoad={() => onReady?.()}
			onError={() => console.error('Failed to load Google Maps JS API')}
		/>
	);
}
