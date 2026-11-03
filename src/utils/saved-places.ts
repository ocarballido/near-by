// Localizaciones guardadas por el huésped (sin login). La lista vive en una
// cookie httpOnly que solo escribe el servidor (ver
// src/lib/saved-places/cookie.ts). Aquí solo lo que comparten cliente y
// servidor, incluido el formato del query param `?saved=` del enlace
// compartido (el mismo que usa la pestaña para el enlace pendiente).

// Tope por guía. Lo aplican la cookie y la API, y limita también el enlace
// compartido: lo que se lee y se escribe en ?saved= y lo que el cliente
// envía en un merge
export const SAVED_PLACES_MAX = 50;

export const SAVED_PLACES_SEARCH_PARAM = "saved";

// Punto y no coma: en la URL no hay que codificarlo
const SEPARATOR = ".";

const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isUuid = (value: unknown): value is string =>
    typeof value === "string" && UUID_REGEX.test(value);

// Descarta lo que no sea un UUID (el query param lo controla cualquiera),
// quita duplicados y aplica el tope
export const parseSavedPlaceIds = (raw?: string | null): string[] => {
    if (!raw) return [];

    const ids = raw
        .split(SEPARATOR)
        .map((id) => id.trim().toLowerCase())
        .filter((id) => UUID_REGEX.test(id));

    return Array.from(new Set(ids)).slice(0, SAVED_PLACES_MAX);
};

export const serializeSavedPlaceIds = (ids: string[]): string =>
    ids.slice(0, SAVED_PLACES_MAX).join(SEPARATOR);
