"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import {
    SAVED_PLACES_MAX,
    SAVED_PLACES_MAX_AGE,
    SAVED_PLACES_SEARCH_PARAM,
    getSavedPlacesCookieName,
    serializeSavedPlaceIds,
} from "@/utils/saved-places";

type SavedPlacesContextProps = {
    savedIds: string[];
    isSaved: (placeId: string) => boolean;
    toggleSaved: (placeId: string) => void;
};

type SavedPlacesProviderProps = {
    propertyId: string;
    // Los lee el servidor (cookie + enlace compartido): las cards se pintan
    // ya en su estado, sin salto al hidratar
    initialIds: string[];
    children: ReactNode;
};

const SavedPlacesContext = createContext<SavedPlacesContextProps | undefined>(
    undefined,
);

const writeSavedPlacesCookie = (propertyId: string, ids: string[]) => {
    const name = getSavedPlacesCookieName(propertyId);
    const secure = window.location.protocol === "https:" ? "; secure" : "";

    // Sin guardados se borra: no dejamos cookies vacías por cada guía visitada
    document.cookie =
        ids.length > 0
            ? `${name}=${serializeSavedPlaceIds(ids)}; path=/; max-age=${SAVED_PLACES_MAX_AGE}; samesite=lax${secure}`
            : `${name}=; path=/; max-age=0; samesite=lax${secure}`;
};

export const SavedPlacesProvider = ({
    propertyId,
    initialIds,
    children,
}: SavedPlacesProviderProps) => {
    const [savedIds, setSavedIds] = useState<string[]>(initialIds);

    // También corre al montar: así queda persistido lo que llega por un
    // enlace compartido (el servidor ya lo ha sumado a initialIds)
    useEffect(() => {
        writeSavedPlacesCookie(propertyId, savedIds);
    }, [propertyId, savedIds]);

    // Ya persistido lo del enlace compartido, se quita de la URL: si no, al
    // recargar volvería lo que el huésped haya quitado. replaceState no
    // provoca navegación ni vuelve a pedir la página
    useEffect(() => {
        const url = new URL(window.location.href);
        if (!url.searchParams.has(SAVED_PLACES_SEARCH_PARAM)) return;

        url.searchParams.delete(SAVED_PLACES_SEARCH_PARAM);
        window.history.replaceState(window.history.state, "", url);
    }, []);

    const savedSet = useMemo(() => new Set(savedIds), [savedIds]);

    const isSaved = useCallback(
        (placeId: string) => savedSet.has(placeId),
        [savedSet],
    );

    // Al llegar al tope se descarta el más antiguo en lugar de bloquear
    const toggleSaved = useCallback((placeId: string) => {
        setSavedIds((prev) =>
            prev.includes(placeId)
                ? prev.filter((id) => id !== placeId)
                : [...prev, placeId].slice(-SAVED_PLACES_MAX),
        );
    }, []);

    const value = useMemo(
        () => ({ savedIds, isSaved, toggleSaved }),
        [savedIds, isSaved, toggleSaved],
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
