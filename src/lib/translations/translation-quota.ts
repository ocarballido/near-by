// Sin "server-only": también lo importan los scripts de migración de
// traducciones (Node vía tsx), donde ese módulo no existe. La clave de
// service role no lleva NEXT_PUBLIC_, así que nunca llega al cliente.
import { createServerAdminClient } from "@/lib/supabase/serverAdminClient";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types";

// Mismo patrón que el resto de acciones con cliente admin: tipado como
// SupabaseClient<Database> para que rpc() resuelva los argumentos
async function adminDb() {
    return (await createServerAdminClient()) as unknown as SupabaseClient<Database>;
}

// Cuota de traducción con IA (funciones de la migración
// 20261025172421_translation_quota_and_atomic_upsert).
// Límites fijados con datos de prod (2026-10-25):
// - Global: el mes con más uso fueron 348k caracteres (cargas masivas).
// - Por anfitrión y día: máximo 12.093, p99 7.538, mediana 1.575. El alta de
//   una propiedad (información + sitios automáticos) cabe con margen; la
//   edición repetida para gastar cuota, no.
// Con max_tokens proporcional (translate-with-claude.ts), limitar los
// caracteres de entrada acota también la salida.
const MONTHLY_CHAR_LIMIT = 500_000;
const DAILY_USER_CHAR_LIMIT = 30_000;

// Reserva cupo global y del usuario antes de llamar al LLM. Si la BD falla,
// no se traduce (fail closed).
export async function reserveTranslationQuota(
    userId: string,
    chars: number,
): Promise<boolean> {
    const db = await adminDb();

    const { data, error } = await db.rpc("reserve_translation_quota", {
        p_user_id: userId,
        p_chars: chars,
        p_monthly_limit: MONTHLY_CHAR_LIMIT,
        p_daily_limit: DAILY_USER_CHAR_LIMIT,
    });

    if (error) {
        console.error("[translationQuota] Error reservando cuota:", error);
        return false;
    }

    if (!data) {
        console.warn(
            "[translationQuota] Sin cupo de traducción (global o del usuario)",
        );
    }

    return data === true;
}

// Tokens reales tras la llamada. La traducción ya está hecha: un fallo aquí
// solo se registra.
export async function recordTranslationTokens(
    userId: string,
    usage: { inputTokens: number; outputTokens: number },
): Promise<void> {
    const db = await adminDb();

    const { error } = await db.rpc("record_translation_tokens", {
        p_user_id: userId,
        p_input_tokens: usage.inputTokens,
        p_output_tokens: usage.outputTokens,
    });

    if (error) {
        console.error("[translationQuota] Error registrando tokens:", error);
    }
}

// Tokens de los procesos del operador (scripts de migración): solo contador
// global y sin reserva previa (migración 20261025174026), para que un
// backfill de idioma no consuma el cupo mensual de los anfitriones.
export async function recordSystemTranslationTokens(usage: {
    inputTokens: number;
    outputTokens: number;
}): Promise<void> {
    const db = await adminDb();

    const { error } = await db.rpc("record_system_translation_tokens", {
        p_input_tokens: usage.inputTokens,
        p_output_tokens: usage.outputTokens,
    });

    if (error) {
        console.error(
            "[translationQuota] Error registrando tokens de sistema:",
            error,
        );
    }
}
