// src/app/actions/ai/getRemainingAIUsage.ts
'use server';

import { createSSRClient } from '@/lib/supabase/server';
import { DAILY_AI_USAGE_LIMMIT } from '@/config/config-constants';

import type { Tables } from '@/lib/types';

type AiUsageCount = Pick<Tables<'ai_usage'>, 'count'>;

export const getRemainingAIUsage = async (): Promise<{
	remaining: number | null;
}> => {
	const supabase = await createSSRClient();
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) return { remaining: null };

	const today = new Date().toISOString().split('T')[0];

	const { data } = await supabase
		.from('ai_usage')
		.select('count')
		.eq('user_id', user.id)
		.eq('date', today)
		.single()
		.overrideTypes<AiUsageCount, { merge: false }>();

	if (!data) return { remaining: DAILY_AI_USAGE_LIMMIT };

	return {
		remaining: Math.max(0, DAILY_AI_USAGE_LIMMIT - data.count),
	};
};
