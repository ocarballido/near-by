'use client';
import { useEffect } from 'react';

export default function RecaptchaCleaner() {
	useEffect(() => {
		// Al montar no hacemos nada, pero al desmontar (cleanup):
		return () => {
			// Buscamos el nodo que Google inyecta fuera del árbol de React
			const badge = document.querySelector('.grecaptcha-badge');
			if (badge && badge.parentNode) {
				badge.parentNode.removeChild(badge);
			}
		};
	}, []);

	return null;
}
