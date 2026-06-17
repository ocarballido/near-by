import type { SidebarMenuItemConfig } from "@/types/sidebar";

export const LOCALES = ["es", "en", "fr"] as const;
export type Locale = (typeof LOCALES)[number]; // 'es' | 'en' | 'fr'

export const DEFAULT_LOCALE = "en";

export const PAGES = {
    home: "/",
    login: "/login",
    register: "/register",
    logout: "/logout",
    dashboard: "/app",
    newProperty: "/app/properties/new",
    properties: "/app/properties",
    property: "/app/properties/[id]",
    profile: "/app/profile",
    subscription: "/app/subscription",
    publicProperty: "/public/[slug]",
};

export const USER_MENU_OPTIONS = [
    {
        label: "Dashboard",
        url: PAGES.dashboard,
        icon: "IconHome",
    },
    {
        label: "Mis Propiedades",
        url: PAGES.properties,
        icon: "IconApartment",
    },
    {
        label: "Mi Perfil",
        url: PAGES.profile,
        icon: "IconAccountCircle",
    },
    {
        label: "Mi Suscripción",
        url: PAGES.subscription,
        icon: "IconNewRelease",
    },
    {
        label: "Web Pública",
        url: PAGES.home,
        icon: "IconLanguage",
    },
];

export const PRIVATE_MENU_OPTIONS = [
    {
        label: "Dashboard",
        url: PAGES.dashboard,
        icon: "IconHome",
    },
    {
        label: "Mis Propiedades",
        url: PAGES.properties,
        icon: "IconApartment",
    },
    {
        label: "Nueva Propiedad",
        url: PAGES.newProperty,
        icon: "IconAdd",
    },
    {
        label: "Web Pública",
        url: PAGES.home,
        icon: "IconLanguage",
    },
];

export const SIDEBAR_MENU: SidebarMenuItemConfig[] = [
    {
        label: "Dashboard",
        url: PAGES.dashboard,
        icon: "IconHome",
    },
    {
        label: "Mis Propiedades",
        url: PAGES.properties,
        icon: "IconApartment",
    },
    {
        label: "Nueva Propiedad",
        url: PAGES.newProperty,
        icon: "IconAdd",
    },
    // {
    // 	label: 'Mi perfil',
    // 	url: PAGES.profile,
    // 	icon: 'IconAccountCircle',
    // },
    {
        label: "Mi suscripción",
        url: PAGES.subscription,
        icon: "IconNewRelease",
    },
    {
        label: "Web Pública",
        url: PAGES.home,
        icon: "IconLanguage",
    },
];

export const PROPERTY_SIDEBAR_MENU = [
    {
        label: "El Alojamiento",
        url: null,
        icon: "IconApartment",
    },
    {
        label: "Salud y Bienestar",
        url: null,
        icon: "IconHealing",
    },
    {
        label: "Comida y Bebida",
        url: null,
        icon: "IconForkSpoon",
    },
    {
        label: "Arte y Cultura",
        url: null,
        icon: "IconMuseum",
    },
    {
        label: "Parques y Naturaleza",
        url: null,
        icon: "IconNature",
    },
    {
        label: "Compras",
        url: null,
        icon: "IconShoppingBag",
    },
    {
        label: "Servicios",
        url: null,
        icon: "IconLocalAtm",
    },
    {
        label: "Transporte",
        url: null,
        icon: "IconTrain",
    },
    {
        label: "Entretenimiento y Vida Nocturna",
        url: null,
        icon: "IconNightLife",
    },
    {
        label: "Atracciones y Turismo",
        url: null,
        icon: "IconComedyMask",
    },
    {
        label: "Seguridad y Emergencias",
        url: null,
        icon: "IconEmergency",
    },
    {
        label: "Familia y Niños",
        url: null,
        icon: "IconFamilyRestroom",
    },
    {
        label: "Mascotas",
        url: null,
        icon: "IconPets",
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
                label: "Cantidad de propiedades",
                value: "1",
            },
            {
                label: "Grupos por categoría",
                value: "10",
            },
            {
                label: "Categorías predefinidas",
                value: "SI",
            },
            {
                label: "Enlace de navagacion",
                value: "SI",
            },
            {
                label: "Enlace público personalizado",
                value: "SI",
            },
            {
                label: "Visualización en mapa",
                value: "SI",
            },
            {
                label: "Inteligencia artificial",
                value: "NO",
            },
            // {
            // 	label: 'Mostrar logo',
            // 	value: 'NO',
            // },
            {
                label: "Mostrar imágenes",
                value: "NO",
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
                label: "Cantidad de propiedades",
                value: "Ilimitadas",
            },
            {
                label: "Grupos por categoría",
                value: "Ilimitadas",
            },
            {
                label: "Categorías predefinidas",
                value: "SI",
            },
            {
                label: "Enlace de navagacion",
                value: "SI",
            },
            {
                label: "Enlace público personalizado",
                value: "SI",
            },
            {
                label: "Visualización en mapa",
                value: "SI",
            },
            {
                label: "Inteligencia artificial",
                value: "SI",
            },
            // {
            // 	label: 'Mostrar logo',
            // 	value: 'SI',
            // },
            {
                label: "Mostrar imágenes",
                value: "SI",
            },
            // {
            // 	label: 'Soporte por email',
            // 	value: 'Prioritario (24 h)',
            // },
        ],
    },
} as const;

export const MAX_IMAGE_SIZE = 500 * 1024; // 500 KB

export const LODGING_ID = "4581a08a-3e78-4800-b16c-575f5da81cba";
export const FIRST_CATEGORY_ID = "4581a08a-3e78-4800-b16c-575f5da81cba";
export const FIRST_CATEGORY_SUBCATEGORY_ID =
    "4fc3c0a8-3bb5-4b3b-8de3-6230a07df8a7";

export const CATEGORIES_SUB_CATEGORIES = {
    LODGING: {
        id: "4581a08a-3e78-4800-b16c-575f5da81cba",
        icon: "IconApartment",
        order_index: 1,
        type: "info",
        name: "El Alojamiento",
        SUB_CATEGORIES: {
            MANUAL: {
                id: "4fc3c0a8-3bb5-4b3b-8de3-6230a07df8a7",
                order_index: 1,
                type: "info",
                name: "Manual de alojamiento",
            },
            RULES: {
                id: "f6eb90a5-0543-49a2-8619-23912e9c1a33",
                order_index: 2,
                type: "info",
                name: "Normas de uso",
            },
            SCHEDULE: {
                id: "a1091bf8-4fe3-4ded-854b-fc08019d9296",
                order_index: 3,
                type: "info",
                name: "Horario",
            },
            RECYCLE: {
                id: "cd19040f-5160-49ac-b395-adab3ec2d919",
                order_index: 4,
                type: "info",
                name: "Reciclaje",
            },
            WIFI: {
                id: "0e04b6d5-72be-4f9b-9274-3526ff3f851a",
                order_index: 5,
                type: "info",
                name: "Wifi",
            },
            EXPLORE_DETAILS: {
                id: "e34d65fd-18a4-4fca-9522-5585593fe28d",
                order_index: 6,
                type: "info",
                name: "Explora los detalles",
            },
        },
    },

    HEALTH_AND_WELLNESS: {
        id: "56e286de-42ec-42f8-b538-a266387f5c7c",
        icon: "IconHealing",
        order_index: 2,
        type: "location",
        name: "Salud y Bienestar",
        SUB_CATEGORIES: {
            HOSPITALS: {
                id: "d86dd401-9a93-45e8-b4c2-47fa8f46398e",
                order_index: 1,
                type: "location",
                name: "Hospitales",
            },
            PHARMACIES: {
                id: "a1b814e3-f5f5-4669-84f9-dd06685a2867",
                order_index: 2,
                type: "location",
                name: "Farmacias",
            },
            EMERGENCY: {
                id: "9a39fc67-6908-49d7-ad7b-b03c4b4a17ec",
                order_index: 3,
                type: "location",
                name: "Urgencias",
            },
            DENTAL_CARE: {
                id: "b8c955ca-9c59-4e63-a4a8-d12721200a9b",
                order_index: 4,
                type: "location",
                name: "Cuidado dental",
            },
            MASSAGE_AND_SPA: {
                id: "c8b9fc21-434b-4bc3-b6b5-0543e3b6acfd",
                order_index: 5,
                type: "location",
                name: "Masajes y Spa",
            },
            PHYSIOTHERAPY: {
                id: "458a6ca7-1af3-4a64-8335-8c2c5dbaad9f",
                order_index: 6,
                type: "location",
                name: "Fisioterapia",
            },
            GYMS: {
                id: "042505e9-7485-41cb-9895-d3ccd2028ad7",
                order_index: 7,
                type: "location",
                name: "Gimnasios",
            },
            YOGA: {
                id: "13574fdb-f91c-440d-854a-ab037bded19f",
                order_index: 8,
                type: "location",
                name: "Yoga",
            },
            MENTAL_HEALTH: {
                id: "39b17b02-0b43-4490-9c5f-373b6f1c6eea",
                order_index: 9,
                type: "location",
                name: "Salud Mental",
            },
        },
    },

    FOOD_AND_DRINK: {
        id: "91125962-2260-4b09-a062-6aad5eff6101",
        icon: "IconForkSpoon",
        order_index: 3,
        type: "location",
        name: "Comida y Bebida",
        SUB_CATEGORIES: {
            RESTAURANTS: {
                id: "b9048ed1-ab96-4a10-b542-2f5ef4fb5e78",
                order_index: 1,
                type: "location",
                name: "Restaurantes",
            },
            CAFES: {
                id: "45d9b160-4619-4e99-a9eb-f0c86768eb6e",
                order_index: 2,
                type: "location",
                name: "Cafeterías",
            },
            BAKERIES: {
                id: "7d77f635-9897-4ab0-8801-c3939a7f366b",
                order_index: 3,
                type: "location",
                name: "Panaderías",
            },
            FAST_FOOD: {
                id: "915e4916-4726-4e95-950a-42057280a00c",
                order_index: 4,
                type: "location",
                name: "Comida rápida",
            },
            BARS: {
                id: "b7f98f6d-0f44-4702-8ead-138342382694",
                order_index: 5,
                type: "location",
                name: "Bares",
            },
            PUBS: {
                id: "339a71f4-265e-4792-8d2a-f027bf69784b",
                order_index: 6,
                type: "location",
                name: "Pubs",
            },
            BREWERIES: {
                id: "eebdb669-57f0-4039-b6a9-b5b2e4158a5f",
                order_index: 7,
                type: "location",
                name: "Cervecerías",
            },
            WINE_BARS: {
                id: "f5fc055e-5d6e-451e-bede-4e0db4ec74eb",
                order_index: 8,
                type: "location",
                name: "Bares de Vinos",
            },
            FOOD_TRUCKS: {
                id: "a66d2683-ced1-49ba-b60b-ee7befa6bf1f",
                order_index: 9,
                type: "location",
                name: "Camiones de comida",
            },
        },
    },

    ARTS_AND_CULTURE: {
        id: "f3262d3d-5bfb-4dc3-91c7-33afc885fd3e",
        icon: "IconMuseum",
        order_index: 4,
        type: "location",
        name: "Arte y Cultura",
        SUB_CATEGORIES: {
            MUSEUMS: {
                id: "370681cd-d2fa-4b2c-9224-0eb796eb25ba",
                order_index: 1,
                type: "location",
                name: "Museos",
            },
            ART_GALLERIES: {
                id: "5a994cdf-55bc-42f8-b2cc-2f7d32359317",
                order_index: 2,
                type: "location",
                name: "Galerías de arte",
            },
            THEATERS: {
                id: "164448b8-7b5c-4875-a652-37e042456d2d",
                order_index: 3,
                type: "location",
                name: "Teatros",
            },
            CONCERT_VENUES: {
                id: "84d10573-0cef-4cda-bbc7-d9d8c902069f",
                order_index: 4,
                type: "location",
                name: "Salas de conciertos",
            },
            HISTORIC_SITES: {
                id: "d67c6e6e-9cca-4daa-b382-d458360a066d",
                order_index: 5,
                type: "location",
                name: "Sitios históricos",
            },
            MONUMENTS: {
                id: "d61355ba-adf6-49c6-8467-4037e0c3e978",
                order_index: 6,
                type: "location",
                name: "Monumentos",
            },
            LIBRARIES: {
                id: "3577e70e-5f21-46d1-b067-f4926e1936a8",
                order_index: 7,
                type: "location",
                name: "Bibliotecas",
            },
            CULTURAL_CENTERS: {
                id: "bb50ff5f-ad12-4467-90b9-fa2123f5ac49",
                order_index: 8,
                type: "location",
                name: "Centros culturales",
            },
        },
    },

    PARKS_AND_NATURE: {
        id: "d7569f16-3d4d-4e79-ac0e-a11a80b31f6c",
        icon: "IconNature",
        order_index: 5,
        type: "location",
        name: "Parques y Naturaleza",
        SUB_CATEGORIES: {
            URBAN_PARKS: {
                id: "ecd1752b-f8f4-4e6b-939b-a15586675b1f",
                order_index: 1,
                type: "location",
                name: "Parques urbanos",
            },
            PLAYGROUNDS: {
                id: "2317985d-6b46-4391-a880-48090c95c9d3",
                order_index: 2,
                type: "location",
                name: "Parques infantiles",
            },
            BOTANICAL_GARDENS: {
                id: "57caef2f-6402-43b4-9b8f-303f3cb9ab75",
                order_index: 3,
                type: "location",
                name: "Jardines botánicos",
            },
            TRAILS: {
                id: "9fa589e5-a339-4cb6-9c7e-909e844d41ba",
                order_index: 4,
                type: "location",
                name: "Senderos",
            },
            BEACHES: {
                id: "01dcc1a2-fe62-4de8-822e-caba49c50f3c",
                order_index: 5,
                type: "location",
                name: "Playas",
            },
            ZOOS_AND_AQUARIUMS: {
                id: "b7639fff-d280-411f-a426-f1eddeb73b55",
                order_index: 6,
                type: "location",
                name: "Zoológicos y Acuarios",
            },
            NATURE_RESERVES: {
                id: "9c1f3552-494d-464f-b4dd-bb161e6a6e47",
                order_index: 7,
                type: "location",
                name: "Reservas naturales",
            },
        },
    },

    SHOPPING: {
        id: "e9781151-e27a-4c60-9819-49c095f03cd8",
        icon: "IconShoppingBag",
        order_index: 6,
        type: "location",
        name: "Compras",
        SUB_CATEGORIES: {
            SUPERMARKETS: {
                id: "c1059558-561f-4720-805e-6468f73cf29c",
                order_index: 1,
                type: "location",
                name: "Supermercados",
            },
            FARMERS_MARKETS: {
                id: "e25bdb0a-0111-48a9-8fbf-c470910ee001",
                order_index: 2,
                type: "location",
                name: "Mercados de agricultores",
            },
            SHOPPING_MALLS: {
                id: "e5ca0ca4-cf59-4c0f-82ef-45a063075e9d",
                order_index: 3,
                type: "location",
                name: "Centros comerciales",
            },
            BOUTIQUES: {
                id: "35b50848-fa18-4a21-bbe0-0229dbe13102",
                order_index: 4,
                type: "location",
                name: "Boutiques",
            },
            SOUVENIRS: {
                id: "0928801b-9908-46a6-95bf-3f9d0bee0251",
                order_index: 5,
                type: "location",
                name: "Souvenirs",
            },
            FLEA_MARKETS: {
                id: "3dbd739f-b111-49a4-9a01-fdbcf58d91a7",
                order_index: 6,
                type: "location",
                name: "Mercadillos",
            },
        },
    },

    SERVICES: {
        id: "f97d7e65-87f5-471e-a120-c04c26394b54",
        icon: "IconLocalAtm",
        order_index: 7,
        type: "location",
        name: "Servicios",
        SUB_CATEGORIES: {
            BANKS: {
                id: "b687c3eb-a033-4982-ae47-236697e027b1",
                order_index: 1,
                type: "location",
                name: "Bancos",
            },
            POST_OFFICES: {
                id: "feaee2d1-4cce-48d1-a02d-f773384a5171",
                order_index: 2,
                type: "location",
                name: "Oficinas de correos",
            },
            DRY_CLEANERS: {
                id: "cbe9ec62-6cd2-4999-b0d7-e86d1d79870d",
                order_index: 3,
                type: "location",
                name: "Tintorerías",
            },
            LAUNDROMATS: {
                id: "81214844-8e80-45bf-a082-b0c72413dff2",
                order_index: 4,
                type: "location",
                name: "Lavanderías",
            },
            HAIR_SALONS_AND_BARBERS: {
                id: "7257be95-7d6e-43aa-b919-8005c2443f63",
                order_index: 5,
                type: "location",
                name: "Peluquerías y Barberías",
            },
            PRINT_AND_COPY: {
                id: "47a64cae-136b-4e93-8752-882c583d3e30",
                order_index: 6,
                type: "location",
                name: "Centros de impresión y copiado",
            },
            PARKINGS: {
                id: "9e2a6f5d-7c42-4f8c-b7ef-6c4c3e4c2a71",
                order_index: 7,
                type: "location",
                name: "Aparcamientos",
            },
        },
    },

    TRANSPORTATION: {
        id: "5922cd0e-8c11-448f-83c0-e785f83c31f5",
        icon: "IconTrain",
        order_index: 8,
        type: "location",
        name: "Transporte",
        SUB_CATEGORIES: {
            BUS_STOPS: {
                id: "8760d066-d6c1-468f-80ab-b0dcae430af1",
                order_index: 1,
                type: "location",
                name: "Paradas de autobús",
            },
            METRO_STATIONS: {
                id: "a113f5c3-b32a-439f-961f-851c767f5bd5",
                order_index: 2,
                type: "location",
                name: "Estaciones de metro",
            },
            TRAIN_STATIONS: {
                id: "4404e048-02fe-469a-bcf0-69ff62fdd8ce",
                order_index: 3,
                type: "location",
                name: "Estaciones de tren",
            },
            BIKE_RENTALS: {
                id: "0c9e0152-f4fa-409c-a28a-c1984d05518f",
                order_index: 4,
                type: "location",
                name: "Alquiler de bicicletas",
            },
            SCOOTER_RENTALS: {
                id: "5cae1a6d-305c-430f-926e-46c0bd763ffa",
                order_index: 5,
                type: "location",
                name: "Alquiler de scooters",
            },
            FERRY_TERMINALS: {
                id: "ec589527-2da7-4228-81c9-aaab84fd9d64",
                order_index: 6,
                type: "location",
                name: "Terminales de ferry",
            },
            TAXI_STANDS: {
                id: "6ed3e4bf-1ff5-4d50-bebe-a7ae2f9edd8e",
                order_index: 7,
                type: "location",
                name: "Paradas de taxi",
            },
        },
    },

    ENTERTAINMENT_AND_NIGHTLIFE: {
        id: "81bb9ab7-25ad-483c-812d-6bdef1a0ee92",
        icon: "IconNightLife",
        order_index: 9,
        type: "location",
        name: "Entretenimiento y Vida Nocturna",
        SUB_CATEGORIES: {
            NIGHTCLUBS: {
                id: "70a80113-e4cf-487b-8e39-bc5ed5fe7588",
                order_index: 1,
                type: "location",
                name: "Discotecas",
            },
            CASINOS: {
                id: "a18fa330-50fc-43a9-8edd-da8cdf3d0f06",
                order_index: 2,
                type: "location",
                name: "Casinos",
            },
            COMEDY_CLUBS: {
                id: "ea0406ab-18c7-48b4-976d-e016629ed7a0",
                order_index: 3,
                type: "location",
                name: "Clubes de comedia",
            },
            KARAOKE: {
                id: "d672053e-dc92-4e88-bf47-aab0bc18adfa",
                order_index: 4,
                type: "location",
                name: "Karaoke",
            },
            CINEMAS: {
                id: "4619002a-2e62-4fcf-8573-91727d106405",
                order_index: 5,
                type: "location",
                name: "Cines",
            },
            ESCAPE_ROOMS: {
                id: "4c893118-197b-437d-bb91-3952b8b7b45e",
                order_index: 6,
                type: "location",
                name: "Salas de escape",
            },
            BOWLING_ALLEYS: {
                id: "d2f95ecd-deb9-42d4-aa8d-4d9f7d84c368",
                order_index: 7,
                type: "location",
                name: "Boleras",
            },
            ARCADES: {
                id: "004ced32-64dd-4ab0-8f7d-d241bfecbd4c",
                order_index: 8,
                type: "location",
                name: "Arcades",
            },
        },
    },

    ATTRACTIONS_AND_TOURISM: {
        id: "d2a4b56f-151b-4151-a006-6f86a7ad6a9a",
        icon: "IconComedyMask",
        order_index: 10,
        type: "location",
        name: "Atracciones y Turismo",
        SUB_CATEGORIES: {
            TOURIST_ATTRACTIONS: {
                id: "7ad70a98-6d4d-473a-8d5b-e9c12af02976",
                order_index: 1,
                type: "location",
                name: "Atracciones turísticas",
            },
            LANDMARKS: {
                id: "2db703c0-922e-4642-a5b9-8fda4b73c613",
                order_index: 2,
                type: "location",
                name: "Lugares emblemáticos",
            },
            VIEWPOINTS: {
                id: "fbac7bca-a33f-42fb-a266-cd5931f6f24b",
                order_index: 3,
                type: "location",
                name: "Miradores",
            },
            THEME_PARKS: {
                id: "bcc4d5f2-a406-492d-a680-b5a9cd8c9886",
                order_index: 4,
                type: "location",
                name: "Parques temáticos",
            },
            WATER_PARKS: {
                id: "ae04421f-8507-4ec4-bd9c-52b2229e40d3",
                order_index: 5,
                type: "location",
                name: "Parques acuáticos",
            },
            GUIDED_TOURS: {
                id: "7ffc6b69-5684-4385-9f05-0ba196b409ca",
                order_index: 6,
                type: "location",
                name: "Tours guiados",
            },
        },
    },

    SECURITY_AND_EMERGENCIES: {
        id: "c89d4a51-babd-44d0-acff-de3f3a8fd3db",
        icon: "IconEmergency",
        order_index: 11,
        type: "location",
        name: "Seguridad y Emergencias",
        SUB_CATEGORIES: {
            POLICE_STATIONS: {
                id: "a7a480f3-895c-48a1-8ae8-7fc8a57c1d10",
                order_index: 1,
                type: "location",
                name: "Estaciones de policía",
            },
            FIRE_STATIONS: {
                id: "e41e0fb7-bb65-4d62-998e-13ba9a6c684e",
                order_index: 2,
                type: "location",
                name: "Estaciones de bomberos",
            },
            EMERGENCY_CLINICS: {
                id: "4682133f-e202-4620-bc2c-fa2d0921a231",
                order_index: 3,
                type: "location",
                name: "Clínicas de emergencia",
            },
            EMBASSIES: {
                id: "3725a152-dfeb-4041-9b60-e0564c13384a",
                order_index: 4,
                type: "location",
                name: "Embajadas",
            },
        },
    },

    FAMILY_AND_KIDS: {
        id: "5509834d-c45c-4667-9e8b-960fea63ffc2",
        icon: "IconFamilyRestroom",
        order_index: 12,
        type: "location",
        name: "Familia y Niños",
        SUB_CATEGORIES: {
            KID_FRIENDLY_RESTAURANTS: {
                id: "8028b58d-6024-42dc-a4e2-2ff2caa27e56",
                order_index: 1,
                type: "location",
                name: "Restaurantes para niños",
            },
            INDOOR_PLAY_CENTERS: {
                id: "01f16e27-fba9-4ee5-9eb8-9b948c235de2",
                order_index: 2,
                type: "location",
                name: "Centros de juegos interiores",
            },
            TOY_STORES: {
                id: "bdf47ef5-710c-4f2d-aa6a-b40c45148b11",
                order_index: 3,
                type: "location",
                name: "Jugueterías",
            },
            CHILDRENS_MUSEUMS: {
                id: "da84c886-c6a6-4d5b-8148-657d6802bbb8",
                order_index: 4,
                type: "location",
                name: "Museos infantiles",
            },
        },
    },

    PETS: {
        id: "7afd50dd-e1ea-41e8-9f2f-77ad9c4fe684",
        icon: "IconPets",
        order_index: 13,
        type: "location",
        name: "Mascotas",
        SUB_CATEGORIES: {
            PET_STORES: {
                id: "49c9294a-409a-4e28-80a4-da0aa48906c4",
                order_index: 1,
                type: "location",
                name: "Tiendas de mascotas",
            },
            VETERINARIANS: {
                id: "17f95bb5-1a11-45da-9d60-adad0cb6a13d",
                order_index: 2,
                type: "location",
                name: "Veterinarios",
            },
            GROOMING: {
                id: "5fd95b33-2992-4e8c-88d4-0bb295e93994",
                order_index: 3,
                type: "location",
                name: "Peluquerías",
            },
        },
    },
};

export const GOOGLE_MAPS_DIRECTION_URL =
    "https://www.google.com/maps/dir/?api=1&destination=";

export const LANDING_APPBAR_MENU = [
    {
        label: "Cómo funciona",
        url: "/#how",
    },
    {
        label: "Funciones",
        url: "/#functions",
    },
    {
        label: "Beneficios",
        url: "/#benefits",
    },
    {
        label: "Opiniones",
        url: "/#oppinios",
    },
];

export const TIPS = [
    {
        id: 1,
        title: "Piensa como tu huésped",
        subtitle: "¿Es su primera vez en la ciudad?",
    },
    {
        id: 2,
        title: "Recomienda tus favoritos",
        subtitle: "No hagas una lista genérica",
    },
    {
        id: 3,
        title: "Piensa en lo práctico también",
        subtitle: "No todo es turismo",
    },
    {
        id: 4,
        title: "Prioriza calidad sobre cantidad",
        subtitle:
            "Mejor 5 recomendaciones bien explicadas, que 20 lugares que no aportan valor",
    },
    {
        id: 5,
        title: "Agrega fotos si puedes",
        subtitle:
            "Una imagen del lugar o del plato estrella puede marcar la diferencia",
    },
    {
        id: 6,
        title: "Actualiza cada tanto",
        subtitle: "Los locales cambian",
    },
];

export const MAGIC_FINDER_SELECT = [
    { label: "Hospitales", value: "hospital" },
    { label: "Farmacias", value: "pharmacy" },
    { label: "Cuidado dental", value: "dentist" },
    { label: "Masajes y Spa", value: "spa" },
    { label: "Gimnasios", value: "gym" },
    { label: "Restaurantes", value: "restaurant" },
    { label: "Cafeterías", value: "cafe" },
    { label: "Panaderías", value: "bakery" },
    { label: "Comida rápida", value: "meal_takeaway" },
    { label: "Bares", value: "bar" },
    { label: "Museos", value: "museum" },
    { label: "Galerías de arte", value: "art_gallery" },
    { label: "Sitios históricos", value: "tourist_attraction" },
    { label: "Bibliotecas", value: "library" },
    { label: "Zoológicos y Acuarios", value: "zoo" },
    { label: "Supermercados", value: "supermarket" },
    { label: "Mercados de agricultores", value: "grocery_or_supermarket" },
    { label: "Centros comerciales", value: "shopping_mall" },
    { label: "Boutiques", value: "clothing_store" },
    { label: "Mercadillos", value: "store" },
    { label: "Bancos", value: "bank" },
    { label: "Oficinas de correos", value: "post_office" },
    { label: "Lavanderías", value: "laundry" },
    { label: "Peluquerías y Barberías", value: "hair_care" },
    { label: "Paradas de autobús", value: "bus_station" },
    { label: "Estaciones de metro", value: "subway_station" },
    { label: "Estaciones de tren", value: "train_station" },
    { label: "Alquiler de bicicletas", value: "bicycle_store" },
    { label: "Terminales de ferry", value: "transit_station" },
    { label: "Paradas de taxi", value: "taxi_stand" },
    { label: "Discotecas", value: "night_club" },
    { label: "Casinos", value: "casino" },
    { label: "Cines", value: "movie_theater" },
    { label: "Boleras", value: "bowling_alley" },
    { label: "Arcades", value: "amusement_center" },
    { label: "Miradores", value: "point_of_interest" },
    { label: "Tours guiados", value: "travel_agency" },
    { label: "Estaciones de policía", value: "police" },
    { label: "Estaciones de bomberos", value: "fire_station" },
    { label: "Embajadas", value: "embassy" },
    { label: "Parques", value: "park" },
    { label: "Tiendas de mascotas", value: "pet_store" },
    { label: "Veterinarios", value: "veterinary_care" },
];

export const MAX_MAGIC_FINDER_LOCATIONS = 10;

export const RADIUS_OPTIONS = [
    { value: "1000", label: "1 km" },
    { value: "2000", label: "2 km" },
    { value: "3000", label: "3 km" },
    { value: "4000", label: "4 km" },
    { value: "5000", label: "5 km" },
];

export const DAILY_AI_USAGE_LIMMIT = 10;

export const DEMOS = [
    {
        id: "add-property",
        label: "addProperty",
        embedUrl:
            "https://app.supademo.com/embed/cmm4sqa9w272ydtfhzz8rjhvc?embed_v=2&utm_source=embed",
        publicUrl:
            "https://app.supademo.com/demo/cmm4sqa9w272ydtfhzz8rjhvc?utm_source=link",
    },
    {
        id: "my-properties",
        label: "myProperties",
        embedUrl:
            "https://app.supademo.com/embed/cmm3wjcoq0u3idtfhtv2idlrk?embed_v=2&utm_source=embed",
        publicUrl:
            "https://app.supademo.com/demo/cmm3wjcoq0u3idtfhtv2idlrk?utm_source=link",
    },
    {
        id: "edit-properties",
        label: "editProperties",
        embedUrl:
            "https://app.supademo.com/embed/cmm3x6aao0uy5dtfhz5tj67t3?embed_v=2&utm_source=embed",
        publicUrl:
            "https://app.supademo.com/demo/cmm3x6aao0uy5dtfhz5tj67t3?utm_source=link",
    },
    {
        id: "edit-property-details",
        label: "editPropertDetails",
        embedUrl:
            "https://app.supademo.com/embed/cmm4wj2rg2drndtfhvgm858hr?embed_v=2&utm_source=embed",
        publicUrl:
            "https://app.supademo.com/demo/cmm4wj2rg2drndtfhvgm858hr?utm_source=link",
    },
    {
        id: "edit-property-info",
        label: "editPropertyInfo",
        embedUrl:
            "https://app.supademo.com/embed/cmm4rcg6b23g5dtfh7u2kdzn0?embed_v=2&utm_source=embed",
        publicUrl:
            "https://app.supademo.com/demo/cmm4rcg6b23g5dtfh7u2kdzn0?utm_source=link",
    },
    {
        id: "add-location",
        label: "addLocation",
        embedUrl:
            "https://app.supademo.com/embed/cmm4ry8ng25txdtfh72jw1p8u?embed_v=2&utm_source=embed",
        publicUrl:
            "https://app.supademo.com/demo/cmm4ry8ng25txdtfh72jw1p8u?utm_source=link",
    },
    {
        id: "favorites-must-see",
        label: "favoritesMustSee",
        embedUrl:
            "https://app.supademo.com/embed/cmm50p1dd2mdjdtfhhst9yfx3?embed_v=2&utm_source=embed",
        publicUrl:
            "https://app.supademo.com/demo/cmm50p1dd2mdjdtfhhst9yfx3?utm_source=link",
    },
    {
        id: "add-multiple-locations",
        label: "addMultipleLocations",
        embedUrl:
            "https://app.supademo.com/embed/cmm4vze4o2d3cdtfhafzau4o4?embed_v=2&utm_source=embed",
        publicUrl:
            "https://app.supademo.com/demo/cmm4vze4o2d3cdtfhafzau4o4?utm_source=link",
    },
    {
        id: "delete-locations",
        label: "deleteLocation",
        embedUrl:
            "https://app.supademo.com/embed/cmm4w8e0d2dcadtfh7rgmu7ao?embed_v=2&utm_source=embed",
        publicUrl:
            "https://app.supademo.com/demo/cmm4w8e0d2dcadtfh7rgmu7ao?utm_source=link",
    },
    {
        id: "delete-property",
        label: "deleteProperty",
        embedUrl:
            "https://app.supademo.com/embed/cmm4vrw9g2cwedtfho4o5yt1s?embed_v=2&utm_source=embed",
        publicUrl:
            "https://app.supademo.com/demo/cmm4vrw9g2cwedtfho4o5yt1s?utm_source=link",
    },
    {
        id: "access-public-page",
        label: "accessPublicProperty",
        embedUrl:
            "https://app.supademo.com/embed/cmm515aug2njpdtfh107t7orm?embed_v=2&utm_source=embed",
        publicUrl:
            "https://app.supademo.com/demo/cmm515aug2njpdtfh107t7orm?utm_source=link",
    },
    {
        id: "public-page",
        label: "publicProperty",
        embedUrl:
            "https://app.supademo.com/embed/cmm51r4jg2ozrdtfh35obkoem?embed_v=2&utm_source=embed",
        publicUrl:
            "https://app.supademo.com/demo/cmm51r4jg2ozrdtfh35obkoem?utm_source=link",
    },
];

export const DEFAULT_EMBED_SRC =
    "https://app.supademo.com/showcase/embed/cmm52w6xp000gyk0ipaibjzah?embed_v=2&utm_source=embed";

export const BILLBOARD_CAROUSEL = [
    {
        title: "billboard.tip1.title",
        description: "billboard.tip1.description",
        link: "/app/properties",
    },
    {
        title: "billboard.tip2.title",
        description: "billboard.tip2.description",
        link: "/app/properties",
    },
    {
        title: "billboard.tip3.title",
        description: "billboard.tip3.description",
        link: "/app/properties",
    },
] as const;
