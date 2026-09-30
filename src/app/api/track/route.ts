import { NextRequest, NextResponse } from "next/server";
import { trackEvent, type EventName } from "@/lib/analytics/mixpanel";

// Only events emitted from the client via trackClientEvent.
// Server-only events (onboarding_start, create_property_completed,
// tenant_visit_public_page, property_deleted, time_window_widget_shown...)
// are tracked directly with trackEvent and must not be accepted here.
const ALLOWED_EVENTS: ReadonlySet<EventName> = new Set([
    "share_clicked",
    "wow_modal_dismissed",

    // ✅ Create property
    "create_property_address_selected",
    "create_property_submit_clicked",
    "create_property_blocked_no_address_selection",
    "create_property_failed",
    "create_property_abandoned",

    // ✅ Feedback
    "feedback_opened",
    "feedback_submitted",
    "feedback_cancelled",
    "feedback_submit_failed",

    // ✅ Itinerary
    "itinerary_generate_clicked",

    // ✅ Time window widget
    "time_window_pill_clicked",
    "time_window_directions_clicked",
]);

function isEventName(v: unknown): v is EventName {
    return typeof v === "string" && (ALLOWED_EVENTS as Set<string>).has(v);
}

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as {
            event?: unknown;
            distinctId?: unknown;
            props?: unknown;
        };

        if (!isEventName(body.event) || typeof body.distinctId !== "string") {
            return NextResponse.json(
                { ok: false, error: "Invalid payload" },
                { status: 400 },
            );
        }

        const props =
            body.props &&
            typeof body.props === "object" &&
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
