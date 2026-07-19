import { z } from "zod";

/**
 * Un bloque de comida solo debe aparecer cuando la preferencia
 * seleccionada es "food" (que es la única que hace que fetchNearbyPOIs
 * traiga POIs de tipo "restaurant"/"cafe" — ver PREFERENCE_TO_GOOGLE_TYPE
 * en src/lib/fetcher-nearby.ts). En el resto de casos, todos los bloques
 * son de tipo "activity".
 */
export const itineraryBlockTypeSchema = z.enum([
    "breakfast",
    "lunch",
    "dinner",
    "activity",
]);

export const itineraryBlockSchema = z.object({
    type: itineraryBlockTypeSchema,
    time: z.string().describe('Hora en formato HH:mm, ej. "09:30"'),
    poiName: z
        .string()
        .describe("Nombre exacto del POI, tal cual se recibió en poiList"),
    lat: z.number(),
    lng: z.number(),
    shortDescription: z
        .string()
        .describe(
            "Una frase breve y neutra sobre qué hacer o por qué visitar el lugar",
        ),
});

export const itineraryDaySchema = z.object({
    dayNumber: z.number().int().min(1),
    blocks: z.array(itineraryBlockSchema).min(1),
});

export const itinerarySchema = z.object({
    days: z.array(itineraryDaySchema).min(1),
    closingNote: z
        .string()
        .describe("Frase final amable y neutra que cierra el itinerario"),
});

export type ItineraryBlockType = z.infer<typeof itineraryBlockTypeSchema>;
export type ItineraryBlock = z.infer<typeof itineraryBlockSchema>;
export type ItineraryDay = z.infer<typeof itineraryDaySchema>;
export type Itinerary = z.infer<typeof itinerarySchema>;
