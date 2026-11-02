"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import WelcomeTabsMenu, { TabKey } from "./menu";
import Typography from "@/components/atoms/typography";
import { PropertyDataPublicBySubCategory } from "@/components/templates/property-data-public";
import { useEvents } from "@/hooks/useEvents";
import { useSavedPlaces } from "@/lib/context/SavedPlacesContext";
import {
    SAVED_PLACES_SEARCH_PARAM,
    serializeSavedPlaceIds,
} from "@/utils/saved-places";
import EventsTab from "./event-tab";

// Carga diferida, como en el Footer: react-share solo se descarga si el
// huésped abre el tab de guardados
const ShareMenu = dynamic(() =>
    import("@/components/molecules/button-share").then((mod) => mod.ShareMenu),
);

type PublicItem = {
    id: string;
    name: string;
    address: string;
    description?: string;
    image_url?: string;
    latitude?: number;
    longitude?: number;
    type?: "info" | "location";
    featured?: boolean;
    must_visit?: boolean;
};

type Group = {
    sub_category_id: string;
    sub_category_name: string;
    category_id: string | null;
    icon: string | null;
    items: PublicItem[];
};

type FlatItem = PublicItem & {
    sub_category_name: string;
    category_id: string | null;
    icon: string | null;
};

type Props = {
    propertyId: string;
    anonId: string;
    lat: number;
    lng: number;
    categoryId: string;
    featuredGroups: Group[];
    mustVisitGroups: Group[];
    savedGroups: Group[];
    // Se llega por un enlace compartido: se abre directamente en "Guardados"
    openSaved: boolean;
    labels: {
        featuredTab: string;
        mustVisitTab: string;
        savedTab: string;
        savedShareTitle: string;
        savedShareWhatsapp: string;
        eventsTab: string;
        featuredHeading?: string;
        mustVisitHeading?: string;
    };
};

const isDefined = <T,>(v: T | null | undefined): v is T => v != null;

const flattenGroups = (groups: Group[]): FlatItem[] =>
    groups.flatMap((group) =>
        group.items.map((item) => ({
            ...item,
            sub_category_name: group.sub_category_name,
            category_id: group.category_id,
            icon: group.icon,
        })),
    );

export default function WelcomeTabs({
    propertyId,
    anonId,
    lat,
    lng,
    featuredGroups,
    mustVisitGroups,
    savedGroups,
    openSaved,
    labels,
}: Props) {
    const { isSaved } = useSavedPlaces();

    const featuredItems = flattenGroups(featuredGroups);
    const mustVisitItems = flattenGroups(mustVisitGroups);

    // Los del servidor más los destacados, para que lo que se guarda o se
    // quita aquí mismo se refleje al momento; sin duplicados
    const savedItems = [
        ...flattenGroups(savedGroups),
        ...featuredItems,
        ...mustVisitItems,
    ].filter(
        (item, index, all) =>
            isSaved(item.id) &&
            all.findIndex((other) => other.id === item.id) === index,
    );

    // Sin locale: el middleware abre la guía en el idioma de quien lo recibe.
    // Solo los ids que se ven en el tab, no los que no resuelven
    const savedShareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/public/${propertyId}/welcome/highlights?${SAVED_PLACES_SEARCH_PARAM}=${serializeSavedPlaceIds(savedItems.map((item) => item.id))}`;

    const hasFeatured = (featuredGroups?.length ?? 0) > 0;
    const hasMustVisit = (mustVisitGroups?.length ?? 0) > 0;
    const hasSaved = savedItems.length > 0;
    const hasHighlights = hasFeatured || hasMustVisit || hasSaved;

    const eventsState = useEvents(lat, lng);
    const { events, loading, error, manualRadius } = eventsState;

    // Hay eventos si la búsqueda automática encontró alguno. Si el huésped
    // ya cambió el radio a mano, se mantienen aunque ese radio salga vacío
    // (verá el mensaje de vacío en lugar de perder la sección)
    const hasEvents =
        manualRadius !== null || (!loading && !error && events.length > 0);

    const defaultTab = (): TabKey => {
        if (openSaved && hasSaved) return "saved";
        if (hasFeatured) return "featured";
        if (hasMustVisit) return "must_visit";
        if (hasSaved) return "saved";
        return "events";
    };

    const [tab, setTab] = useState<TabKey>(defaultTab);

    // Sin destacados no hay pestañas: solo eventos (con su carga) o nada
    if (!hasHighlights) {
        return loading || hasEvents ? (
            <div className="flex flex-col gap-4 w-full max-w-[1140px] mx-auto px-4 py-10">
                <EventsTab eventsState={eventsState} />
            </div>
        ) : null;
    }

    const tabs = [
        hasFeatured
            ? {
                  key: "featured" as const,
                  label: labels.featuredTab,
                  count: featuredGroups.reduce(
                      (acc, g) => acc + g.items.length,
                      0,
                  ),
              }
            : null,
        hasMustVisit
            ? {
                  key: "must_visit" as const,
                  label: labels.mustVisitTab,
                  count: mustVisitGroups.reduce(
                      (acc, g) => acc + g.items.length,
                      0,
                  ),
              }
            : null,
        hasSaved
            ? {
                  key: "saved" as const,
                  label: labels.savedTab,
                  count: savedItems.length,
              }
            : null,
        hasEvents ? { key: "events" as const, label: labels.eventsTab } : null,
    ].filter(isDefined);

    // Si el tab activo desaparece (p. ej. se quita el último guardado), se
    // muestra el primero que quede
    const activeTab = tabs.some((item) => item.key === tab)
        ? tab
        : tabs[0].key;

    return (
        <div className="flex flex-col gap-4 w-full max-w-[1140px] mx-auto px-4 py-10">
            <WelcomeTabsMenu value={activeTab} onChange={setTab} tabs={tabs} />

            {activeTab === "events" && hasEvents && (
                <EventsTab eventsState={eventsState} />
            )}

            {activeTab === "featured" && hasFeatured && (
                <PropertyDataPublicBySubCategory
                    propertyData={featuredItems}
                    lat={lat}
                    lng={lng}
                    type="location"
                    showBadge
                />
            )}

            {activeTab === "must_visit" && hasMustVisit && (
                <PropertyDataPublicBySubCategory
                    propertyData={mustVisitItems}
                    lat={lat}
                    lng={lng}
                    type="location"
                    showBadge
                />
            )}

            {activeTab === "saved" && hasSaved && (
                <div className="flex flex-col gap-6">
                    <PropertyDataPublicBySubCategory
                        propertyData={savedItems}
                        lat={lat}
                        lng={lng}
                        type="location"
                        showBadge
                    />
                    <div className="flex flex-col items-center gap-2 text-center">
                        <Typography
                            size="sm"
                            weight="medium"
                            color="text-gray-600"
                        >
                            {labels.savedShareTitle}
                        </Typography>
                        <ShareMenu
                            url={savedShareUrl}
                            surface="public_saved_places"
                            distinctId={anonId}
                            whatsappText={labels.savedShareWhatsapp}
                            props={{
                                property_id: propertyId,
                                saved_count: savedItems.length,
                            }}
                            className="w-fit"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
