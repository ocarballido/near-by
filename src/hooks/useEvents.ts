// hooks/useEvents.ts
'use client';

import { useCallback, useEffect, useState } from 'react';

const RADIUS_STEPS = [5, 15, 30, 50, 100];

type Event = {
	id: string;
	name: string;
	date: string;
	time: string;
	venue: string;
	city: string;
	distance: number;
	url: string;
	image?: string;
	category?: string;
};

type UseEventsResult = {
	events: Event[];
	loading: boolean;
	error: boolean;
	radiusUsed: number;
	manualRadius: number | null;
	setManualRadius: (r: number) => void;
	total: number;
};

export function useEvents(lat: number, lng: number): UseEventsResult {
	const [events, setEvents] = useState<Event[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [radiusUsed, setRadiusUsed] = useState(RADIUS_STEPS[0]);
	const [manualRadius, setManualRadius] = useState<number | null>(null);
	const [total, setTotal] = useState(0);

	const fetchEvents = useCallback(
		async (
			radiusIndex: number,
			manual: boolean,
			currentManualRadius: number | null,
		) => {
			setLoading(true);
			setError(false);

			const radius =
				manual && currentManualRadius !== null
					? currentManualRadius
					: RADIUS_STEPS[radiusIndex];

			try {
				const res = await fetch(
					`/api/events?lat=${lat}&lng=${lng}&radius=${radius}`,
				);

				if (!res.ok) throw new Error('fetch failed');

				const data = await res.json();

				// Auto-expansión: sin resultados y no es manual, probamos el siguiente radio
				if (
					data.events.length === 0 &&
					!manual &&
					radiusIndex < RADIUS_STEPS.length - 1
				) {
					return fetchEvents(radiusIndex + 1, false, null);
				}

				setEvents(data.events);
				setRadiusUsed(data.radiusUsed);
				setTotal(data.total);
			} catch {
				setError(true);
			} finally {
				setLoading(false);
			}
		},
		[lat, lng],
	);

	// Fetch inicial
	useEffect(() => {
		fetchEvents(0, false, null);
	}, [lat, lng]); // eslint-disable-line react-hooks/exhaustive-deps

	// Re-fetch cuando el usuario cambia el radio manualmente
	useEffect(() => {
		if (manualRadius !== null) {
			fetchEvents(0, true, manualRadius);
		}
	}, [manualRadius]); // eslint-disable-line react-hooks/exhaustive-deps

	return {
		events,
		loading,
		error,
		radiusUsed,
		manualRadius,
		setManualRadius,
		total,
	};
}
