import type { ItineraryDay } from "@/types/itinerary";

/**
 * Mapea el transporte seleccionado en el formulario al valor que
 * espera el parámetro travelmode de Google Maps. "public" no tiene
 * equivalente 1:1 en el nombre, Google lo llama "transit".
 */
const TRANSPORT_TO_GOOGLE_TRAVEL_MODE: Record<string, string> = {
    walk: "walking",
    bike: "bicycling",
    car: "driving",
    public: "transit",
};

/**
 * Construye un enlace de Google Maps con la ruta completa de un día,
 * pasando por todas las paradas en el orden del itinerario.
 *
 * No se fija un origen a propósito: al omitir el parámetro `origin`,
 * Google Maps usa la ubicación actual del dispositivo como punto de
 * partida (documentado en Google Maps URLs).
 *
 * Devuelve null si el día tiene 0 o 1 parada — con una sola parada no
 * hay "ruta", sería idéntico al enlace individual de esa card.
 */
export const buildDayRouteUrl = (
    day: ItineraryDay,
    transport: string,
): string | null => {
    if (day.blocks.length <= 1) return null;

    const destination = day.blocks[day.blocks.length - 1];
    const waypoints = day.blocks
        .slice(0, -1)
        .map((block) => `${block.lat},${block.lng}`)
        .join("|");

    const travelMode = TRANSPORT_TO_GOOGLE_TRAVEL_MODE[transport];
    const travelModeParam = travelMode ? `&travelmode=${travelMode}` : "";

    return `https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lng}&waypoints=${waypoints}${travelModeParam}`;
};
