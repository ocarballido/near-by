'use client';

import { useEffect, useState } from 'react';

export default function CookieBanner() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const accepted = localStorage.getItem('cookie-accepted');
		if (!accepted) setVisible(true);
	}, []);

	const acceptCookies = () => {
		localStorage.setItem('cookie-accepted', 'true');
		setVisible(false);
	};

	if (!visible) return null;

	return (
		<div className="fixed bottom-2 left-2 right-2 rounded-md bg-gray-900 text-white text-sm p-4 z-50">
			<div className="max-w-4xl mx-auto flex justify-between items-center">
				<p>
					Este sitio utiliza cookies para mejorar la experiencia de
					usuario. Al continuar, aceptas el uso de cookies.
				</p>
				<button
					onClick={acceptCookies}
					className="bg-white text-gray-900 px-4 py-1 rounded ml-4 hover:bg-gray-100"
				>
					Aceptar
				</button>
			</div>
		</div>
	);
}
