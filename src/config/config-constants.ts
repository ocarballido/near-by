import { SidebarMenuItemConfig } from '@/lib/types';

export const LOCALES = ['es', 'en'];

export const DEFAULT_LOCALE = 'en';

export const PAGES = {
	home: '/',
	login: '/login',
	register: '/register',
	logout: '/logout',
	dashboard: '/app',
	newProperty: '/app/properties/new',
	properties: '/app/properties',
	property: '/app/properties/[id]',
	profile: '/app/profile',
	subscription: '/app/subscription',
	publicProperty: '/public/[slug]',
};

export const USER_MENU_OPTIONS = [
	{
		label: 'Mi Perfil',
		url: PAGES.profile,
		icon: 'IconAccountCircle',
	},
	{
		label: 'Mi Suscripción',
		url: PAGES.subscription,
		icon: 'IconNewRelease',
	},
];

export const PRIVATE_MENU_OPTIONS = [
	{
		label: 'Dashboard',
		url: PAGES.dashboard,
		icon: 'IconHome',
	},
	{
		label: 'Mis Propiedades',
		url: PAGES.properties,
		icon: 'IconApartment',
	},
	{
		label: 'Nueva Propiedad',
		url: PAGES.newProperty,
		icon: 'IconAdd',
	},
	{
		label: 'Web Pública',
		url: PAGES.home,
		icon: 'IconLanguage',
	},
];

export const SIDEBAR_MENU: SidebarMenuItemConfig[] = [
	{
		label: 'Dashboard',
		url: PAGES.dashboard,
		icon: 'IconHome',
	},
	{
		label: 'Mis Propiedades',
		url: PAGES.properties,
		icon: 'IconApartment',
	},
	{
		label: 'Nueva Propiedad',
		url: PAGES.newProperty,
		icon: 'IconAdd',
	},
	// {
	// 	label: 'Mi perfil',
	// 	url: PAGES.profile,
	// 	icon: 'IconAccountCircle',
	// },
	{
		label: 'Mi suscripción',
		url: PAGES.subscription,
		icon: 'IconNewRelease',
	},
	{
		label: 'Web Pública',
		url: PAGES.home,
		icon: 'IconLanguage',
	},
];

export const PROPERTY_SIDEBAR_MENU = [
	{
		label: 'El Alojamiento',
		url: null,
		icon: 'IconApartment',
	},
	{
		label: 'Salud y Bienestar',
		url: null,
		icon: 'IconHealing',
	},
	{
		label: 'Comida y Bebida',
		url: null,
		icon: 'IconForkSpoon',
	},
	{
		label: 'Arte y Cultura',
		url: null,
		icon: 'IconMuseum',
	},
	{
		label: 'Parques y Naturaleza',
		url: null,
		icon: 'IconNature',
	},
	{
		label: 'Compras',
		url: null,
		icon: 'IconShoppingBag',
	},
	{
		label: 'Servicios',
		url: null,
		icon: 'IconLocalAtm',
	},
	{
		label: 'Transporte',
		url: null,
		icon: 'IconTrain',
	},
	{
		label: 'Entretenimiento y Vida Nocturna',
		url: null,
		icon: 'IconNightLife',
	},
	{
		label: 'Atracciones y Turismo',
		url: null,
		icon: 'IconComedyMask',
	},
	{
		label: 'Seguridad y Emergencias',
		url: null,
		icon: 'IconEmergency',
	},
	{
		label: 'Familia y Niños',
		url: null,
		icon: 'IconFamilyRestroom',
	},
	{
		label: 'Mascotas',
		url: null,
		icon: 'IconPets',
	},
	{
		label: 'Otros',
		url: null,
		icon: 'IconInterests',
	},
];

export const SIDEBAR_MENUS = {
	SIDEBAR_MENU,
	PROPERTY_SIDEBAR_MENU,
} as const;

export const SUBSCRIPTION_FEATURES = {
	FREE: {
		price: 0,
		features: [
			{
				label: 'Cantidad de propiedades',
				value: '1',
			},
			{
				label: 'Grupos por categoría',
				value: '10',
			},
			{
				label: 'Categorías predefinidas',
				value: 'SI',
			},
			{
				label: 'Enlace de navagacion',
				value: 'SI',
			},
			{
				label: 'Enlace público personalizado',
				value: 'SI',
			},
			{
				label: 'Visualización en mapa',
				value: 'SI',
			},
			// {
			// 	label: 'Mostrar logo',
			// 	value: 'NO',
			// },
			{
				label: 'Mostrar imágenes',
				value: 'NO',
			},
			// {
			// 	label: 'Soporte por email',
			// 	value: 'NO',
			// },
		],
	},
	PREMIUM: {
		price: 9.99,
		features: [
			{
				label: 'Cantidad de propiedades',
				value: 'Ilimitadas',
			},
			{
				label: 'Grupos por categoría',
				value: 'Ilimitadas',
			},
			{
				label: 'Categorías predefinidas',
				value: 'SI',
			},
			{
				label: 'Enlace de navagacion',
				value: 'SI',
			},
			{
				label: 'Enlace público personalizado',
				value: 'SI',
			},
			{
				label: 'Visualización en mapa',
				value: 'SI',
			},
			// {
			// 	label: 'Mostrar logo',
			// 	value: 'SI',
			// },
			{
				label: 'Mostrar imágenes',
				value: 'SI',
			},
			// {
			// 	label: 'Soporte por email',
			// 	value: 'Prioritario (24 h)',
			// },
		],
	},
} as const;

export const MAX_IMAGE_SIZE = 500 * 1024; // 500 KB

export const LODGING_CATEGORY_ID = '4581a08a-3e78-4800-b16c-575f5da81cba';

export const GOOGLE_MAPS_DIRECTION_URL =
	'https://www.google.com/maps/dir/?api=1&destination=';

export const LANDING_APPBAR_MENU = [
	{
		label: 'Cómo funciona',
		url: '/#how',
	},
	{
		label: 'Funciones',
		url: '/#functions',
	},
	{
		label: 'Beneficios',
		url: '/#benefits',
	},
	{
		label: 'Opiniones',
		url: '/#oppinios',
	},
];

export const TIPS = [
	{
		id: 1,
		title: 'Piensa como tu huésped',
		subtitle: '¿Es su primera vez en la ciudad?',
	},
	{
		id: 2,
		title: 'Recomienda tus favoritos',
		subtitle: 'No hagas una lista genérica',
	},
	{
		id: 3,
		title: 'Piensa en lo práctico también',
		subtitle: 'No todo es turismo',
	},
	{
		id: 4,
		title: 'Prioriza calidad sobre cantidad',
		subtitle:
			'Mejor 5 recomendaciones bien explicadas, que 20 lugares que no aportan valor',
	},
	{
		id: 5,
		title: 'Agrega fotos si puedes',
		subtitle:
			'Una imagen del lugar o del plato estrella puede marcar la diferencia',
	},
	{
		id: 6,
		title: 'Actualiza cada tanto',
		subtitle: 'Los locales cambian',
	},
];
