// src/lib/updatePropertyProgress.ts
'use server';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types';
import { trackEvent } from '@/lib/analytics/mixpanel';

type ContentFlags = { hasInfo: boolean; hasLocation: boolean };
type ProgressPercent = 0 | 50 | 100;

function computeProgressPercent(flags: ContentFlags): ProgressPercent {
	if (flags.hasInfo && flags.hasLocation) return 100;
	if (flags.hasInfo || flags.hasLocation) return 50;
	return 0;
}

async function existsType(args: {
	db: SupabaseClient<Database>;
	propertyId: string;
	type: 'info' | 'location';
}): Promise<boolean> {
	const { db, propertyId, type } = args;

	const { count, error } = await db
		.from('property_data')
		.select('id', { count: 'exact', head: true })
		.eq('property_id', propertyId)
		.eq('type', type);

	if (error) {
		// best-effort: si falla, no rompemos
		return false;
	}

	return (count ?? 0) > 0;
}

export async function updatePropertyProgressAndTrack(args: {
	db: SupabaseClient<Database>;
	userId: string;
	propertyId: string;
}): Promise<void> {
	const { db, userId, propertyId } = args;

	try {
		const [hasInfo, hasLocation] = await Promise.all([
			existsType({ db, propertyId, type: 'info' }),
			existsType({ db, propertyId, type: 'location' }),
		]);

		const progressPercent = computeProgressPercent({
			hasInfo,
			hasLocation,
		});

		await trackEvent({
			event: 'property_progress_updated',
			distinctId: userId,
			props: {
				property_id: propertyId,
				progress_percent: progressPercent,
				has_info: hasInfo,
				has_location: hasLocation,
			},
		});
	} catch {
		// Nunca romper el flujo por analytics
	}
}
