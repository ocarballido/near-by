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
			{
				label: 'Inteligencia artificial',
				value: 'NO',
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
			{
				label: 'Inteligencia artificial',
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
export const FIRST_CATEGORY_ID = '4581a08a-3e78-4800-b16c-575f5da81cba';
export const FIRST_CATEGORY_SUBCATEGORY_ID =
	'4fc3c0a8-3bb5-4b3b-8de3-6230a07df8a7';

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

export const MAGIC_FINDER_SELECT = [
	{ label: 'Hospitales', value: 'hospital' },
	{ label: 'Farmacias', value: 'pharmacy' },
	{ label: 'Cuidado dental', value: 'dentist' },
	{ label: 'Masajes y Spa', value: 'spa' },
	{ label: 'Gimnasios', value: 'gym' },
	{ label: 'Restaurantes', value: 'restaurant' },
	{ label: 'Cafeterías', value: 'cafe' },
	{ label: 'Panaderías', value: 'bakery' },
	{ label: 'Comida rápida', value: 'meal_takeaway' },
	{ label: 'Bares', value: 'bar' },
	{ label: 'Museos', value: 'museum' },
	{ label: 'Galerías de arte', value: 'art_gallery' },
	{ label: 'Sitios históricos', value: 'tourist_attraction' },
	{ label: 'Bibliotecas', value: 'library' },
	{ label: 'Zoológicos y Acuarios', value: 'zoo' },
	{ label: 'Supermercados', value: 'supermarket' },
	{ label: 'Mercados de agricultores', value: 'grocery_or_supermarket' },
	{ label: 'Centros comerciales', value: 'shopping_mall' },
	{ label: 'Boutiques', value: 'clothing_store' },
	{ label: 'Mercadillos', value: 'store' },
	{ label: 'Bancos', value: 'bank' },
	{ label: 'Oficinas de correos', value: 'post_office' },
	{ label: 'Lavanderías', value: 'laundry' },
	{ label: 'Peluquerías y Barberías', value: 'hair_care' },
	{ label: 'Paradas de autobús', value: 'bus_station' },
	{ label: 'Estaciones de metro', value: 'subway_station' },
	{ label: 'Estaciones de tren', value: 'train_station' },
	{ label: 'Alquiler de bicicletas', value: 'bicycle_store' },
	{ label: 'Terminales de ferry', value: 'transit_station' },
	{ label: 'Paradas de taxi', value: 'taxi_stand' },
	{ label: 'Discotecas', value: 'night_club' },
	{ label: 'Casinos', value: 'casino' },
	{ label: 'Cines', value: 'movie_theater' },
	{ label: 'Boleras', value: 'bowling_alley' },
	{ label: 'Arcades', value: 'amusement_center' },
	{ label: 'Miradores', value: 'point_of_interest' },
	{ label: 'Tours guiados', value: 'travel_agency' },
	{ label: 'Estaciones de policía', value: 'police' },
	{ label: 'Estaciones de bomberos', value: 'fire_station' },
	{ label: 'Embajadas', value: 'embassy' },
	{ label: 'Parques', value: 'park' },
	{ label: 'Tiendas de mascotas', value: 'pet_store' },
	{ label: 'Veterinarios', value: 'veterinary_care' },
];

export const MAX_MAGIC_FINDER_LOCATIONS = 10;

export const RADIUS_OPTIONS = [
	{ value: '1000', label: '1 km' },
	{ value: '2000', label: '2 km' },
	{ value: '3000', label: '3 km' },
	{ value: '4000', label: '4 km' },
	{ value: '5000', label: '5 km' },
];

export const DAILY_AI_USAGE_LIMMIT = 20;

export const BASIC_DATASET = [
	{
		nombre: 'Nomad Coffee',
		tipo: 'café',
		lat: 41.3851,
		lng: 2.1734,
		descripcion: 'Café de especialidad con ambiente moderno',
		duracion_aprox: 30,
	},
	{
		nombre: 'Museo Picasso',
		tipo: 'museo',
		lat: 41.3859,
		lng: 2.1801,
		descripcion: 'Obras de juventud del famoso pintor',
		duracion_aprox: 60,
	},
	{
		nombre: 'Parque de la Ciutadella',
		tipo: 'parque',
		lat: 41.3881,
		lng: 2.1903,
		descripcion: 'Parque urbano con estanque y esculturas',
		duracion_aprox: 45,
	},
	{
		nombre: 'Can Solé',
		tipo: 'restaurante',
		lat: 41.3782,
		lng: 2.1912,
		descripcion: 'Restaurante histórico de paella',
		duracion_aprox: 90,
	},
	{
		nombre: 'Free Walking Tour - Barrio Gótico',
		tipo: 'tour',
		lat: 41.3839,
		lng: 2.1761,
		descripcion: 'Tour gratuito por el corazón medieval de la ciudad',
		duracion_aprox: 120,
		hora_inicio: '16:00',
	},
	{
		nombre: 'Bunkers del Carmel',
		tipo: 'mirador',
		lat: 41.4181,
		lng: 2.1576,
		descripcion: 'Mirador con vistas panorámicas de Barcelona',
		duracion_aprox: 60,
	},
];
