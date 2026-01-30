'use client';

type TrackClientInput = {
	event: string;
	distinctId: string;
	props?: Record<string, unknown>;
};

export async function trackClientEvent(input: TrackClientInput) {
	try {
		await fetch('/api/track', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(input),
			keepalive: true, // importante para abandon/unmount
		});
	} catch {
		// never break UX
	}
}
