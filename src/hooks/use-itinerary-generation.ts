"use client";

import { useCallback, useState } from "react";
import { fetchNearbyPOIs } from "@/lib/fetcher-nearby";
import { itinerarySchema, type Itinerary } from "@/types/itinerary";

type GenerateItineraryParams = {
    lat: number;
    lng: number;
    preferences: string;
    duration: string;
    transport: string;
    locale: string;
};

type ItineraryGenerationStatus = "idle" | "loading" | "success" | "error";

type GenerateItinerarySuccessResponse = {
    success: true;
    itinerary: unknown;
};

type UseItineraryGenerationResult = {
    status: ItineraryGenerationStatus;
    itinerary: Itinerary | null;
    error: string | null;
    generateItinerary: (params: GenerateItineraryParams) => Promise<void>;
};

function isGenerateItinerarySuccessResponse(
    value: unknown,
): value is GenerateItinerarySuccessResponse {
    if (typeof value !== "object" || value === null) return false;

    const candidate = value as Record<string, unknown>;

    return candidate.success === true && "itinerary" in candidate;
}

export function useItineraryGeneration(): UseItineraryGenerationResult {
    const [status, setStatus] = useState<ItineraryGenerationStatus>("idle");
    const [itinerary, setItinerary] = useState<Itinerary | null>(null);
    const [error, setError] = useState<string | null>(null);

    const generateItinerary = useCallback(
        async ({
            lat,
            lng,
            preferences,
            duration,
            transport,
            locale,
        }: GenerateItineraryParams) => {
            setStatus("loading");
            setError(null);

            try {
                const poiList = await fetchNearbyPOIs({
                    lat,
                    lng,
                    preferences: [preferences],
                    language: locale,
                });

                const response = await fetch("/api/custom-plan", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        location: `${lat},${lng}`,
                        preferences: [preferences],
                        duration,
                        transport,
                        poiList,
                        locale,
                    }),
                });

                const result: unknown = await response.json();

                if (!isGenerateItinerarySuccessResponse(result)) {
                    throw new Error("Itinerary generation failed");
                }

                const parsedItinerary = itinerarySchema.safeParse(
                    result.itinerary,
                );

                if (!parsedItinerary.success) {
                    throw new Error(
                        "Itinerary response did not match expected schema",
                    );
                }

                setItinerary(parsedItinerary.data);
                setStatus("success");
            } catch (caughtError) {
                console.error("useItineraryGeneration error:", caughtError);
                setError("Hubo un problema al generar el itinerario");
                setStatus("error");
            }
        },
        [],
    );

    return { status, itinerary, error, generateItinerary };
}
