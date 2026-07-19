import type { POI } from "@/lib/fetcher-nearby";

type PromptInput = {
    location: string;
    duration: string;
    preferences: string[];
    transport: string;
    poiList: POI[];
};

/**
 * Determina cuántos días debe cubrir el itinerario según la duración
 * seleccionada. "weekend" se modela como 2 días; el resto, como 1.
 * Esta es la ÚNICA fuente de verdad para este mapeo.
 */
export const getDayCountForDuration = (duration: string): number =>
    duration === "weekend" ? 2 : 1;

/**
 * Tipos de POI aptos para bloques de comida. Coincide exactamente con
 * los tipos que fetchNearbyPOIs trae para la preferencia "food"
 * (ver PREFERENCE_TO_GOOGLE_TYPE en src/lib/fetcher-nearby.ts) — si el
 * usuario elige otra preferencia, poiList nunca contendrá estos tipos,
 * y por tanto el itinerario nunca tendrá bloques de comida.
 */
const MEAL_POI_TYPES: readonly string[] = ["restaurant", "cafe"];

const buildMealTypeGuidance = (poiList: POI[], locale: string): string => {
    const hasMealPois = poiList.some((poi) =>
        MEAL_POI_TYPES.includes(poi.type),
    );

    const guidance: Record<
        string,
        { withMeals: string; withoutMeals: string }
    > = {
        es: {
            withMeals:
                'La lista de lugares incluye sitios de comida. Cuando un bloque corresponda a un lugar de este tipo y su horario sea coherente con desayuno, comida o cena, márcalo como "breakfast", "lunch" o "dinner" según corresponda. El resto de bloques deben ser "activity".',
            withoutMeals:
                'La lista de lugares NO incluye sitios de comida. Todos los bloques del itinerario deben ser de tipo "activity". No inventes ni sugieras lugares para comer que no estén en la lista.',
        },
        en: {
            withMeals:
                'The place list includes food venues. When a block corresponds to one of these and its timing fits breakfast, lunch, or dinner, mark it as "breakfast", "lunch", or "dinner" accordingly. All other blocks must be "activity".',
            withoutMeals:
                'The place list does NOT include food venues. Every block in the itinerary must be of type "activity". Do not invent or suggest meal places that are not in the list.',
        },
        fr: {
            withMeals:
                'La liste de lieux inclut des établissements de restauration. Lorsqu\'un bloc correspond à l\'un de ces lieux et que l\'horaire correspond au petit-déjeuner, au déjeuner ou au dîner, marque-le comme "breakfast", "lunch" ou "dinner" selon le cas. Tous les autres blocs doivent être de type "activity".',
            withoutMeals:
                "La liste de lieux n'inclut AUCUN établissement de restauration. Tous les blocs de l'itinéraire doivent être de type \"activity\". N'invente pas et ne suggère pas de lieux pour manger qui ne figurent pas dans la liste.",
        },
    };

    const localeGuidance = guidance[locale] || guidance["en"];
    return hasMealPois ? localeGuidance.withMeals : localeGuidance.withoutMeals;
};

export const getPrompt = (locale: string, input: PromptInput): string => {
    const { location, duration, preferences, transport, poiList } = input;
    const dayCount = getDayCountForDuration(duration);
    const mealTypeGuidance = buildMealTypeGuidance(poiList, locale);

    const templates: Record<string, string> = {
        en: `
You are a travel assistant that generates a personalized itinerary as structured data, based on guest location, interests, available time, and nearby places.

Accommodation: {{location}}
Available time: {{duration}}
Preferences: {{preferences}}
Transportation: {{transport}}
Number of days to plan: {{dayCount}}

Nearby points of interest (use ONLY these; do not invent places, names, or coordinates):
{{poiList}}

Content rules:
- Use neutral, simple, clear language. No emojis, no exaggerated phrases like "hidden gem".
- Every block must reference a real place from the list above, using its exact name, latitude, and longitude.
- Order blocks chronologically and logically by proximity within each day.
- {{mealTypeGuidance}}
- If the selected transport is "public transport", only mention it if you can name a specific line, stop, or station; otherwise omit transport details entirely.
- shortDescription must be a single short sentence per block — no more.
- closingNote must be one polite, neutral closing sentence for the whole itinerary.
- Distribute the available places across {{dayCount}} day(s) in a sensible way; do not repeat the same place across days.

Respond only with data matching the required structure. Write all text content in English.
`,
        es: `
Eres un asistente turístico que genera un itinerario personalizado como datos estructurados, según la ubicación del huésped, sus intereses, tiempo disponible y lugares cercanos.

Alojamiento: {{location}}
Tiempo disponible: {{duration}}
Preferencias: {{preferences}}
Transporte: {{transport}}
Número de días a planificar: {{dayCount}}

Lugares de interés cercanos (usa SOLO estos; no inventes lugares, nombres ni coordenadas):
{{poiList}}

Reglas de contenido:
- Usa lenguaje neutral, sencillo y directo. Sin emojis, sin frases exageradas como "joya escondida".
- Cada bloque debe referenciar un lugar real de la lista anterior, con su nombre, latitud y longitud exactos.
- Ordena los bloques de forma cronológica y lógica por cercanía dentro de cada día.
- {{mealTypeGuidance}}
- Si el transporte seleccionado es "transporte público", menciónalo solo si puedes indicar línea, parada o estación concreta; si no, omite los detalles de transporte.
- shortDescription debe ser una única frase breve por bloque — no más.
- closingNote debe ser una sola frase de cierre amable y neutral para todo el itinerario.
- Distribuye los lugares disponibles entre {{dayCount}} día(s) de forma sensata; no repitas el mismo lugar en varios días.

Responde únicamente con los datos que sigan la estructura requerida. Escribe todo el contenido en español.
`,
        fr: `
Tu es un assistant de voyage qui génère un itinéraire personnalisé sous forme de données structurées, en fonction de la localisation de l'hébergement, des préférences du voyageur, du temps disponible et des lieux à proximité.

Hébergement : {{location}}
Temps disponible : {{duration}}
Préférences : {{preferences}}
Transport : {{transport}}
Nombre de jours à planifier : {{dayCount}}

Lieux d'intérêt à proximité (utilise UNIQUEMENT ceux-ci ; n'invente ni lieux, ni noms, ni coordonnées) :
{{poiList}}

Règles de contenu :
- Utilise un langage neutre, simple et direct. Pas d'emojis, pas de formules exagérées comme "pépite cachée".
- Chaque bloc doit référencer un lieu réel de la liste ci-dessus, avec son nom, sa latitude et sa longitude exacts.
- Ordonne les blocs de façon chronologique et logique selon la proximité au sein de chaque journée.
- {{mealTypeGuidance}}
- Si le transport sélectionné est "transport public", ne le mentionne que si tu peux indiquer une ligne, un arrêt ou une station précis ; sinon, omets les détails de transport.
- shortDescription doit être une seule phrase courte par bloc — pas plus.
- closingNote doit être une seule phrase de clôture aimable et neutre pour l'ensemble de l'itinéraire.
- Répartis les lieux disponibles sur {{dayCount}} jour(s) de façon cohérente ; ne répète pas le même lieu sur plusieurs jours.

Réponds uniquement avec les données respectant la structure requise. Rédige tout le contenu en français.
`,
    };

    const template = templates[locale] || templates["en"];

    return template
        .replace("{{location}}", location)
        .replace("{{duration}}", duration)
        .replace("{{preferences}}", preferences.join(", "))
        .replace("{{transport}}", transport)
        .replace("{{dayCount}}", String(dayCount))
        .replace("{{mealTypeGuidance}}", mealTypeGuidance)
        .replace("{{poiList}}", JSON.stringify(poiList, null, 2));
};
