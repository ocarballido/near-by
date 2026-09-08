// app/actions/generate-ai-content/generate-info.ts
"use server";

import { createSSRClient } from "@/lib/supabase/server";
import { createServerAdminClient } from "@/lib/supabase/serverAdminClient";
import { DAILY_AI_USAGE_LIMMIT } from "@/config/config-constants";

import { openai, LLM_MODEL } from "@/lib/chatbot/llm/client";
import { checkAiMonthlyBudget } from "@/lib/chatbot/budget";
import { incrementAiMonthlyCost } from "@/lib/chatbot/usage";
import { calculateCostUsd } from "@/lib/chatbot/llm/pricing";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert, TablesUpdate } from "@/lib/types";

type AIUsageRow = Tables<"ai_usage">;
type AIUsageInsert = TablesInsert<"ai_usage">;
type AIUsageUpdate = TablesUpdate<"ai_usage">;

const SYSTEM_PROMPT = `
Responde como un asistente que ayuda a propietarios a redactar contenido útil, amable y claro para sus alojamientos.

Instrucciones:
- No uses emojis ni símbolos de banderas.
- Evita frases en el encabezado como: Aqui tienes la respuesta..., ve directo al texto generado".
- Usa un lenguaje neutral, sencillo y directo.
- Separa cada actividad con un salto de línea.
- Termina con una frase amable y neutral, sin exageraciones.
- No uses notación Markdown como **negritas** o _cursivas_ en el texto. Usa solo texto plano.
`;

export const generateAIContent = async (prompt: string, propertyId: string) => {
    try {
        // 1) Autenticación con cookies del usuario — sin cambios
        const ssrClient = await createSSRClient();
        const {
            data: { user },
            error: authError,
        } = await ssrClient.auth.getUser();

        if (authError || !user) {
            return { error: "No estás autenticado" };
        }

        const supabase = await createServerAdminClient();
        const db = supabase as unknown as SupabaseClient<Database>;

        // 2) Límite diario por propietario — misma tabla, misma lógica de
        // siempre. No se toca: es un guardarraíl distinto del presupuesto
        // mensual de abajo, y sigue siendo válido tal cual.
        const today = new Date().toISOString().split("T")[0];

        const usageResp = await db
            .from("ai_usage")
            .select("*")
            .eq("user_id", user.id)
            .eq("date", today)
            .maybeSingle();

        let usage = usageResp.data as Tables<"ai_usage"> | null;

        if (!usage) {
            const payload: AIUsageInsert = {
                user_id: user.id,
                count: 1,
            };

            const { data: created } = await db
                .from("ai_usage")
                .insert(payload)
                .select()
                .single();

            usage = created as AIUsageRow | null;
        } else if (usage.count >= DAILY_AI_USAGE_LIMMIT) {
            return { error: "Límite diario de IA alcanzado" };
        } else {
            const updatePayload: AIUsageUpdate = {
                count: usage.count + 1,
            };

            await db.from("ai_usage").update(updatePayload).eq("id", usage.id);
        }

        // 3) Presupuesto mensual — el mismo guardarraíl que usa el chatbot,
        // compartido entre las dos features. Se comprueba ANTES de gastar
        // nada; el coste real se registra después, con los tokens que
        // devuelva la propia respuesta.
        const budget = await checkAiMonthlyBudget(db, propertyId);
        if (!budget || !budget.allowed) {
            return {
                error: "Se ha alcanzado el límite mensual de generación con IA. Vuelve a intentarlo el próximo mes.",
            };
        }

        // 4) Llamada a OpenAI — SDK + Responses API, mismo modelo que el
        // chatbot. reasoning: "none" porque es una tarea de redacción
        // simple, sin necesidad de razonar (y evita el corte silencioso de
        // tokens que ya vimos con el chatbot).
        const response = await openai.responses.create({
            model: LLM_MODEL,
            input: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: prompt },
            ],
            reasoning: { effort: "none" },
            max_output_tokens: 500,
        });

        const content = response.output_text?.trim();

        if (!content) {
            return { error: "No se pudo generar contenido" };
        }

        await incrementAiMonthlyCost(
            db,
            propertyId,
            calculateCostUsd(LLM_MODEL, {
                inputTokens: response.usage?.input_tokens ?? 0,
                outputTokens: response.usage?.output_tokens ?? 0,
            }),
        );

        return { content };
    } catch (error: unknown) {
        console.error("generateAIContent error:", error);
        return {
            error: "Ocurrió un error inesperado generando el contenido",
        };
    }
};
