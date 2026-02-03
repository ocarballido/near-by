'use server';

import { headers } from 'next/headers';

export type EventName =
	| 'onboarding_start'
	| 'create_property_completed'
	| 'tenant_visit_public_page'
	| 'create_property_started'
	| 'property_progress_updated'
	| 'share_clicked'
	| 'property_deleted'
	| 'create_property_failed'
	| 'create_property_abandoned'
	| 'feedback_opened'
	| 'feedback_submitted'
	| 'feedback_cancelled'
	| 'feedback_submit_failed';

type TrackInput = {
	event: EventName;
	distinctId: string; // propietario: supabase user.id | inquilino: anon id
	props?: Record<string, unknown>;
};

function extractClientIpFromForwardedHeader(
	forwardedForHeader: string,
): string | null {
	const clientIp = forwardedForHeader.split(',')[0]?.trim();
	if (!clientIp) return null;
	if (clientIp.toLowerCase() === 'unknown') return null;
	return clientIp;
}

function normalizeCountryCode(rawCountryCode: string | null): string | null {
	if (!rawCountryCode) return null;

	const trimmed = rawCountryCode.trim();
	if (!trimmed) return null;

	return trimmed.length === 2 ? trimmed.toUpperCase() : trimmed;
}

function isMixpanelEnabled(): boolean {
	return process.env.MIXPANEL_ENABLED === 'true';
}

export async function trackEvent({
	event,
	distinctId,
	props = {},
}: TrackInput) {
	try {
		if (!isMixpanelEnabled()) return;

		const mixpanelToken = process.env.MIXPANEL_TOKEN;
		if (!mixpanelToken) return;

		const trackEndpoint =
			process.env.MIXPANEL_TRACK_URL ??
			'https://api.mixpanel.com/track?verbose=1';

		const requestHeaders = await headers();

		// ── Basic request context
		const userAgent = requestHeaders.get('user-agent') ?? '';
		const referer = requestHeaders.get('referer') ?? '';

		// ── Country (edge/CDN provided)
		const userCountry =
			normalizeCountryCode(requestHeaders.get('x-vercel-ip-country')) ??
			normalizeCountryCode(requestHeaders.get('cf-ipcountry')) ??
			normalizeCountryCode(requestHeaders.get('x-country')) ??
			normalizeCountryCode(requestHeaders.get('x-geo-country'));

		// ── Client IP (best-effort, for Mixpanel geo enrichment)
		const forwardedFor = requestHeaders.get('x-forwarded-for');
		const clientIp = forwardedFor
			? extractClientIpFromForwardedHeader(forwardedFor)
			: null;

		const eventPayload = [
			{
				event,
				properties: {
					token: mixpanelToken,
					distinct_id: distinctId,

					...(clientIp ? { ip: clientIp } : {}),
					...(userCountry ? { user_country: userCountry } : {}),

					...props,
					user_agent: userAgent,
					referer,
				},
			},
		];

		const encodedPayload = Buffer.from(
			JSON.stringify(eventPayload),
		).toString('base64');

		await fetch(trackEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({ data: encodedPayload }),
		});
	} catch {
		// Analytics must never break the main flow
	}
}
