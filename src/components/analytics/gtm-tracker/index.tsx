'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function GtmTracker() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const isFirst = useRef(true);

	useEffect(() => {
		// Evita duplicar el page_view inicial (ya lo manda la Google tag en GTM)
		if (isFirst.current) {
			isFirst.current = false;
			return;
		}

		const qs = searchParams.toString();
		const url = qs ? `${pathname}?${qs}` : pathname;

		const w = window as any;
		w.dataLayer = w.dataLayer || [];
		w.dataLayer.push({
			event: 'page_view',
			page_path: url,
		});
	}, [pathname, searchParams]);

	return null;
}
