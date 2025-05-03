export const sidebarUrlMapped = (url: string, locale: string) => {
	switch (true) {
		case url === `/${locale}/app/profile`:
		case url === `/${locale}/app/subscription`:
			return {
				withSidebar: true,
				menu: 'PROFILE_SUBSCRIPTION_SIDEBAR_MENU',
			};
		case url.includes(`/${locale}/app/properties/`) &&
			url !== `/${locale}/app/properties/new`:
			return {
				withSidebar: true,
				menu: 'PROPERTY_SIDEBAR_MENU',
			};
	}

	return {
		withSidebar: false,
		menu: '',
	};
};

export const sidebarMenuMapped = () => {};
