import { NextRequest, NextResponse } from 'next/server';

const RADIUS_STEPS = [5, 15, 30, 50, 100];

const toTicketmasterDate = (date: Date) =>
	date.toISOString().split('.')[0] + 'Z';

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const lat = searchParams.get('lat');
	const lng = searchParams.get('lng');
	const manualRadius = searchParams.get('radius');
	const page = searchParams.get('page') ?? '0';

	if (!lat || !lng) {
		return NextResponse.json(
			{ error: 'lat and lng are required' },
			{ status: 400 },
		);
	}

	const radius = manualRadius ?? String(RADIUS_STEPS[0]);

	const today = new Date();
	const oneMonthLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

	const url = new URL(
		'https://app.ticketmaster.com/discovery/v2/events.json',
	);
	url.searchParams.set('apikey', process.env.TICKETMASTER_API_KEY!);
	url.searchParams.set('latlong', `${lat},${lng}`);
	url.searchParams.set('radius', radius);
	url.searchParams.set('unit', 'km');
	url.searchParams.set('size', '20');
	url.searchParams.set('page', page);
	url.searchParams.set('sort', 'date,asc');
	url.searchParams.set('startDateTime', toTicketmasterDate(today));
	url.searchParams.set('endDateTime', toTicketmasterDate(oneMonthLater));

	try {
		const res = await fetch(url.toString(), {
			next: { revalidate: 3600 },
		});

		if (!res.ok) {
			return NextResponse.json(
				{ error: 'Ticketmaster error' },
				{ status: res.status },
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
			radiusUsed: Number(radius),
		});
	} catch {
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}
