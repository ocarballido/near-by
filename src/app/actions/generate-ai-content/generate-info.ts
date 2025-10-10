'use server';

import { createSSRClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { DAILY_AI_USAGE_LIMMIT } from '@/config/config-constants';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables, TablesInsert, TablesUpdate } from '@/lib/types';

type AIUsageRow = Tables<'ai_usage'>;
type AIUsageInsert = TablesInsert<'ai_usage'>;
type AIUsageUpdate = TablesUpdate<'ai_usage'>;

export const generateAIContent = async (prompt: string) => {
	try {
		// 1) Autenticación con cookies del usuario
		const ssrClient = await createSSRClient();
		const {
			data: { user },
			error: authError,
		} = await ssrClient.auth.getUser();

		if (authError || !user) {
			return { error: 'No estás autenticado' };
		}

		// 2) Cliente con permisos para acceder a la base de datos
		const supabase = await createServerAdminClient();

		const db = supabase as unknown as SupabaseClient<Database>;

		// 3) Verificar uso diario de IA
		const today = new Date().toISOString().split('T')[0];

		const usageResp = await db
			.from('ai_usage')
			.select('*')
			.eq('user_id', user.id)
			.eq('date', today)
			.maybeSingle();

		let usage = usageResp.data as Tables<'ai_usage'> | null;

		if (!usage) {
			const payload: AIUsageInsert = {
				user_id: user.id,
				count: 1, // 'date' lo rellena tu trigger/servidor si aplica
			};

			const { data: created } = await db
				.from('ai_usage')
				.insert(payload)
				.select()
				.single();

			usage = created as AIUsageRow | null;
		} else if (usage.count >= DAILY_AI_USAGE_LIMMIT) {
			return { error: 'Límite diario de IA alcanzado' };
		} else {
			const updatePayload: AIUsageUpdate = {
				count: usage.count + 1,
			};

			await db.from('ai_usage').update(updatePayload).eq('id', usage.id);
		}

		// 4) Llamada a OpenAI
		const response = await fetch(
			'https://api.openai.com/v1/chat/completions',
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					model: 'gpt-3.5-turbo',
					temperature: 1.0,
					max_tokens: 500,
					messages: [
						{
							role: 'system',
							content: `
									Responde como un asistente que ayuda a propietarios a redactar contenido útil, amable y claro para sus alojamientos.

									Instrucciones:
									- No uses emojis ni símbolos de banderas.
									- Evita frases en el encabezado como: Aqui tienes la respuesta..., ve directo al texto generado”.
									- Usa un lenguaje neutral, sencillo y directo.
									- Separa cada actividad con un salto de línea.
									- Termina con una frase amable y neutral, sin exageraciones.
									- No uses notación Markdown como **negritas** o _cursivas_ en el texto. Usa solo texto plano.
								`,
						},
						{
							role: 'user',
							content: prompt,
						},
					],
				}),
			}
		);

		const data = await response.json();

		if (!data?.choices?.[0]?.message?.content) {
			return { error: 'No se pudo generar contenido' };
		}

		return { content: data.choices[0].message.content };
	} catch (error: unknown) {
		console.error('generateAIContent error:', error);
		return {
			error: 'Ocurrió un error inesperado generando el contenido',
		};
	}
};
