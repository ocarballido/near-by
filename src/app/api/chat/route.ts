// app/api/chat/route.ts
import { createServerAdminClient } from "@/lib/supabase/serverAdminClient";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types";
import { detectIntent } from "@/lib/chatbot";
import type {
    PropertyDataRow,
    ChatbotMessages,
    PropertySchedule,
} from "@/lib/chatbot";
import {
    buildResponse,
    buildDetailResponse,
    buildMapsFooter,
    type ResponseKind,
} from "@/lib/chatbot/build-response";
import { INTENTS, type IntentType } from "@/lib/chatbot/intents";
import { getTranslations } from "next-intl/server";

import { resolveActiveTimeWindow } from "@/lib/chatbot/timeWindow";
import { resolveChatbotAccess } from "@/lib/chatbot/access";
import { fetchAvailableCategories } from "@/lib/chatbot/llm/availableCategories";
import { resolveResponseKind, OFF_TOPIC_VALUE } from "@/lib/chatbot/llm/schema";
import { classifyIntent } from "@/lib/chatbot/llm/classify";
import { generateGroundedReply } from "@/lib/chatbot/llm/generateReply";
import { calculateCostUsd } from "@/lib/chatbot/llm/pricing";
import { LLM_MODEL } from "@/lib/chatbot/llm/client";
import { incrementAiMonthlyCost } from "@/lib/chatbot/usage";

const MAX_MESSAGE_LENGTH = 300;

interface ChatRequestBody {
    message: string;
    propertyId: string;
    locale?: string;
    anonId?: string;
    timezone?: string;
    history?: { role: "user" | "bot"; text: string }[];
}

export async function POST(req: Request) {
    try {
        const {
            message,
            propertyId,
            locale,
            anonId,
            timezone,
            history,
        }: ChatRequestBody = await req.json();

        if (!message || !propertyId) {
            return Response.json(
                { reply: "Missing request data." },
                { status: 400 },
            );
        }
        if (message.length > MAX_MESSAGE_LENGTH) {
            return Response.json(
                { reply: "Message too long." },
                { status: 413 },
            );
        }

        const t = await getTranslations({
            locale: locale ?? "es",
            namespace: "GuestChat",
        });

        const messages: ChatbotMessages = {
            infoNotFound: t("infoNotFound"),
            locationsNotFound: t("locationsNotFound"),
            locationsPrefix: t("locationsPrefix"),
            fallback: t("fallback"),
            scheduleNotFound: t("scheduleNotFound"),
            checkIn: t("checkIn"),
            checkOut: t("checkOut"),
            featuredNotFound: t("featuredNotFound"),
            mustVisitNotFound: t("mustVisitNotFound"),
            featuredPrefix: t("featuredPrefix"),
            mustVisitPrefix: t("mustVisitPrefix"),
        };

        const supabase = await createServerAdminClient();
        const db = supabase as unknown as SupabaseClient<Database>;

        // 1) Vía determinista existente — coste cero, siempre se intenta primero.
        const keywordIntent = detectIntent(message);
        if (keywordIntent !== null) {
            return await resolveDeterministicReply(
                db,
                propertyId,
                keywordIntent,
                messages,
                t,
            );
        }

        if (!anonId) {
            return Response.json({ reply: t("fallback") });
        }

        // 2) Único punto de decisión: kill-switch + límite diario + presupuesto.
        const access = await resolveChatbotAccess(db, propertyId, anonId);
        if (!access.allowed) {
            console.info("chatbot access denied:", {
                propertyId,
                reason: access.reason,
            });
            return Response.json({ reply: t("fallback") });
        }

        const propertyName = await getPropertyName(db, propertyId);

        // 3) Qué tiene esta propiedad REALMENTE configurado — el esquema
        //    del clasificador se construye a partir de esto, nunca de una
        //    lista fija.
        const availableCategories = await fetchAvailableCategories(
            db,
            propertyId,
        );

        const activeWindow = timezone
            ? resolveActiveTimeWindow(timezone)
            : null;

        const classifyResult = await classifyIntent({
            message,
            propertyName,
            history: (history ?? []).map((h) => ({
                role:
                    h.role === "bot"
                        ? ("assistant" as const)
                        : ("user" as const),
                text: h.text,
            })),
            available: availableCategories,
            activeWindow,
        });

        if (!classifyResult) {
            return Response.json({ reply: t("fallback") });
        }

        await incrementAiMonthlyCost(
            db,
            propertyId,
            calculateCostUsd(LLM_MODEL, classifyResult.usage),
        );

        const classifiedValue = classifyResult.classification.intent;

        if (classifiedValue === OFF_TOPIC_VALUE) {
            return Response.json({ reply: t("butlerFallback") });
        }

        const responseKind = resolveResponseKind(
            classifiedValue,
            availableCategories,
        );
        if (responseKind === null) {
            // Defensivo: el esquema solo permite valores que
            // resolveResponseKind sabe interpretar, así que esto no
            // debería ocurrir nunca — pero si ocurre, mejor un fallback
            // silencioso que un error visible para el huésped.
            console.error(
                "chatbot: valor clasificado sin ResponseKind:",
                classifiedValue,
            );
            return Response.json({ reply: t("fallback") });
        }

        // Contenido ya redactado por el propietario (property_details) —
        // se sirve tal cual, sin generar ni consultar property_data.
        if (responseKind === "detail") {
            const { data: detail } = await db
                .from("property_details")
                .select("name, guidelines, instructions")
                .eq("id", classifiedValue)
                .eq("property_id", propertyId)
                .maybeSingle();

            return Response.json({
                reply: buildDetailResponse(detail, messages),
            });
        }

        const rowsResult = await fetchRowsForResponseKind(
            db,
            propertyId,
            responseKind,
            classifiedValue,
        );

        if (rowsResult.error) {
            console.error("chatbot query error:", rowsResult.error);
            return Response.json({ reply: t("serverError") }, { status: 500 });
        }

        const rows = (rowsResult.data ?? []) as PropertyDataRow[];

        let schedule: PropertySchedule | null = null;
        if (responseKind === "schedule") {
            const { data } = await db
                .from("properties")
                .select(
                    "check_in_time, check_in_date, check_out_time, check_out_date",
                )
                .eq("id", propertyId)
                .single();
            schedule = data as PropertySchedule | null;
        }

        if (responseKind !== "schedule" && rows.length === 0) {
            return Response.json({
                reply: buildResponse(responseKind, rows, messages),
            });
        }

        if (
            responseKind === "schedule" ||
            responseKind === "featured" ||
            responseKind === "must_visit"
        ) {
            // Datos exactos (horario) o colecciones curadas por el
            // propietario (featured/must_visit) — se resuelven siempre con
            // la plantilla determinista, no con redacción natural.
            return Response.json({
                reply: buildResponse(
                    responseKind,
                    rows,
                    messages,
                    schedule ?? undefined,
                ),
            });
        }

        // info | location, con datos: aquí sí tiene sentido redactar.
        const generateResult = await generateGroundedReply({
            message,
            propertyName,
            facts: rows,
            locale: locale ?? "es",
        });

        if (!generateResult) {
            return Response.json({
                reply: buildResponse(responseKind, rows, messages),
            });
        }

        await incrementAiMonthlyCost(
            db,
            propertyId,
            calculateCostUsd(LLM_MODEL, generateResult.usage),
        );

        // Solo se enlaza lo que el modelo mencionó de verdad en su
        // respuesta — si descartó una fila (como en el caso "ningún hecho
        // encaja"), no debe aparecer un botón de "cómo llegar" contradiciendo
        // ese mensaje.
        const mentionedRows = rows.filter(
            (r) => r.name && generateResult.text.includes(r.name),
        );

        return Response.json({
            reply: generateResult.text + buildMapsFooter(mentionedRows),
        });
    } catch (e) {
        console.error("chatbot route error:", e);
        return Response.json(
            { reply: "Internal server error." },
            { status: 500 },
        );
    }
}

// Punto de entrada único para las filas de property_data, usado tanto por
// la vía por keywords como por la vía LLM — la única diferencia entre
// ambas es de dónde sale el subCategoryId (de INTENTS en un caso, del
// propio valor clasificado en el otro).
function fetchRowsForResponseKind(
    db: SupabaseClient<Database>,
    propertyId: string,
    responseKind: ResponseKind,
    subCategoryId: string,
) {
    if (responseKind === "featured" || responseKind === "must_visit") {
        return db
            .from("property_data")
            .select(
                "name, description, type, sub_category_id, featured, must_visit, address, latitude, longitude",
            )
            .eq("property_id", propertyId)
            .eq("type", "location")
            .eq(responseKind, true);
    }

    // 'schedule' guarda su texto libre bajo type='info', igual que
    // cualquier otra subcategoría informativa — el dato ESTRUCTURADO del
    // horario se trae aparte, desde `properties`, no de aquí.
    const dbType = responseKind === "location" ? "location" : "info";

    return db
        .from("property_data")
        .select(
            "name, description, type, sub_category_id, address, latitude, longitude",
        )
        .eq("property_id", propertyId)
        .eq("sub_category_id", subCategoryId)
        .eq("type", dbType);
}

function intentTypeToResponseKind(intent: IntentType): ResponseKind {
    if (intent === "FEATURED") return "featured";
    if (intent === "MUST_VISIT") return "must_visit";
    if (intent === "SCHEDULE") return "schedule";
    return INTENTS[intent].kind;
}

async function resolveDeterministicReply(
    db: SupabaseClient<Database>,
    propertyId: string,
    intent: IntentType,
    messages: ChatbotMessages,
    t: Awaited<ReturnType<typeof getTranslations>>,
): Promise<Response> {
    const responseKind = intentTypeToResponseKind(intent);
    const subCategoryId = INTENTS[intent].subCategoryId;

    const [rowsResult, scheduleResult] = await Promise.all([
        fetchRowsForResponseKind(db, propertyId, responseKind, subCategoryId),
        responseKind === "schedule"
            ? db
                  .from("properties")
                  .select(
                      "check_in_time, check_in_date, check_out_time, check_out_date",
                  )
                  .eq("id", propertyId)
                  .single()
            : Promise.resolve({ data: null, error: null }),
    ]);

    if (rowsResult.error) {
        console.error("chatbot query error:", rowsResult.error);
        return Response.json({ reply: t("serverError") }, { status: 500 });
    }

    const rows = (rowsResult.data ?? []) as PropertyDataRow[];
    const schedule = scheduleResult.data as PropertySchedule | null;

    return Response.json({
        reply: buildResponse(
            responseKind,
            rows,
            messages,
            schedule ?? undefined,
        ),
    });
}

async function getPropertyName(
    db: SupabaseClient<Database>,
    propertyId: string,
): Promise<string> {
    const { data } = await db
        .from("properties")
        .select("name")
        .eq("id", propertyId)
        .single();
    return data?.name ?? "esta propiedad";
}
