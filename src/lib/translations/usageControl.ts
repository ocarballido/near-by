import { createClient } from '@supabase/supabase-js';

const MONTHLY_CHAR_LIMIT = 500_000;

export async function checkAndIncrementUsage(
	charsToAdd: number,
): Promise<boolean> {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.PRIVATE_SUPABASE_SERVICE_KEY!,
	);

	const month = new Date().toISOString().slice(0, 7);

	await supabase
		.from('translation_usage')
		.upsert({ month }, { onConflict: 'month', ignoreDuplicates: true });

	const { data: usage, error } = await supabase
		.from('translation_usage')
		.select('chars_used, calls_used, paused')
		.eq('month', month)
		.single();

	if (error || !usage) {
		console.error('[usageControl] Error leyendo usage:', error);
		return true; // fail open
	}

	if (usage.paused) {
		console.warn('[usageControl] Traducciones pausadas este mes');
		return false;
	}

	const newTotal = usage.chars_used + charsToAdd;

	if (newTotal > MONTHLY_CHAR_LIMIT) {
		await supabase
			.from('translation_usage')
			.update({
				paused: true,
				chars_used: newTotal,
				updated_at: new Date().toISOString(),
			})
			.eq('month', month);

		console.warn(
			'[usageControl] Límite mensual superado — pausado hasta el mes siguiente',
		);
		return false;
	}

	await supabase
		.from('translation_usage')
		.update({
			chars_used: newTotal,
			calls_used: usage.calls_used + 1,
			updated_at: new Date().toISOString(),
		})
		.eq('month', month);

	return true;
}
