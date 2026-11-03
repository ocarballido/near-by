"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useSyncExternalStore,
    type ReactNode,
} from "react";

import {
    SAVED_PLACES_MAX,
    SAVED_PLACES_SEARCH_PARAM,
    isUuid,
    parseSavedPlaceIds,
    serializeSavedPlaceIds,
} from "@/utils/saved-places";

// shared: sitio de un enlace compartido en un navegador sin cookies. No se
// puede guardar, pero se enseña (en solo lectura) para que quien recibe el
// enlace vea la lista
type SavedPlaceStatus = "saved" | "unsaved" | "saving" | "removing" | "shared";

type PendingAction = "saving" | "removing";

// ids: solo lo que el servidor ha confirmado, del más antiguo al más
// reciente. pending: lo que se está guardando o quitando ahora mismo.
// confirmedAt: versión de esa lista, la hora de escritura de la cookie de la
// que sale (la que leyó la página o la de la última respuesta de la API)
type Snapshot = {
    ids: string[];
    pending: ReadonlyMap<string, PendingAction>;
    confirmedAt: number;
};

const NO_PENDING: ReadonlyMap<string, PendingAction> = new Map();

type SavedPlacesContextProps = {
    // Sin cookies no hay forma de recordar la lista: el botón no se muestra
    available: boolean;
    getStatus: (placeId: string) => SavedPlaceStatus;
    toggleSaved: (placeId: string) => void;
    // Guardados confirmados que no venían en la lista de la página al
    // pintarse (p. ej. al volver atrás Next reutiliza la página de su caché,
    // o un enlace pendiente se acaba de guardar): la bienvenida pide la
    // página otra vez si no tiene los datos de esos sitios
    unrenderedSavedIds: string[];
};

type SavedPlacesProviderProps = {
    propertyId: string;
    // Lista del huésped en su cookie, del más antiguo al más reciente
    savedIds: string[];
    // Ids válidos del enlace compartido (?saved=), en su orden: se pintan
    // "Guardando..." desde el primer render y se guardan al montar. Sin
    // cookies se enseñan en solo lectura y el enlace se queda en la URL. null
    // si no se ha podido comprobar cuáles son válidos
    sharedIds: string[] | null;
    // Hora de escritura de la cookie que ha leído la página (0 sin cookie):
    // la versión de savedIds
    savedAt: number;
    children: ReactNode;
};

type SavedPlacesOperation =
    | { action: "add" | "remove"; placeId: string }
    | { action: "merge"; placeIds: string[] };

// ok solo si el servidor confirma con la lista y su versión: sin ellas no se
// marca nada como guardado
type OperationResult = { ok: true; ids: string[]; at: number } | { ok: false };

// Con cobertura muy mala una petición puede quedarse colgada: sin este
// límite bloquearía la cola. AbortController y no AbortSignal.timeout(),
// que no existe en Safari < 16
const REQUEST_TIMEOUT_MS = 10_000;

// Estado de la pestaña, fuera de React: al navegar se monta otro provider y
// la lista y la cola de escrituras tienen que sobrevivir (también al volver
// atrás, cuando Next reutiliza la página ya pintada con la lista antigua).
// Solo se escribe desde efectos y eventos, nunca en el servidor, donde este
// módulo lo compartirían todas las peticiones
const snapshots = new Map<string, Snapshot>();
const listeners = new Set<() => void>();
const mergingLinks = new Set<string>();
const appliedLinks = new Set<string>();
let queue: Promise<void> = Promise.resolve();
let sequence = 0;
let failUntil = 0;

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
};

const subscribeNothing = () => () => {};

const setSnapshot = (propertyId: string, snapshot: Snapshot) => {
    snapshots.set(propertyId, snapshot);
    listeners.forEach((listener) => listener());
};

// Manda la lista de la pestaña mientras tenga algo en curso o sea al menos
// tan reciente como la de la página. Si no, manda la de la página: su cookie
// es posterior (p. ej. otra pestaña ha cambiado la lista, o una petición
// cortada por el timeout acabó guardándose). Con la pestaña ya en marcha, la
// de la página va sin su "Guardando..." (initialIdle): ese estado solo vale
// para el primer pintado y, si no, se quedaría fijo
const currentSnapshot = (
    propertyId: string,
    initial: Snapshot,
    initialIdle: Snapshot,
): Snapshot => {
    const stored = snapshots.get(propertyId);
    if (!stored) return initial;
    return stored.pending.size > 0 ||
        stored.confirmedAt >= initial.confirmedAt
        ? stored
        : initialIdle;
};

const withPending = (
    pending: ReadonlyMap<string, PendingAction>,
    placeIds: string[],
    action: PendingAction,
) => {
    const next = new Map(pending);
    placeIds.forEach((placeId) => next.set(placeId, action));
    return next;
};

const withoutPending = (
    pending: ReadonlyMap<string, PendingAction>,
    placeIds: string[],
) => {
    const next = new Map(pending);
    placeIds.forEach((placeId) => next.delete(placeId));
    return next;
};

// Las escrituras van de una en una y en orden: cada respuesta trae la lista
// tal como queda tras esa operación. Si una petición se corta por el timeout
// el servidor aún puede completarla; la página siguiente lo corrige
// (currentSnapshot). keepalive deja terminar la petición aunque el huésped
// cierre la pestaña justo después de guardar
const enqueue = (
    propertyId: string,
    operation: SavedPlacesOperation,
    onDone: (result: OperationResult) => void,
) => {
    const id = ++sequence;

    const run = async () => {
        // Una petición anterior ha fallado por red: las que esperaban fallan
        // ya, sin hacer esperar al huésped otros 10 s por cada una
        if (id <= failUntil) {
            onDone({ ok: false });
            return;
        }

        let result: OperationResult = { ok: false };
        const controller = new AbortController();
        const timeout = window.setTimeout(
            () => controller.abort(),
            REQUEST_TIMEOUT_MS,
        );

        try {
            const response = await fetch("/api/saved-places", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...operation, propertyId }),
                keepalive: true,
                signal: controller.signal,
            });

            if (response.ok) {
                const body = (await response.json().catch(() => null)) as {
                    ids?: unknown;
                    at?: unknown;
                } | null;
                const ids = body?.ids;
                const at = body?.at;
                if (
                    Array.isArray(ids) &&
                    ids.every(isUuid) &&
                    typeof at === "number"
                ) {
                    result = { ok: true, ids, at };
                }
            }
        } catch {
            // Sin red o timeout: falla esta y todas las que ya esperan
            failUntil = sequence;
        } finally {
            window.clearTimeout(timeout);
        }

        onDone(result);
    };

    // El catch mantiene viva la cola aunque una operación falle de forma
    // inesperada
    queue = queue
        .then(run)
        .catch((error) => console.error("[SavedPlaces] error:", error));
};

// Quita el enlace compartido de la URL solo si sigue siendo ese. Se llama al
// montar y nunca al llegar una respuesta: Next trata este replaceState como
// un cambio de historial y descarta la navegación que tenga en curso, y al
// montar no puede haber ninguna. El estado va con el árbol de Next pero sin
// su marca __NA: así Next lo copia y sincroniza el router (con la marca lo
// trataría como suyo y el router conservaría la URL con ?saved=, que podría
// volver a escribir). Depende de que Next ya haya preparado el historial, y
// así es porque la página se hidrata dentro del Suspense de loading.tsx,
// después del router; si no, al volver atrás Next recargaría la página
const removeLinkFromUrl = (raw: string) => {
    const url = new URL(window.location.href);
    if (url.searchParams.get(SAVED_PLACES_SEARCH_PARAM) !== raw) return;
    url.searchParams.delete(SAVED_PLACES_SEARCH_PARAM);
    const tree = window.history.state?.__PRIVATE_NEXTJS_INTERNALS_TREE;
    window.history.replaceState(
        tree ? { __PRIVATE_NEXTJS_INTERNALS_TREE: tree } : null,
        "",
        url,
    );
};

// Enlace pendiente de guardar, por guía, en la memoria de la pestaña: como
// la URL se limpia al montar, si el guardado falla (o el huésped recarga
// antes de que termine) se reintenta en la siguiente página de la guía que
// se cargue en esa pestaña. Sin sessionStorage (algunos modos privados) no
// hay reintento
const pendingLinkKey = (propertyId: string) =>
    `saved_link_pending_${propertyId}`;

const readPendingLink = (propertyId: string): string[] => {
    try {
        return parseSavedPlaceIds(
            window.sessionStorage.getItem(pendingLinkKey(propertyId)),
        );
    } catch {
        return [];
    }
};

const writePendingLink = (propertyId: string, placeIds: string[]) => {
    try {
        window.sessionStorage.setItem(
            pendingLinkKey(propertyId),
            serializeSavedPlaceIds(placeIds),
        );
    } catch {
        // Sin sessionStorage: no hay reintento
    }
};

// Solo si sigue siendo ese enlace: otro posterior lo habrá sustituido
const clearPendingLink = (propertyId: string, placeIds: string[]) => {
    try {
        const key = pendingLinkKey(propertyId);
        if (
            window.sessionStorage.getItem(key) ===
            serializeSavedPlaceIds(placeIds)
        ) {
            window.sessionStorage.removeItem(key);
        }
    } catch {
        // Sin sessionStorage: no hay nada que borrar
    }
};

const SavedPlacesContext = createContext<SavedPlacesContextProps | undefined>(
    undefined,
);

export const SavedPlacesProvider = ({
    propertyId,
    savedIds,
    sharedIds,
    savedAt,
    children,
}: SavedPlacesProviderProps) => {
    // Lo del enlace que no está en la lista sale ya como "Guardando...". Sin
    // tope aquí: la cookie puede incluir sitios borrados que el servidor
    // descarta, así que cuánto cabe lo decide su respuesta
    const initialSnapshot = useMemo<Snapshot>(
        () => ({
            ids: savedIds,
            pending: withPending(
                new Map(),
                (sharedIds ?? []).filter((id) => !savedIds.includes(id)),
                "saving",
            ),
            confirmedAt: savedAt,
        }),
        [savedIds, sharedIds, savedAt],
    );

    // La lista de la página sin ese "Guardando...": la que se usa con la
    // pestaña ya en marcha (ver currentSnapshot). Objeto estable para
    // useSyncExternalStore
    const initialIdle = useMemo<Snapshot>(
        () =>
            initialSnapshot.pending.size > 0
                ? { ...initialSnapshot, pending: NO_PENDING }
                : initialSnapshot,
        [initialSnapshot],
    );

    const snapshot = useSyncExternalStore(
        subscribe,
        () => currentSnapshot(propertyId, initialSnapshot, initialIdle),
        () => initialSnapshot,
    );

    // En el servidor se da por hecho que sí: si el navegador las bloquea, el
    // botón desaparece al hidratar
    const available = useSyncExternalStore(
        subscribeNothing,
        () => navigator.cookieEnabled,
        () => true,
    );

    useEffect(() => {
        // Al montar, la pestaña adopta la lista de la página si no tenía
        // ninguna o si la suya es más antigua y no tiene nada en curso. Desde
        // aquí el "Guardando..." solo lo pone la pestaña: el del enlace en
        // initialSnapshot es para el primer pintado
        const stored = snapshots.get(propertyId);
        if (
            !stored ||
            (stored.pending.size === 0 &&
                stored.confirmedAt < initialIdle.confirmedAt)
        ) {
            setSnapshot(propertyId, initialIdle);
        }

        // Sin cookies no se puede guardar el enlace: se queda en la URL (si
        // recarga, lo sigue viendo) y sus sitios se enseñan en solo lectura
        // (getStatus: "shared")
        if (!navigator.cookieEnabled) return;

        // Enlace compartido: el de la URL actual (se lee de la URL y no de las
        // props porque al volver atrás Next puede reutilizar la página
        // pintada con ?saved=) más el que quedara pendiente en la pestaña.
        // Límite aceptado: si el huésped sale de la página antes de que
        // termine de cargar (p. ej. un enlace del banner de cookies en la
        // primera fracción de segundo), este efecto no llega a ejecutarse y
        // el enlace no se procesa; puede volver a abrirlo
        const raw = new URL(window.location.href).searchParams.get(
            SAVED_PLACES_SEARCH_PARAM,
        );

        // Sin saber qué ids son válidos, el enlace se queda en la URL y al
        // recargar se reintenta
        if (raw && sharedIds === null) return;

        // Se quita al montar, ya decidido qué hacer con él (ver
        // removeLinkFromUrl)
        if (raw) removeLinkFromUrl(raw);

        const fromUrl = raw ? (sharedIds ?? []) : [];
        const pendingIds = readPendingLink(propertyId);

        // Con un enlace ya guardado en esta pestaña no se repite (una sola
        // vez por pestaña); lo pendiente siempre se reintenta. Como mucho los
        // 50 que admite la API
        const urlKey = `${propertyId}:${serializeSavedPlaceIds(fromUrl)}`;
        const linkIds = Array.from(
            new Set([
                ...(appliedLinks.has(urlKey) ? [] : fromUrl),
                ...pendingIds,
            ]),
        ).slice(0, SAVED_PLACES_MAX);
        if (linkIds.length === 0) return;

        const linkKey = `${propertyId}:${serializeSavedPlaceIds(linkIds)}`;
        if (mergingLinks.has(linkKey)) return;

        // Todo lo que no está ya en la lista, sin tope: el servidor añade lo
        // que quepa sin desalojar nada y su respuesta trae la lista final
        const base = currentSnapshot(propertyId, initialSnapshot, initialIdle);
        const incoming = linkIds.filter((id) => !base.ids.includes(id));

        if (incoming.length === 0) {
            if (fromUrl.length > 0) appliedLinks.add(urlKey);
            clearPendingLink(propertyId, pendingIds);
            return;
        }

        mergingLinks.add(linkKey);
        writePendingLink(propertyId, linkIds);
        setSnapshot(propertyId, {
            ...base,
            pending: withPending(base.pending, incoming, "saving"),
        });

        enqueue(
            propertyId,
            { action: "merge", placeIds: linkIds },
            (result) => {
                const latest = currentSnapshot(
                    propertyId,
                    initialSnapshot,
                    initialIdle,
                );
                mergingLinks.delete(linkKey);

                setSnapshot(propertyId, {
                    ids: result.ok ? result.ids : latest.ids,
                    pending: withoutPending(latest.pending, incoming),
                    confirmedAt: result.ok ? result.at : latest.confirmedAt,
                });

                // Si falla, se queda pendiente en la pestaña y se reintenta
                // en la siguiente página de la guía: la URL no se vuelve a
                // tocar
                if (result.ok) {
                    if (fromUrl.length > 0) appliedLinks.add(urlKey);
                    clearPendingLink(propertyId, linkIds);
                }
            },
        );
    }, [propertyId, sharedIds, initialSnapshot, initialIdle]);

    const savedSet = useMemo(() => new Set(snapshot.ids), [snapshot.ids]);

    // Sin cookies, los sitios válidos del enlace se enseñan en solo lectura
    const sharedOnlySet = useMemo(
        () => new Set(available ? [] : (sharedIds ?? [])),
        [available, sharedIds],
    );

    const getStatus = useCallback(
        (placeId: string): SavedPlaceStatus => {
            if (sharedOnlySet.has(placeId) && !savedSet.has(placeId)) {
                return "shared";
            }
            return (
                snapshot.pending.get(placeId) ??
                (savedSet.has(placeId) ? "saved" : "unsaved")
            );
        },
        [snapshot.pending, savedSet, sharedOnlySet],
    );

    const toggleSaved = useCallback(
        (placeId: string) => {
            const base = currentSnapshot(
                propertyId,
                initialSnapshot,
                initialIdle,
            );

            // Mientras se guarda o se quita, no admite otro toque
            if (!available || base.pending.has(placeId)) return;

            const adding = !base.ids.includes(placeId);

            setSnapshot(propertyId, {
                ...base,
                pending: withPending(
                    base.pending,
                    [placeId],
                    adding ? "saving" : "removing",
                ),
            });

            enqueue(
                propertyId,
                { action: adding ? "add" : "remove", placeId },
                (result) => {
                    const latest = currentSnapshot(
                        propertyId,
                        initialSnapshot,
                        initialIdle,
                    );

                    // La lista solo cambia cuando el servidor confirma
                    setSnapshot(propertyId, {
                        ids: result.ok ? result.ids : latest.ids,
                        pending: withoutPending(latest.pending, [placeId]),
                        confirmedAt: result.ok
                            ? result.at
                            : latest.confirmedAt,
                    });
                },
            );
        },
        [propertyId, initialSnapshot, initialIdle, available],
    );

    // Con la lista de la página (o una más antigua) no hay ninguno: solo salen
    // los que la pestaña ha guardado después
    const unrenderedSavedIds = useMemo(
        () => snapshot.ids.filter((id) => !savedIds.includes(id)),
        [snapshot.ids, savedIds],
    );

    const value = useMemo(
        () => ({ available, getStatus, toggleSaved, unrenderedSavedIds }),
        [available, getStatus, toggleSaved, unrenderedSavedIds],
    );

    return (
        <SavedPlacesContext.Provider value={value}>
            {children}
        </SavedPlacesContext.Provider>
    );
};

export const useSavedPlaces = (): SavedPlacesContextProps => {
    const context = useContext(SavedPlacesContext);
    if (!context) {
        throw new Error(
            "useSavedPlaces must be used within a SavedPlacesProvider",
        );
    }
    return context;
};
