import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types";
import { incrementChatbotDailyUsage } from "./usage";
import { checkAiMonthlyBudget } from "./budget";

const LLM_ENABLED = process.env.CHATBOT_LLM_ENABLED === "true";
const DAILY_MESSAGE_LIMIT = Number(
    process.env.CHATBOT_DAILY_MESSAGE_LIMIT ?? 10,
);

interface ChatbotAccessResult {
    allowed: boolean;
    // Solo para vuestros logs de servidor (console.info/error) — no se
    // persiste ni se muestra a nadie, ni huésped ni propietario, tal como
    // decidisteis.
    reason: "kill_switch" | "daily_limit" | "monthly_budget" | "ok";
}

/**
 * Único punto de decisión de si este huésped puede usar el LLM del chatbot
 * ahora mismo, para esta propiedad. Hoy solo mira el kill-switch y los dos
 * presupuestos (día y mes) — es el hueco que dejamos preparado para que,
 * el día que exista facturación, el interior de esta función también
 * consulte el plan (FREE/PREMIUM/...) sin que nada fuera de aquí se entere
 * del cambio.
 */
export async function resolveChatbotAccess(
    db: SupabaseClient<Database>,
    propertyId: string,
    anonId: string,
): Promise<ChatbotAccessResult> {
    if (!LLM_ENABLED) {
        return { allowed: false, reason: "kill_switch" };
    }

    // Se incrementa aquí, no se lee: el contador diario cuenta intentos de
    // escalar al LLM, y el intento ya se está produciendo — el resultado
    // del presupuesto mensual todavía no se conoce en este punto.
    const daily = await incrementChatbotDailyUsage(db, propertyId, anonId);
    if (!daily || daily.messageCount > DAILY_MESSAGE_LIMIT) {
        return { allowed: false, reason: "daily_limit" };
    }

    const budget = await checkAiMonthlyBudget(db, propertyId);
    if (!budget || !budget.allowed) {
        return { allowed: false, reason: "monthly_budget" };
    }

    return { allowed: true, reason: "ok" };
}
