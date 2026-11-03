import "server-only";

import type { NextResponse } from "next/server";

import { SAVED_PLACES_MAX, isUuid } from "@/utils/saved-places";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

// Guardados del huésped (sin login) de todas las guías, en una sola cookie.
// Solo la leen y la escriben el servidor (httpOnly) y nada se guarda en la
// BD. En producción lleva el prefijo __Host-: el navegador solo la acepta con
// Secure, Path=/ y sin Domain, así que un subdominio no puede plantar otra.
// En local no, porque la app va por http y el prefijo exige Secure
const SAVED_PLACES_COOKIE = IS_PRODUCTION
    ? "__Host-be_saved"
    : "be_saved";

// 60 días desde la última escritura: cada una la renueva
const SAVED_PLACES_COOKIE_MAX_AGE = 60 * 60 * 24 * 60;

// Topes para que la cookie quepa siempre en los 4.096 bytes que garantiza
// RFC 6265. Peor caso (10 guías y 90 sitios): 3.310 bytes de valor, ~3,4 KB
// con el nombre y los atributos. El tope de cada guía es SAVED_PLACES_MAX
const MAX_TOTAL_PLACES = 90;
const MAX_GUIDES = 10;

// Formato: "1~<hora>~<guía>_<id>.<id>~<guía>_<id>". "1" es la versión del
// formato y <hora>, la de la última escritura en base 36. Las guías van de
// la escrita más recientemente a la que menos, y los sitios de cada guía del
// más antiguo al más reciente; los UUID, en hex sin guiones. Next codifica
// el valor con encodeURIComponent, que deja "~", "_" y "." tal cual
const FORMAT_VERSION = "1";
const SEGMENT_SEPARATOR = "~";
const GUIDE_PLACES_SEPARATOR = "_";
const PLACE_SEPARATOR = ".";

// Hasta 10 caracteres: en base 36 caben de sobra los milisegundos de
// Date.now() y el valor sigue siendo un entero seguro al sumarle 1
const AT_REGEX = /^[0-9a-z]{1,10}$/;
const GUIDE_REGEX = /^[0-9a-f]{32}_[0-9a-f]{32}(?:\.[0-9a-f]{32})*$/;

type SavedPlacesGuide = {
    propertyId: string;
    // Del más antiguo al más reciente
    placeIds: string[];
};

type SavedPlaces = {
    // Hora del servidor (ms) de la última escritura; 0 sin cookie. Es la
    // versión de la lista: la página se la pasa al cliente y cada escritura
    // devuelve la nueva, así el cliente sabe cuál de las dos es más reciente
    at: number;
    // De la guía escrita más recientemente a la que menos
    guides: SavedPlacesGuide[];
};

// Lo que comparten cookies() de next/headers y request.cookies
type CookieReader = {
    get: (name: string) => { value: string } | undefined;
};

const EMPTY: SavedPlaces = { at: 0, guides: [] };

const toHex = (uuid: string): string => uuid.replace(/-/g, "").toLowerCase();

const fromHex = (hex: string): string =>
    `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;

// Tope por guía (se quedan los más recientes), de guías y total. Lo que sobra
// sale de las guías escritas hace más tiempo, empezando por sus sitios más
// antiguos; una guía sin sitios desaparece. La primera nunca pierde sitios
// por las demás: su tope (50) es menor que el total (90)
const applyLimits = (guides: SavedPlacesGuide[]): SavedPlacesGuide[] => {
    const limited = guides.slice(0, MAX_GUIDES).map((guide) => ({
        ...guide,
        placeIds: guide.placeIds.slice(-SAVED_PLACES_MAX),
    }));

    let excess =
        limited.reduce((total, guide) => total + guide.placeIds.length, 0) -
        MAX_TOTAL_PLACES;

    for (let index = limited.length - 1; index > 0 && excess > 0; index--) {
        const drop = Math.min(excess, limited[index].placeIds.length);
        limited[index] = {
            ...limited[index],
            placeIds: limited[index].placeIds.slice(drop),
        };
        excess -= drop;
    }

    return limited.filter((guide) => guide.placeIds.length > 0);
};

// La cookie la puede manipular el propio huésped: con otra versión o una hora
// mal formada se trata como si no hubiera cookie, cada guía que no cuadre con
// el formato se ignora y los topes se aplican también al leer
export const readSavedPlaces = (cookies: CookieReader): SavedPlaces => {
    const raw = cookies.get(SAVED_PLACES_COOKIE)?.value;
    if (!raw) return EMPTY;

    const [version, rawAt, ...segments] = raw.split(SEGMENT_SEPARATOR);
    if (version !== FORMAT_VERSION || !rawAt || !AT_REGEX.test(rawAt)) {
        return EMPTY;
    }

    const at = parseInt(rawAt, 36);
    if (at <= 0) return EMPTY;

    const seen = new Set<string>();
    const guides: SavedPlacesGuide[] = [];

    for (const segment of segments) {
        if (guides.length === MAX_GUIDES) break;
        if (!GUIDE_REGEX.test(segment)) continue;

        const [guideHex, placesHex] = segment.split(GUIDE_PLACES_SEPARATOR);
        if (seen.has(guideHex)) continue;
        seen.add(guideHex);

        guides.push({
            propertyId: fromHex(guideHex),
            placeIds: Array.from(new Set(placesHex.split(PLACE_SEPARATOR))).map(
                fromHex,
            ),
        });
    }

    return { at, guides: applyLimits(guides) };
};

export const getGuidePlaceIds = (
    guides: SavedPlacesGuide[],
    propertyId: string,
): string[] => {
    const id = propertyId.toLowerCase();
    return guides.find((guide) => guide.propertyId === id)?.placeIds ?? [];
};

// Sustituye la lista de una guía y la pasa a ser la más reciente. Lo que no
// sea un UUID no se escribe: rompería el formato de la cookie
export const setGuidePlaceIds = (
    guides: SavedPlacesGuide[],
    propertyId: string,
    placeIds: string[],
): SavedPlacesGuide[] => {
    if (!isUuid(propertyId)) return guides;

    const id = propertyId.toLowerCase();
    const others = guides.filter((guide) => guide.propertyId !== id);
    const ids = Array.from(
        new Set(placeIds.filter(isUuid).map((placeId) => placeId.toLowerCase())),
    );

    return applyLimits(
        ids.length > 0 ? [{ propertyId: id, placeIds: ids }, ...others] : others,
    );
};

// Cuántos sitios nuevos caben en una guía sin desalojar nada: los huecos de
// su tope, los del total y, si la guía aún no está, que quepa una guía más.
// Lo usa el enlace compartido, que nunca puede quitarle al huésped lo suyo,
// ni de esa guía ni de las demás
export const getGuideFreeSlots = (
    guides: SavedPlacesGuide[],
    propertyId: string,
): number => {
    const id = propertyId.toLowerCase();
    const current = guides.find((guide) => guide.propertyId === id);
    if (!current && guides.length >= MAX_GUIDES) return 0;

    const total = guides.reduce(
        (count, guide) => count + guide.placeIds.length,
        0,
    );
    const inGuide = current?.placeIds.length ?? 0;

    return Math.max(
        0,
        Math.min(SAVED_PLACES_MAX - inGuide, MAX_TOTAL_PLACES - total),
    );
};

// Hora de la escritura siguiente: nunca menor que la anterior, aunque dos
// instancias del servidor no tengan el reloj exactamente igual
export const nextSavedPlacesAt = (previousAt: number): number =>
    Math.max(Date.now(), previousAt + 1);

const serializeSavedPlaces = (
    guides: SavedPlacesGuide[],
    at: number,
): string =>
    [
        FORMAT_VERSION,
        at.toString(36),
        ...guides.map(
            (guide) =>
                `${toHex(guide.propertyId)}${GUIDE_PLACES_SEPARATOR}${guide.placeIds.map(toHex).join(PLACE_SEPARATOR)}`,
        ),
    ].join(SEGMENT_SEPARATOR);

// Cada escritura renueva los 60 días. Sin ninguna lista se guarda igual,
// solo con la hora: si se borrara, una pestaña con la lista antigua no
// sabría que la de la página es más reciente
export const writeSavedPlaces = (
    cookies: NextResponse["cookies"],
    guides: SavedPlacesGuide[],
    at: number,
): void => {
    cookies.set(
        SAVED_PLACES_COOKIE,
        serializeSavedPlaces(applyLimits(guides), at),
        {
            httpOnly: true,
            secure: IS_PRODUCTION,
            sameSite: "lax",
            path: "/",
            maxAge: SAVED_PLACES_COOKIE_MAX_AGE,
        },
    );
};
