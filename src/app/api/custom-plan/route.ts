import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { getPrompt } from "@/config/prompt";
import { itinerarySchema } from "@/types/itinerary";
import type { POI } from "@/lib/fetcher-nearby";

type GenerateItineraryRequestBody = {
    location: string;
    preferences: string[];
    duration: string;
    transport: string;
    poiList: POI[];
    locale: string;
};

const ITINERARY_MODEL = "gpt-4o-mini";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function isGenerateItineraryRequestBody(
    body: unknown,
): body is GenerateItineraryRequestBody {
    if (typeof body !== "object" || body === null) return false;

    const candidate = body as Record<string, unknown>;

    return (
        typeof candidate.location === "string" &&
        Array.isArray(candidate.preferences) &&
        typeof candidate.duration === "string" &&
        typeof candidate.transport === "string" &&
        Array.isArray(candidate.poiList) &&
        typeof candidate.locale === "string"
    );
}

export async function POST(req: NextRequest) {
    let body: unknown;

    try {
        body = await req.json();
    } catch {
        return NextResponse.json(
            { success: false, error: "Invalid JSON body" },
            { status: 400 },
        );
    }

    if (!isGenerateItineraryRequestBody(body)) {
        return NextResponse.json(
            { success: false, error: "Missing or invalid required fields" },
            { status: 400 },
        );
    }

    const { location, preferences, duration, transport, poiList, locale } =
        body;

    const prompt = getPrompt(locale, {
        location,
        duration,
        preferences,
        transport,
        poiList,
    });

    try {
        const response = await openai.responses.parse({
            model: ITINERARY_MODEL,
            input: [
                {
                    role: "system",
                    content:
                        "You are a helpful travel assistant that generates practical, well-organized itineraries strictly grounded in the places provided by the user.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            text: {
                format: zodTextFormat(itinerarySchema, "itinerary"),
            },
        });

        if (!response.output_parsed) {
            console.error("Itinerary generation returned no parsed output");
            return NextResponse.json(
                { success: false, error: "Itinerary generation was refused" },
                { status: 422 },
            );
        }

        return NextResponse.json({
            success: true,
            itinerary: response.output_parsed,
        });
    } catch (error) {
        console.error("Itinerary generation error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Internal server error generating itinerary",
            },
            { status: 500 },
        );
    }
}
