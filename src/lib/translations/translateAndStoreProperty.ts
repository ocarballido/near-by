import { createClient } from '@supabase/supabase-js';
import { checkAndIncrementUsage } from './usageControl';
import { LOCALES } from '@/config/config-constants';

const CLAUDE_MODEL = 'claude-haiku-4-5-20251001';

type SupportedLang = (typeof LOCALES)[number];

type FieldToTranslate = {
	fieldKey: 'name' | 'description' | 'summary' | 'access_instructions';
	value: string;
};

type ClaudeTranslationResult = {
	source_lang: SupportedLang;
	translations: Record<SupportedLang, string>;
};

export async function translateAndStoreProperty(
	propertyId: string,
	fields: FieldToTranslate[],
): Promise<void> {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.PRIVATE_SUPABASE_SERVICE_KEY!,
	);

	const validFields = fields.filter(
		(f) => f.value && f.value.trim().length > 10,
	);
	if (validFields.length === 0) return;

	const totalChars = validFields.reduce((acc, f) => acc + f.value.length, 0);
	const canTranslate = await checkAndIncrementUsage(totalChars);
	if (!canTranslate) return;

	for (const field of validFields) {
		const result = await callClaude(field.value);
		if (!result) continue;

		const { source_lang, translations } = result;
		const targetLangs = LOCALES.filter((l) => l !== source_lang);

		const upsertRows = targetLangs.map((lang) => ({
			property_id: propertyId,
			lang,
			field_key: field.fieldKey,
			translated_value: translations[lang],
			source_lang,
			updated_at: new Date().toISOString(),
		}));

		const { error } = await (supabase as any)
			.from('property_translations')
			.upsert(upsertRows, { onConflict: 'property_id,lang,field_key' });

		if (error) {
			console.error(
				'[translateAndStoreProperty] Error en upsert:',
				error,
			);
		}
	}
}

async function callClaude(
	text: string,
): Promise<ClaudeTranslationResult | null> {
	const langsExample = LOCALES.reduce(
		(acc, lang) => ({ ...acc, [lang]: `texto en ${lang}` }),
		{} as Record<SupportedLang, string>,
	);

	const prompt = `Eres un traductor especializado en alojamientos vacacionales.
Dado el siguiente texto, devuelve ÚNICAMENTE un objeto JSON con esta estructura exacta, sin explicaciones ni markdown:
{
  "source_lang": "es",
  "translations": ${JSON.stringify(langsExample, null, 2)}
}
Detecta el idioma del texto original y ponlo en "source_lang".
En "translations" incluye siempre todos los idiomas. El idioma original va sin cambios.
Mantén un tono acogedor y natural, apropiado para una guía de alojamiento vacacional.

Texto:
${text}`;

	try {
		const response = await fetch('https://api.anthropic.com/v1/messages', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': process.env.ANTHROPIC_API_KEY!,
				'anthropic-version': '2023-06-01',
			},
			body: JSON.stringify({
				model: CLAUDE_MODEL,
				max_tokens: 2000,
				messages: [{ role: 'user', content: prompt }],
			}),
		});

		if (!response.ok) {
			console.error(
				'[translateAndStoreProperty] Claude API error:',
				response.status,
			);
			return null;
		}

		const data = await response.json();
		const rawText: string = data.content?.[0]?.text ?? '';
		const clean = rawText.replace(/```json|```/g, '').trim();
		return JSON.parse(clean) as ClaudeTranslationResult;
	} catch (err) {
		console.error(
			'[translateAndStoreProperty] Error parseando respuesta:',
			err,
		);
		return null;
	}
}
