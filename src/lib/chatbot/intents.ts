import { CATEGORIES_SUB_CATEGORIES as CSC } from '@/config/config-constants';

export type IntentType =
	| 'WIFI'
	| 'SCHEDULE'
	| 'RULES'
	| 'RECYCLE'
	| 'MANUAL'
	| 'RESTAURANTS'
	| 'CAFES'
	| 'BARS'
	| 'SUPERMARKETS'
	| 'PHARMACIES'
	| 'EMERGENCY'
	| 'HOSPITALS'
	| 'TRANSPORT'
	| 'PARKS'
	| 'MUSEUMS';

export type IntentKind = 'info' | 'location';

export interface Intent {
	kind: IntentKind;
	subCategoryId: string;
	keywords: string[];
}

export const INTENTS: Record<IntentType, Intent> = {
	WIFI: {
		kind: 'info',
		subCategoryId: CSC.LODGING.SUB_CATEGORIES.WIFI.id,
		keywords: [
			// ES
			'wifi',
			'contrasena',
			'internet',
			'password',
			'clave',
			'red',
			// EN
			'wi-fi',
			'wireless',
			'network',
			'connect',
			// FR
			'mot de passe',
			'connexion',
			'reseau',
		],
	},
	SCHEDULE: {
		kind: 'info',
		subCategoryId: CSC.LODGING.SUB_CATEGORIES.SCHEDULE.id,
		keywords: [
			// ES
			'checkin',
			'checkout',
			'check in',
			'check out',
			'entrada',
			'salida',
			'llegada',
			'horario',
			'hora',
			// EN
			'check-in',
			'check-out',
			'arrival',
			'departure',
			'schedule',
			'time',
			// FR
			'arrivee',
			'depart',
			'heure',
			'horaire',
		],
	},
	RULES: {
		kind: 'info',
		subCategoryId: CSC.LODGING.SUB_CATEGORIES.RULES.id,
		keywords: [
			// ES
			'normas',
			'reglas',
			'prohibido',
			'mascotas',
			'fumar',
			'ruido',
			'silencio',
			// EN
			'rules',
			'policy',
			'policies',
			'pets',
			'smoking',
			'noise',
			'allowed',
			// FR
			'regles',
			'reglement',
			'animaux',
			'fumer',
			'bruit',
			'interdit',
		],
	},
	RECYCLE: {
		kind: 'info',
		subCategoryId: CSC.LODGING.SUB_CATEGORIES.RECYCLE.id,
		keywords: [
			// ES
			'basura',
			'reciclaje',
			'residuos',
			'contenedor',
			'reciclar',
			// EN
			'trash',
			'garbage',
			'recycling',
			'waste',
			'bin',
			'rubbish',
			// FR
			'poubelle',
			'recyclage',
			'dechets',
			'ordures',
		],
	},
	MANUAL: {
		kind: 'info',
		subCategoryId: CSC.LODGING.SUB_CATEGORIES.MANUAL.id,
		keywords: [
			// ES
			'manual',
			'instrucciones',
			'calefaccion',
			'aire',
			'lavadora',
			'electrodomestico',
			'llave',
			'acceso',
			// EN
			'instructions',
			'heating',
			'air conditioning',
			'appliance',
			'key',
			'access',
			'guide',
			// FR
			'instructions',
			'chauffage',
			'climatisation',
			'cle',
			'acces',
			'appareil',
		],
	},
	RESTAURANTS: {
		kind: 'location',
		subCategoryId: CSC.FOOD_AND_DRINK.SUB_CATEGORIES.RESTAURANTS.id,
		keywords: [
			// ES
			'restaurante',
			'restaurantes',
			'comer',
			'cenar',
			'cena',
			'comida',
			// EN
			'restaurant',
			'restaurants',
			'eat',
			'dinner',
			'lunch',
			'dine',
			'food',
			// FR
			'restaurant',
			'restaurants',
			'manger',
			'diner',
			'dejeuner',
			'repas',
		],
	},
	CAFES: {
		kind: 'location',
		subCategoryId: CSC.FOOD_AND_DRINK.SUB_CATEGORIES.CAFES.id,
		keywords: [
			// ES
			'cafe',
			'cafeteria',
			'cafeterias',
			'desayuno',
			'brunch',
			// EN
			'cafe',
			'coffee',
			'cafeteria',
			'breakfast',
			'brunch',
			// FR
			'cafe',
			'cafeteria',
			'petit dejeuner',
			'brunch',
		],
	},
	BARS: {
		kind: 'location',
		subCategoryId: CSC.FOOD_AND_DRINK.SUB_CATEGORIES.BARS.id,
		keywords: [
			// ES
			'bar',
			'bares',
			'copas',
			'tomar algo',
			'cerveza',
			// EN
			'bar',
			'bars',
			'drinks',
			'beer',
			'pub',
			'pubs',
			// FR
			'bar',
			'bars',
			'biere',
			'verre',
			'boisson',
		],
	},
	SUPERMARKETS: {
		kind: 'location',
		subCategoryId: CSC.SHOPPING.SUB_CATEGORIES.SUPERMARKETS.id,
		keywords: [
			// ES
			'supermercado',
			'mercado',
			'compra',
			'alimentacion',
			'tienda',
			// EN
			'supermarket',
			'grocery',
			'groceries',
			'shop',
			'store',
			'market',
			// FR
			'supermarche',
			'epicerie',
			'courses',
			'magasin',
			'marche',
		],
	},
	PHARMACIES: {
		kind: 'location',
		subCategoryId: CSC.HEALTH_AND_WELLNESS.SUB_CATEGORIES.PHARMACIES.id,
		keywords: [
			// ES
			'farmacia',
			'farmacias',
			'medicamento',
			'pastillas',
			// EN
			'pharmacy',
			'pharmacies',
			'drugstore',
			'medicine',
			'chemist',
			// FR
			'pharmacie',
			'pharmacies',
			'medicament',
			'remede',
		],
	},
	EMERGENCY: {
		kind: 'location',
		subCategoryId: CSC.HEALTH_AND_WELLNESS.SUB_CATEGORIES.EMERGENCY.id,
		keywords: [
			// ES
			'urgencias',
			'urgencia',
			'emergencia',
			'accidente',
			'medico',
			// EN
			'emergency',
			'urgent',
			'accident',
			'doctor',
			'ambulance',
			// FR
			'urgence',
			'urgences',
			'accident',
			'medecin',
			'ambulance',
		],
	},
	HOSPITALS: {
		kind: 'location',
		subCategoryId: CSC.HEALTH_AND_WELLNESS.SUB_CATEGORIES.HOSPITALS.id,
		keywords: [
			// ES
			'hospital',
			'hospitales',
			'clinica',
			// EN
			'hospital',
			'hospitals',
			'clinic',
			'medical center',
			// FR
			'hopital',
			'hopitaux',
			'clinique',
		],
	},
	TRANSPORT: {
		kind: 'location',
		subCategoryId: CSC.TRANSPORTATION.SUB_CATEGORIES.BUS_STOPS.id,
		keywords: [
			// ES
			'bus',
			'autobus',
			'metro',
			'tren',
			'taxi',
			'transporte',
			'parada',
			// EN
			'bus',
			'subway',
			'metro',
			'train',
			'taxi',
			'transport',
			'stop',
			'station',
			// FR
			'bus',
			'metro',
			'train',
			'taxi',
			'transport',
			'arret',
			'gare',
		],
	},
	PARKS: {
		kind: 'location',
		subCategoryId: CSC.PARKS_AND_NATURE.SUB_CATEGORIES.URBAN_PARKS.id,
		keywords: [
			// ES
			'parque',
			'parques',
			'naturaleza',
			'jardin',
			'verde',
			// EN
			'park',
			'parks',
			'nature',
			'garden',
			'green',
			// FR
			'parc',
			'parcs',
			'nature',
			'jardin',
		],
	},
	MUSEUMS: {
		kind: 'location',
		subCategoryId: CSC.ARTS_AND_CULTURE.SUB_CATEGORIES.MUSEUMS.id,
		keywords: [
			// ES
			'museo',
			'museos',
			'arte',
			'cultura',
			'galeria',
			// EN
			'museum',
			'museums',
			'art',
			'culture',
			'gallery',
			// FR
			'musee',
			'musees',
			'art',
			'culture',
			'galerie',
		],
	},
};
