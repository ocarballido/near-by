import { INTENTS, type IntentType } from './intents';

function normalize(text: string): string {
	return text
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9 ]/g, ' ');
}

export function detectIntent(message: string): IntentType | null {
	const normalized = normalize(message);

	for (const [intentType, intent] of Object.entries(INTENTS)) {
		if (intent.keywords.some((kw) => normalized.includes(kw))) {
			return intentType as IntentType;
		}
	}

	return null;
}
