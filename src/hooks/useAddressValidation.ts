'use client';

import { useState, useCallback } from 'react';

export type GeoResult = {
	formatted: string;
	lat: number;
	lng: number;
};

interface Params {
	getRawAddress: () => string;
	setFormattedAddress: (formatted: string) => void;
	setFieldError: (message: string) => void;
	clearFieldError: () => void;
}

export function useAddressValidation({
	getRawAddress,
	setFormattedAddress,
	setFieldError,
	clearFieldError,
}: Params) {
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [coords, setCoords] = useState<GeoResult | null>(null);

	const validate = useCallback(async () => {
		clearFieldError();
		setErrorMessage(null);

		const raw = getRawAddress().trim();
		if (!raw) {
			const msg = 'La dirección es obligatoria';
			setFieldError(msg);
			setErrorMessage(msg);
			return;
		}

		setLoading(true);
		try {
			const url = new URL('/api/geocode', window.location.origin);
			url.searchParams.set('address', raw);
			const res = await fetch(url.toString());

			if (!res.ok) {
				const body = (await res.json().catch(() => ({}))) as {
					error?: string;
				};
				const msg = body.error || 'Error validando dirección';
				setFieldError(msg);
				setErrorMessage(msg);
				return;
			}

			const geo = (await res.json()) as GeoResult;
			setCoords(geo);
			setFormattedAddress(geo.formatted);
			clearFieldError();
			setErrorMessage(null);
		} catch {
			const msg = 'Error validando dirección';
			setFieldError(msg);
			setErrorMessage(msg);
		} finally {
			setLoading(false);
		}
	}, [getRawAddress, setFormattedAddress, setFieldError, clearFieldError]);

	const clear = useCallback(() => {
		clearFieldError();
		setErrorMessage(null);
		setCoords(null);
	}, [clearFieldError]);

	return { validate, loading, error: errorMessage, coords, clear };
}
