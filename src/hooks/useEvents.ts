// hooks/useEvents.ts
'use client';

import { useEffect, useState } from 'react';

import { EVENTS_RADIUS_STEPS } from '@/config/config-constants';

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

type EventsResponse = {
	events: Event[];
	total: number;
	radiusUsed: number;
};

export type UseEventsResult = {
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
	const [radiusUsed, setRadiusUsed] = useState(EVENTS_RADIUS_STEPS[0]);
	const [manualRadius, setManualRadius] = useState<number | null>(null);
	const [total, setTotal] = useState(0);

	// Sin radio manual, el servidor amplía el radio hasta encontrar eventos
	// (radius=auto): una sola petición en vez de una por cada radio
	useEffect(() => {
		const controller = new AbortController();
		const radius = manualRadius ?? 'auto';

		const loadEvents = async () => {
			setLoading(true);
			setError(false);

			try {
				const res = await fetch(
					`/api/events?lat=${lat}&lng=${lng}&radius=${radius}`,
					{ signal: controller.signal },
				);

				if (!res.ok) throw new Error('fetch failed');

				const data: EventsResponse = await res.json();
				if (controller.signal.aborted) return;

				setEvents(data.events);
				setRadiusUsed(data.radiusUsed);
				setTotal(data.total);
			} catch {
				if (controller.signal.aborted) return;
				setError(true);
			} finally {
				if (!controller.signal.aborted) setLoading(false);
			}
		};

		loadEvents();

		// Una respuesta de un radio anterior (o tras desmontar) no pisa el estado
		return () => controller.abort();
	}, [lat, lng, manualRadius]);

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
