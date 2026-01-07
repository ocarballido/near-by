'use client';

import { useLocale } from 'next-intl';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function EditorModalStorageCleaner() {
	const pathname = usePathname();
	const locale = useLocale();
	const prev = useRef<string | null>(null);

	const editorPrefix = `/${locale}/app/properties/`; // editor catch-all
	const listPath = `/${locale}/app/properties`; // listado

	useEffect(() => {
		const prevPath = prev.current;

		// primera carga
		if (prevPath === null) {
			prev.current = pathname;
			return;
		}

		const wasInEditor = prevPath.startsWith(editorPrefix);
		const isInEditor = pathname.startsWith(editorPrefix);

		// 👇 Salgo del editor si antes estaba dentro y ahora no lo estoy
		// incluye ir al listado /app/properties
		const leftEditor = wasInEditor && !isInEditor;

		if (leftEditor || pathname === listPath) {
			// Borra SOLO lo relacionado con el modal del editor
			const prefix = 'editor:autoPlacesModalDismissed:';
			for (let i = sessionStorage.length - 1; i >= 0; i--) {
				const key = sessionStorage.key(i);
				if (key && key.startsWith(prefix)) {
					sessionStorage.removeItem(key);
				}
			}
		}

		prev.current = pathname;
	}, [pathname, editorPrefix, listPath]);

	return null;
}
