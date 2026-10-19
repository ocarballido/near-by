import { NextRequest, NextResponse } from 'next/server';

import { EVENTS_RADIUS_STEPS } from '@/config/config-constants';

const MAX_PAGE = 4;

// CDN de Vercel: misma vida que la Data Cache de la llamada a Ticketmaster.
// Vercel quita s-maxage y stale-while-revalidate antes de llegar al navegador
const CACHE_CONTROL = 'public, s-maxage=3600, stale-while-revalidate=3600';

// Presupuesto para toda la búsqueda (todos los radios de auto, no por
// llamada): un Ticketmaster lento no debe dejar la función ocupada
const EVENTS_LOOKUP_TIMEOUT_MS = 8000;

// Solo los campos de Ticketmaster que se leen
type TicketmasterEvent = {
	id: string;
	name: string;
	url?: string;
	distance?: number;
	dates?: { start?: { localDate?: string; localTime?: string } };
	images?: { ratio?: string; width?: number; url?: string }[];
	classifications?: { segment?: { name?: string } }[];
	_embedded?: { venues?: { name?: string; city?: { name?: string } }[] };
};

type TicketmasterResponse = {
	_embedded?: { events?: TicketmasterEvent[] };
	page?: { totalElements: number; number: number; totalPages: number };
};

type NormalizedEvent = {
	id: string;
	name: string;
	date: string | null;
	time: string | null;
	venue: string | null;
	city: string | null;
	distance: number | null;
	url: string;
	image: string | null;
	category: string | null;
};

type EventsPage = {
	events: NormalizedEvent[];
	total: number;
	hasMore: boolean;
};

class UpstreamError extends Error {}

const toTicketmasterDate = (date: Date) =>
	date.toISOString().split('.')[0] + 'Z';

// Redondeo a 2 decimales (~1 km): las coordenadas forman parte de la clave
// de caché, y sin normalizar bastaba variar un decimal para saltársela
const parseCoordinate = (value: string | null, limit: number): number | null => {
	if (value === null || value.trim() === '') return null;
	const parsed = Number(value);
	if (!Number.isFinite(parsed) || Math.abs(parsed) > limit) return null;
	return Math.round(parsed * 100) / 100;
};

// La URL del evento acaba en un href de la guía pública: solo http(s)
const isHttpUrl = (value: unknown): value is string => {
	if (typeof value !== 'string') return false;
	try {
		const { protocol } = new URL(value);
		return protocol === 'https:' || protocol === 'http:';
	} catch {
		return false;
	}
};

async function fetchEventsPage(
	lat: number,
	lng: number,
	radius: number,
	page: number,
	signal: AbortSignal,
): Promise<EventsPage> {
	// Redondeado a la hora: la URL de Ticketmaster es la clave de la caché
	// (revalidate 3600), y con segundos nunca se repetía
	const today = new Date();
	today.setUTCMinutes(0, 0, 0);
	const oneMonthLater = new Date(
		today.getTime() + 30 * 24 * 60 * 60 * 1000,
	);

	const url = new URL(
		'https://app.ticketmaster.com/discovery/v2/events.json',
	);
	url.searchParams.set('apikey', process.env.TICKETMASTER_API_KEY!);
	url.searchParams.set('latlong', `${lat},${lng}`);
	url.searchParams.set('radius', String(radius));
	url.searchParams.set('unit', 'km');
	url.searchParams.set('size', '20');
	url.searchParams.set('page', String(page));
	url.searchParams.set('sort', 'date,asc');
	url.searchParams.set('startDateTime', toTicketmasterDate(today));
	url.searchParams.set('endDateTime', toTicketmasterDate(oneMonthLater));

	let res: Response;
	try {
		res = await fetch(url.toString(), {
			next: { revalidate: 3600 },
			signal,
		});
	} catch (error) {
		// Timeout o fallo de red: se trata igual que un error de Ticketmaster
		if (error instanceof Error && error.name === 'TimeoutError') {
			console.error('[api/events] Ticketmaster timeout');
			throw new UpstreamError();
		}
		throw error;
	}

	if (!res.ok) {
		console.error('[api/events] Ticketmaster error:', res.status);
		throw new UpstreamError();
	}

	// Texto fijo en el log: el mensaje de un JSON inválido incluye parte del
	// cuerpo, que es contenido externo
	let data: TicketmasterResponse;
	try {
		data = await res.json();
	} catch {
		console.error('[api/events] Ticketmaster invalid JSON response');
		throw new UpstreamError();
	}

	const events = data._embedded?.events ?? [];

	const seen = new Set<string>();
	const normalized: NormalizedEvent[] = [];
	for (const e of events) {
		if (!isHttpUrl(e.url)) continue;
		if (seen.has(e.name)) continue;
		seen.add(e.name);

		normalized.push({
			id: e.id,
			name: e.name,
			date: e.dates?.start?.localDate ?? null,
			time: e.dates?.start?.localTime ?? null,
			venue: e._embedded?.venues?.[0]?.name ?? null,
			city: e._embedded?.venues?.[0]?.city?.name ?? null,
			distance: e.distance ?? null,
			url: e.url,
			image:
				e.images?.find((i) => i.ratio === '16_9' && (i.width ?? 0) > 500)
					?.url ?? null,
			category: e.classifications?.[0]?.segment?.name ?? null,
		});
	}

	return {
		events: normalized,
		total: data.page?.totalElements ?? 0,
		hasMore:
			data.page !== undefined &&
			data.page.number + 1 < data.page.totalPages,
	};
}

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const lat = parseCoordinate(searchParams.get('lat'), 90);
	const lng = parseCoordinate(searchParams.get('lng'), 180);
	const radiusParam = searchParams.get('radius');
	const isAutoRadius = radiusParam === 'auto';
	const radius = isAutoRadius
		? EVENTS_RADIUS_STEPS[0]
		: Number(radiusParam ?? EVENTS_RADIUS_STEPS[0]);
	const page = Number(searchParams.get('page') ?? 0);

	if (lat === null || lng === null) {
		return NextResponse.json(
			{ error: 'Valid lat and lng are required' },
			{ status: 400 },
		);
	}

	if (!EVENTS_RADIUS_STEPS.includes(radius)) {
		return NextResponse.json({ error: 'Invalid radius' }, { status: 400 });
	}

	if (!Number.isInteger(page) || page < 0 || page > MAX_PAGE) {
		return NextResponse.json({ error: 'Invalid page' }, { status: 400 });
	}

	// Con auto, una página > 0 vaciaría radios con eventos y forzaría a
	// recorrer todos los pasos: más llamadas a Ticketmaster sin utilidad
	if (isAutoRadius && page > 0) {
		return NextResponse.json(
			{ error: 'Page is not supported with radius=auto' },
			{ status: 400 },
		);
	}

	// radius=auto: el radio se amplía aquí y no en el navegador, que así hace
	// una sola petición. En serie y no en paralelo para no multiplicar la
	// presión sobre Ticketmaster (5 req/s); la mayoría de pasos salen de la
	// Data Cache
	const radii = isAutoRadius ? EVENTS_RADIUS_STEPS : [radius];
	const signal = AbortSignal.timeout(EVENTS_LOOKUP_TIMEOUT_MS);

	try {
		let radiusUsed = radii[0];
		let result = await fetchEventsPage(lat, lng, radiusUsed, page, signal);

		for (const nextRadius of radii.slice(1)) {
			if (result.events.length > 0) break;
			radiusUsed = nextRadius;
			result = await fetchEventsPage(
				lat,
				lng,
				radiusUsed,
				page,
				signal,
			);
		}

		return NextResponse.json(
			{ ...result, radiusUsed },
			{ headers: { 'Cache-Control': CACHE_CONTROL } },
		);
	} catch (error) {
		// Estado genérico: no revelar si la clave es inválida o la cuota se agotó
		if (error instanceof UpstreamError) {
			return NextResponse.json(
				{ error: 'Upstream error' },
				{ status: 502 },
			);
		}
		// Solo nombre y mensaje: nunca la URL, que lleva la API key
		console.error(
			'[api/events] Unexpected error:',
			error instanceof Error ? `${error.name}: ${error.message}` : error,
		);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}
