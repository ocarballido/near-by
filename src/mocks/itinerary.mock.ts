// src/mocks/itinerary.mock.ts
import type { Itinerary } from "@/types/itinerary";

/**
 * Mock de un itinerario de un solo día, sin bloques de comida
 * (simula preferencia "culture", donde poiList nunca trae
 * restaurant/cafe). Útil para ver el timeline sin pestañas de día
 * y sin la variante de color ámbar/naranja/índigo.
 */
export const mockItinerarySingleDay: Itinerary = {
    days: [
        {
            dayNumber: 1,
            blocks: [
                {
                    type: "activity",
                    time: "10:00",
                    poiName: "Museo del Prado",
                    lat: 40.4138,
                    lng: -3.6921,
                    shortDescription:
                        "Una de las pinacotecas más importantes del mundo, con obras de Velázquez y Goya.",
                },
                {
                    type: "activity",
                    time: "12:30",
                    poiName: "Parque del Retiro",
                    lat: 40.4153,
                    lng: -3.6844,
                    shortDescription:
                        "Un paseo tranquilo junto al estanque, a pocos minutos del museo.",
                },
                {
                    type: "activity",
                    time: "17:00",
                    poiName: "Templo de Debod",
                    lat: 40.4238,
                    lng: -3.7178,
                    shortDescription:
                        "Uno de los mejores miradores de la ciudad, especialmente al atardecer.",
                },
            ],
        },
    ],
    closingNote:
        "Disfruta de tu día explorando el centro de la ciudad a tu ritmo.",
};

/**
 * Mock de un itinerario de fin de semana (2 días), con bloques de
 * comida incluidos (simula preferencia "food"). Útil para ver las
 * pestañas de día y los 4 colores de BLOCK_TYPE_STYLES a la vez.
 */
export const mockItineraryWeekend: Itinerary = {
    days: [
        {
            dayNumber: 1,
            blocks: [
                {
                    type: "breakfast",
                    time: "09:00",
                    poiName: "Café Comercial",
                    lat: 40.4265,
                    lng: -3.6997,
                    shortDescription:
                        "Un clásico madrileño con más de un siglo de historia, ideal para empezar el día.",
                },
                {
                    type: "activity",
                    time: "10:30",
                    poiName: "Mercado de San Miguel",
                    lat: 40.4152,
                    lng: -3.7091,
                    shortDescription:
                        "Mercado gourmet con puestos de tapas y productos locales.",
                },
                {
                    type: "lunch",
                    time: "14:00",
                    poiName: "Casa Botín",
                    lat: 40.4139,
                    lng: -3.7086,
                    shortDescription:
                        "El restaurante en funcionamiento más antiguo del mundo, famoso por su cochinillo.",
                },
                {
                    type: "activity",
                    time: "17:00",
                    poiName: "Plaza Mayor",
                    lat: 40.4155,
                    lng: -3.7074,
                    shortDescription:
                        "El corazón histórico de la ciudad, rodeado de arquitectura del siglo XVII.",
                },
                {
                    type: "dinner",
                    time: "21:00",
                    poiName: "Taberna La Bola",
                    lat: 40.4187,
                    lng: -3.7134,
                    shortDescription:
                        "Cocina tradicional madrileña en un ambiente acogedor y familiar.",
                },
            ],
        },
        {
            dayNumber: 2,
            blocks: [
                {
                    type: "breakfast",
                    time: "09:30",
                    poiName: "Chocolatería San Ginés",
                    lat: 40.4163,
                    lng: -3.7061,
                    shortDescription:
                        "Chocolate con churros en un local histórico abierto desde 1894.",
                },
                {
                    type: "activity",
                    time: "11:00",
                    poiName: "Palacio Real de Madrid",
                    lat: 40.4179,
                    lng: -3.7144,
                    shortDescription:
                        "Residencia oficial de la Familia Real, con más de 3.000 habitaciones.",
                },
                {
                    type: "lunch",
                    time: "14:30",
                    poiName: "Mercado de San Ildefonso",
                    lat: 40.4229,
                    lng: -3.7008,
                    shortDescription:
                        "Mercado gastronómico con propuestas variadas en un ambiente animado.",
                },
                {
                    type: "activity",
                    time: "17:30",
                    poiName: "Gran Vía",
                    lat: 40.42,
                    lng: -3.7025,
                    shortDescription:
                        "La arteria comercial y arquitectónica más emblemática de Madrid.",
                },
            ],
        },
    ],
    closingNote:
        "Un fin de semana completo entre gastronomía, historia y los rincones más emblemáticos de la ciudad.",
};
