// Precios de OpenAI en USD por cada 1M de tokens (tier estándar, sin
// caché — así el cálculo es conservador: el coste real con caché nunca
// será mayor que esto).
const MODEL_PRICING_PER_MILLION_TOKENS: Record<
    string,
    { input: number; output: number }
> = {
    "gpt-5.6-luna": { input: 0.2, output: 1.2 },
};

const FALLBACK_PRICING = { input: 0.2, output: 1.2 }; // mismo tier que Luna

export interface TokenUsage {
    inputTokens: number;
    outputTokens: number;
}

/**
 * Convierte el consumo real de tokens (siempre el que devuelve la propia
 * respuesta de OpenAI, nunca una estimación previa) a coste real en USD.
 */
export function calculateCostUsd(model: string, usage: TokenUsage): number {
    const pricing = MODEL_PRICING_PER_MILLION_TOKENS[model];

    if (!pricing) {
        console.warn(
            `chatbot pricing: modelo "${model}" sin precio registrado, usando el de Luna como aproximación — añádelo a MODEL_PRICING_PER_MILLION_TOKENS.`,
        );
    }

    const rates = pricing ?? FALLBACK_PRICING;
    return (
        (usage.inputTokens / 1_000_000) * rates.input +
        (usage.outputTokens / 1_000_000) * rates.output
    );
}
