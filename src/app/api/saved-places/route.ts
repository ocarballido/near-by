import { NextRequest, NextResponse } from "next/server";

import {
    getGuideFreeSlots,
    getGuidePlaceIds,
    nextSavedPlacesAt,
    readSavedPlaces,
    setGuidePlaceIds,
    writeSavedPlaces,
} from "@/lib/saved-places/cookie";
import { resolvePlaceIds } from "@/lib/saved-places/resolve-place-ids";
import { SAVED_PLACES_MAX, isUuid } from "@/utils/saved-places";

// Guardados del huésped en la guía pública (sin login). La lista vive en la
// cookie httpOnly de cookie.ts y solo la escribe esta ruta: lee la cookie,
// aplica la operación, valida la lista de la guía con una lectura de
// property_data y responde con la lista resultante (`ids`, del más antiguo
// al más reciente) y su versión (`at`, la hora que queda en la cookie). No
// escribe en la BD.

// El body más grande que se usa (merge con 50 UUID) ronda los 2 KB: con este
// tope no se lee entero un body enorme antes de rechazarlo
const MAX_BODY_BYTES = 8 * 1024;

type SavedPlacesPayload =
    | { action: "add"; propertyId: string; placeId: string }
    | { action: "remove"; propertyId: string; placeId: string }
    | { action: "merge"; propertyId: string; placeIds: string[] };

// Mismo criterio que Next con las Server Actions: el host del Origin debe
// coincidir con x-forwarded-host o con host. Sin esto, una web ajena podría
// enviar un formulario a esta ruta: llegaría sin la cookie (SameSite=Lax) y
// la respuesta sustituiría la lista del huésped
const isSameOrigin = (request: NextRequest): boolean => {
    const origin = request.headers.get("origin");
    if (!origin) return false;

    let originHost: string;
    try {
        originHost = new URL(origin).host;
    } catch {
        return false;
    }

    const forwardedHost = request.headers
        .get("x-forwarded-host")
        ?.split(",")[0]
        ?.trim();

    return (
        originHost === forwardedHost ||
        originHost === request.headers.get("host")
    );
};

// Segunda barrera además del Origin: un formulario de otra web no puede
// enviar application/json, y un fetch desde otro origen con ese tipo
// necesita un preflight que no se permite
const isJsonRequest = (request: NextRequest): boolean =>
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() ===
    "application/json";

// Los ids se pasan a minúsculas: así se comparan con los de la BD y la cookie
const parsePayload = (body: unknown): SavedPlacesPayload | null => {
    if (!body || typeof body !== "object") return null;

    const { action, propertyId, placeId, placeIds } = body as Record<
        string,
        unknown
    >;

    if (!isUuid(propertyId)) return null;
    const property = propertyId.toLowerCase();

    if ((action === "add" || action === "remove") && isUuid(placeId)) {
        return { action, propertyId: property, placeId: placeId.toLowerCase() };
    }

    if (
        action === "merge" &&
        Array.isArray(placeIds) &&
        placeIds.length > 0 &&
        placeIds.length <= SAVED_PLACES_MAX &&
        placeIds.every(isUuid)
    ) {
        return {
            action,
            propertyId: property,
            placeIds: Array.from(
                new Set(placeIds.map((id: string) => id.toLowerCase())),
            ),
        };
    }

    return null;
};

const errorResponse = (error: string, status: number) =>
    NextResponse.json({ ok: false, error }, { status });

export async function POST(request: NextRequest) {
    if (!isSameOrigin(request)) return errorResponse("Forbidden", 403);
    if (!isJsonRequest(request)) {
        return errorResponse("Unsupported media type", 415);
    }

    // fetch() siempre manda Content-Length con un body de texto: sin ella no
    // se sabe cuánto habría que leer
    const contentLength = request.headers.get("content-length");
    if (!contentLength) return errorResponse("Length required", 411);
    if (!/^\d+$/.test(contentLength) || Number(contentLength) > MAX_BODY_BYTES) {
        return errorResponse("Payload too large", 413);
    }

    let payload: SavedPlacesPayload | null;
    try {
        payload = parsePayload(await request.json());
    } catch {
        payload = null;
    }
    if (!payload) return errorResponse("Invalid payload", 400);

    const { propertyId } = payload;
    const saved = readSavedPlaces(request.cookies);
    const current = getGuidePlaceIds(saved.guides, propertyId);

    // Una sola lectura valida lo que llega y, de paso, quita de la lista los
    // sitios que el anfitrión haya borrado desde la última escritura
    let next: string[];

    if (payload.action === "add") {
        const { placeId } = payload;
        // Si ya estaba, conserva su posición
        const candidates = current.includes(placeId)
            ? current
            : [...current, placeId];
        const valid = await resolvePlaceIds(propertyId, candidates);

        if (!valid) return errorResponse("Internal error", 500);
        // No es un sitio de tipo location de esta guía: no se guarda nada
        if (!valid.includes(placeId)) return errorResponse("Not found", 404);

        // Al pasar del tope se descarta el más antiguo
        next = valid.slice(-SAVED_PLACES_MAX);
    } else if (payload.action === "remove") {
        const { placeId } = payload;
        const remaining = current.filter((id) => id !== placeId);
        // Quitar no puede meter ids sin validar: si la lectura falla, se
        // quita igual
        next = (await resolvePlaceIds(propertyId, remaining)) ?? remaining;
    } else {
        const { placeIds } = payload;
        const valid = await resolvePlaceIds(propertyId, [
            ...current,
            ...placeIds.filter((id) => !current.includes(id)),
        ]);

        if (!valid) return errorResponse("Internal error", 500);

        // Lo del enlace solo ocupa huecos libres (getGuideFreeSlots): nunca
        // desplaza lo que ya tenía el huésped, ni en esta guía ni en las
        // demás. Los sitios borrados solo se descuentan en esta guía: los de
        // otras no se validan aquí y siguen contando, así que los huecos
        // nunca se calculan de más
        const validSet = new Set(valid);
        const validCurrent = current.filter((id) => validSet.has(id));
        const freeSlots = getGuideFreeSlots(
            setGuidePlaceIds(saved.guides, propertyId, validCurrent),
            propertyId,
        );
        next = [
            ...validCurrent,
            ...placeIds
                .filter((id) => validSet.has(id) && !validCurrent.includes(id))
                .slice(0, freeSlots),
        ];
    }

    // Sin cookie y sin nada que guardar (quitar sin lista, o un enlace sin
    // ningún sitio válido): no se crea la cookie. Versión 0, la misma que
    // ve una página pintada sin cookie
    if (saved.at === 0 && next.length === 0) {
        return NextResponse.json({ ok: true, ids: [], at: 0 });
    }

    const guides = setGuidePlaceIds(saved.guides, propertyId, next);
    const at = nextSavedPlacesAt(saved.at);

    const response = NextResponse.json({
        ok: true,
        ids: getGuidePlaceIds(guides, propertyId),
        at,
    });
    writeSavedPlaces(response.cookies, guides, at);
    return response;
}
