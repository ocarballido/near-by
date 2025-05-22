'use server';

import { createSSRClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { DAILY_AI_USAGE_LIMMIT } from '@/config/config-constants';

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

		// 3) Verificar uso diario de IA
		const today = new Date().toISOString().split('T')[0];
		let { data: usage } = await supabase
			.from('ai_usage')
			.select('*')
			.eq('user_id', user.id)
			.eq('date', today)
			.single();

		if (!usage) {
			const { data: created } = await supabase
				.from('ai_usage')
				.insert({ user_id: user.id, count: 1 })
				.select()
				.single();
			usage = created;
		} else if (usage.count >= DAILY_AI_USAGE_LIMMIT) {
			return { error: 'Límite diario de IA alcanzado' };
		} else {
			await supabase
				.from('ai_usage')
				.update({ count: usage.count + 1 })
				.eq('id', usage.id);
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
							content:
								'Responde como un asistente que ayuda a propietarios a redactar contenido útil, amable y claro para sus alojamientos.',
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
