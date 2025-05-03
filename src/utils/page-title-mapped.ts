export const pageTitleMapped = (url: string, locale: string) => {
	switch (true) {
		case url === `/${locale}/`:
			return {
				showTitle: true,
				title: 'Home',
			};
		case url === `/${locale}/login`:
			return {
				showTitle: false,
				title: '',
			};
		case url === `/${locale}/register`:
			return {
				showTitle: false,
				title: '',
			};
		case url === `/${locale}/app`:
			return {
				showTitle: true,
				title: 'Dashboard',
			};
		case url === `/${locale}/app/properties/new`:
			return {
				showTitle: true,
				title: 'Nueva propiedad',
			};
		case url === `/${locale}/app/properties`:
			return {
				showTitle: true,
				title: 'Mis propiedades',
			};
		case url === `/${locale}/app/profile`:
			return {
				showTitle: true,
				title: 'Mi perfil',
			};
		case url === `/${locale}/app/subscription`:
			return {
				showTitle: true,
				title: 'Mi suscripción',
			};
	}

	return {
		showTitle: false,
		title: '',
	};
};
