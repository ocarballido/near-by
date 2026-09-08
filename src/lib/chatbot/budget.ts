import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "@/lib/types";

const GLOBAL_MONTHLY_BUDGET_USD = Number(
    process.env.AI_GLOBAL_MONTHLY_BUDGET_USD ?? 15,
);
const PROPERTY_MONTHLY_BUDGET_USD = Number(
    process.env.AI_PROPERTY_MONTHLY_BUDGET_USD ?? 1.5,
);

type AiMonthlyCostRow = Pick<
    Tables<"ai_monthly_cost">,
    "scope_id" | "cost_usd"
>;

interface BudgetCheck {
    allowed: boolean;
    globalCostUsd: number;
    propertyCostUsd: number;
}

/**
 * Lectura pura, sin escritura: ¿queda presupuesto (global Y de esta
 * propiedad) para llamar al LLM ahora mismo? No necesita atomicidad porque
 * no modifica nada — solo el incremento posterior (incrementAiMonthlyCost,
 * en usage.ts) la necesita.
 */
export async function checkAiMonthlyBudget(
    db: SupabaseClient<Database>,
    propertyId: string,
): Promise<BudgetCheck | null> {
    const { data, error } = await db
        .from("ai_monthly_cost")
        .select("scope_id, cost_usd")
        .eq("month", firstDayOfCurrentMonthUtc())
        .in("scope_id", ["global", propertyId]);

    if (error) {
        console.error("chatbot budget check error:", error);
        return null; // el caller decide: lo tratamos como fail-closed
    }

    const globalCostUsd = findCost(data, "global");
    const propertyCostUsd = findCost(data, propertyId);

    return {
        allowed:
            globalCostUsd < GLOBAL_MONTHLY_BUDGET_USD &&
            propertyCostUsd < PROPERTY_MONTHLY_BUDGET_USD,
        globalCostUsd,
        propertyCostUsd,
    };
}

function findCost(rows: AiMonthlyCostRow[], scopeId: string): number {
    const row = rows.find((r) => r.scope_id === scopeId);
    // numeric de Postgres llega como string por PostgREST — el mismo motivo
    // por el que ya convertíamos en incrementAiMonthlyCost.
    return row ? Number(row.cost_usd) : 0;
}

function firstDayOfCurrentMonthUtc(): string {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");
    return `${year}-${month}-01`;
}
