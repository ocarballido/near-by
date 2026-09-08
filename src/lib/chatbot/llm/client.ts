import OpenAI from "openai";

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Única fuente de verdad para el modelo — antes se leía la misma variable
// de entorno, con el mismo valor por defecto, en tres ficheros distintos.
export const LLM_MODEL = process.env.CHATBOT_LLM_MODEL ?? "gpt-5.6-luna";
