import { NextRequest, NextResponse } from 'next/server';
import { trackEvent, type EventName } from '@/lib/analytics/mixpanel';

const ALLOWED_EVENTS: ReadonlySet<EventName> = new Set([
	'onboarding_start',
	'create_property_completed',
	'tenant_visit_public_page',
	'create_property_started',
	'property_progress_updated',
	'share_clicked',
	'property_deleted',
	'create_property_failed',
	'create_property_abandoned',

	// ✅ Feedback
	'feedback_opened',
	'feedback_submitted',
	'feedback_cancelled',
	'feedback_submit_failed',
	// (si más adelante quieres)
	// 'feedback_abandoned',
]);

function isEventName(v: unknown): v is EventName {
	return typeof v === 'string' && (ALLOWED_EVENTS as Set<string>).has(v);
}

export async function POST(req: NextRequest) {
	try {
		const body = (await req.json()) as {
			event?: unknown;
			distinctId?: unknown;
			props?: unknown;
		};

		if (!isEventName(body.event) || typeof body.distinctId !== 'string') {
			return NextResponse.json(
				{ ok: false, error: 'Invalid payload' },
				{ status: 400 },
			);
		}

		const props =
			body.props &&
			typeof body.props === 'object' &&
			!Array.isArray(body.props)
				? (body.props as Record<string, unknown>)
				: {};

		await trackEvent({
			event: body.event,
			distinctId: body.distinctId,
			props,
		});

		return NextResponse.json({ ok: true });
	} catch {
		// analytics must never break UX
		return NextResponse.json({ ok: true });
	}
}
