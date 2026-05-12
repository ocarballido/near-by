import { INTENTS, type IntentType } from './intents';

function normalize(text: string): string {
	return text
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9 ]/g, ' ');
}

function matchesKeyword(normalized: string, keyword: string): boolean {
	const normalizedKw = keyword
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9 ]/g, ' ')
		.trim();

	// Para keywords de múltiples palabras usamos includes directo
	// Para keywords de una sola palabra exigimos word boundary
	if (normalizedKw.includes(' ')) {
		return normalized.includes(normalizedKw);
	}

	const regex = new RegExp(`(?<![a-z0-9])${normalizedKw}(?![a-z0-9])`);
	return regex.test(normalized);
}

export function detectIntent(message: string): IntentType | null {
	const normalized = normalize(message);

	for (const [intentType, intent] of Object.entries(INTENTS)) {
		for (const kw of intent.keywords) {
			if (matchesKeyword(normalized, kw)) {
				return intentType as IntentType;
			}
		}
	}

	return null;
}
