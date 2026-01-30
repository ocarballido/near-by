'use client';

let readyPromise: Promise<void> | null = null;

export function waitForGoogleMapsReady(timeoutMs = 10000): Promise<void> {
	if (window.google?.maps) return Promise.resolve();

	if (readyPromise) return readyPromise;

	readyPromise = new Promise<void>((resolve, reject) => {
		const start = Date.now();
		const tick = () => {
			if (window.google?.maps) return resolve();
			if (Date.now() - start > timeoutMs) {
				return reject(
					new Error('Timed out waiting for Google Maps JS API'),
				);
			}
			window.setTimeout(tick, 50);
		};
		tick();
	});

	return readyPromise;
}
