'use server';

import { headers } from 'next/headers';

type EventName =
	| 'onboarding_start'
	| 'create_property_completed'
	| 'tenant_visit_public_page'
	| 'create_property_started'
	| 'property_progress_updated'
	| 'share_clicked';

type TrackInput = {
	event: EventName;
	distinctId: string; // propietario: supabase user.id | inquilino: anon id
	props?: Record<string, unknown>;
};

export async function trackEvent({
	event,
	distinctId,
	props = {},
}: TrackInput) {
	try {
		const token = process.env.MIXPANEL_TOKEN;
		const endpoint =
			process.env.MIXPANEL_TRACK_URL ??
			'https://api.mixpanel.com/track?verbose=1';
		if (!token) return;

		const h = await headers();
		const userAgent = h.get('user-agent') ?? '';
		const referer = h.get('referer') ?? '';

		const payload = [
			{
				event,
				properties: {
					token,
					distinct_id: distinctId,
					...props,
					user_agent: userAgent,
					referer,
				},
			},
		];

		const data = Buffer.from(JSON.stringify(payload)).toString('base64');

		await fetch(endpoint, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({ data }),
		});
	} catch {
		// nunca romper el flujo por analytics
	}
}
