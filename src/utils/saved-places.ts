// Localizaciones guardadas por el huésped (sin login): viven en una cookie por
// propiedad para que el servidor pinte las cards ya en su estado y cargue el
// tab "Guardados" sin un endpoint público. El mismo formato sirve para el
// query param `?saved=` del enlace compartido.

// 50 UUIDs (36 caracteres + separador) quedan muy por debajo de los 4 KB
// que admite una cookie
export const SAVED_PLACES_MAX = 50;

// 90 días: cubre de sobra una estancia aunque se prepare con antelación
export const SAVED_PLACES_MAX_AGE = 60 * 60 * 24 * 90;

export const SAVED_PLACES_SEARCH_PARAM = "saved";

// Punto y no coma: RFC 6265 no admite comas en el valor de una cookie, y en
// la URL tampoco hay que codificarlo
const SEPARATOR = ".";

const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const getSavedPlacesCookieName = (propertyId: string): string =>
    `be_saved_${propertyId}`;

// Descarta lo que no sea un UUID (la cookie y el query param los controla el
// usuario), quita duplicados y aplica el tope
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

// Suma lo que llega por un enlace compartido a lo que ya tenía el huésped.
// Si se pasa del tope se descarta lo del enlace, nunca lo suyo: un enlace
// manipulado no puede vaciarle la lista
export const mergeSavedPlaceIds = (
    current: string[],
    incoming: string[],
): string[] =>
    Array.from(new Set([...current, ...incoming])).slice(0, SAVED_PLACES_MAX);
