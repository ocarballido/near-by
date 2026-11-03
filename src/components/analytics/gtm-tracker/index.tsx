'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import { SAVED_PLACES_SEARCH_PARAM } from '@/utils/saved-places';

// page_view de las navegaciones dentro de la app. El de la carga completa lo
// manda la Google tag de GTM con la URL entera (también ?saved=): eso lo
// cubre la redacción del parámetro saved en GA4, no este componente
export function GtmTracker() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	// Última ruta ya filtrada; null hasta la primera ejecución
	const lastUrl = useRef<string | null>(null);

	useEffect(() => {
		// El enlace compartido de guardados lleva en ?saved= los ids del
		// huésped: aquí no se mandan. Se quita de la URL al cargar la página,
		// pero se queda en ella sin cookies o si no se ha podido validar
		const params = new URLSearchParams(searchParams.toString());
		params.delete(SAVED_PLACES_SEARCH_PARAM);
		const qs = params.toString();
		const url = qs ? `${pathname}?${qs}` : pathname;

		// La primera vez solo se apunta: ese page_view ya lo manda la Google
		// tag. Tampoco se repite si solo ha cambiado ?saved= (al quitarlo de
		// la URL, el router lo notifica)
		const previous = lastUrl.current;
		lastUrl.current = url;
		if (previous === null || previous === url) return;

		const w = window as any;
		w.dataLayer = w.dataLayer || [];
		w.dataLayer.push({
			event: 'page_view',
			page_path: url,
		});
	}, [pathname, searchParams]);

	return null;
}
