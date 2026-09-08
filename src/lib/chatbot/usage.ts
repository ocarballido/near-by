import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types";

interface DailyUsageResult {
    messageCount: number;
}

/**
 * Incrementa en un único paso atómico el contador de mensajes que han
 * escalado al LLM, para este huésped y esta propiedad, hoy. La comparación
 * contra el límite vive en quien llame a esta función — aquí solo se
 * reporta el recuento resultante.
 */
export async function incrementChatbotDailyUsage(
    db: SupabaseClient<Database>,
    propertyId: string,
    anonId: string,
): Promise<DailyUsageResult | null> {
    const { data, error } = await db.rpc("increment_chatbot_daily_usage", {
        p_property_id: propertyId,
        p_anon_id: anonId,
    });

    if (error || data === null) {
        console.error("chatbot daily usage increment error:", error);
        return null;
    }

    return { messageCount: data };
}

interface MonthlyCostIncrement {
    globalCostUsd: number;
    propertyCostUsd: number;
}

/**
 * Incrementa en un único paso atómico el coste real acumulado, a nivel
 * global y de esta propiedad a la vez. Se llama SIEMPRE después de la
 * respuesta del LLM, nunca antes — el coste real solo se conoce entonces.
 */
export async function incrementAiMonthlyCost(
    db: SupabaseClient<Database>,
    propertyId: string,
    amountUsd: number,
): Promise<MonthlyCostIncrement | null> {
    const { data, error } = await db.rpc("increment_ai_monthly_cost", {
        p_property_id: propertyId,
        p_amount_usd: amountUsd,
    });

    if (error || !data || data.length === 0) {
        console.error("chatbot monthly cost increment error:", error);
        return null;
    }

    const [row] = data;

    // Postgres devuelve las columnas `numeric` como string en el JSON (para
    // no perder precisión) — ya lo vimos en los resultados del propio
    // Studio hace un momento ("0.001500", entre comillas). Se convierte
    // aquí, en el único sitio de todo el código que toca este dato crudo.
    return {
        globalCostUsd: Number(row.global_cost_usd),
        propertyCostUsd: Number(row.property_cost_usd),
    };
}
