import { NextRequest, NextResponse } from 'next/server';

const RADIUS_STEPS = [5, 15, 30, 50, 100];
const MAX_PAGE = 4;

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

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const lat = parseCoordinate(searchParams.get('lat'), 90);
	const lng = parseCoordinate(searchParams.get('lng'), 180);
	const radius = Number(searchParams.get('radius') ?? RADIUS_STEPS[0]);
	const page = Number(searchParams.get('page') ?? 0);

	if (lat === null || lng === null) {
		return NextResponse.json(
			{ error: 'Valid lat and lng are required' },
			{ status: 400 },
		);
	}

	if (!RADIUS_STEPS.includes(radius)) {
		return NextResponse.json({ error: 'Invalid radius' }, { status: 400 });
	}

	if (!Number.isInteger(page) || page < 0 || page > MAX_PAGE) {
		return NextResponse.json({ error: 'Invalid page' }, { status: 400 });
	}

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

	try {
		const res = await fetch(url.toString(), {
			next: { revalidate: 3600 },
		});

		// Estado genérico: no revelar si la clave es inválida o la cuota se agotó
		if (!res.ok) {
			console.error('[api/events] Ticketmaster error:', res.status);
			return NextResponse.json(
				{ error: 'Upstream error' },
				{ status: 502 },
			);
		}

		const data = await res.json();
		const events = data._embedded?.events ?? [];

		const seen = new Set<string>();
		const normalized = events
			.map((e: any) => ({
				id: e.id,
				name: e.name,
				date: e.dates?.start?.localDate ?? null,
				time: e.dates?.start?.localTime ?? null,
				venue: e._embedded?.venues?.[0]?.name ?? null,
				city: e._embedded?.venues?.[0]?.city?.name ?? null,
				distance: e.distance ?? null,
				url: e.url,
				image:
					e.images?.find(
						(i: any) => i.ratio === '16_9' && i.width > 500,
					)?.url ?? null,
				category: e.classifications?.[0]?.segment?.name ?? null,
			}))
			.filter((e: any) => {
				if (seen.has(e.name)) return false;
				seen.add(e.name);
				return true;
			});

		return NextResponse.json({
			events: normalized,
			total: data.page?.totalElements ?? 0,
			hasMore: data.page?.number + 1 < data.page?.totalPages,
			radiusUsed: radius,
		});
	} catch {
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}
