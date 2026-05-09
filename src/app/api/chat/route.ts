import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types';
import { detectIntent, buildResponse } from '@/lib/chatbot';
import type {
	PropertyDataRow,
	ChatbotMessages,
	PropertySchedule,
} from '@/lib/chatbot';
import { INTENTS } from '@/lib/chatbot/intents';
import { getTranslations } from 'next-intl/server';

export async function POST(req: Request) {
	try {
		const { message, propertyId, locale } = await req.json();

		if (!message || !propertyId) {
			return Response.json(
				{ reply: 'Missing request data.' },
				{ status: 400 },
			);
		}

		const t = await getTranslations({
			locale: locale ?? 'es',
			namespace: 'GuestChat',
		});

		const messages: ChatbotMessages = {
			infoNotFound: t('infoNotFound'),
			locationsNotFound: t('locationsNotFound'),
			locationsPrefix: t('locationsPrefix'),
			fallback: t('fallback'),
			scheduleNotFound: t('scheduleNotFound'),
			checkIn: t('checkIn'),
			checkOut: t('checkOut'),
		};

		const intent = detectIntent(message);

		if (intent === null) {
			return Response.json({ reply: messages.fallback });
		}

		const { subCategoryId, kind } = INTENTS[intent];

		const supabase = await createServerAdminClient();
		const db = supabase as unknown as SupabaseClient<Database>;

		// Para SCHEDULE consultamos properties en paralelo
		const [propertyDataResult, scheduleResult] = await Promise.all([
			db
				.from('property_data')
				.select('name, description, type, sub_category_id')
				.eq('property_id', propertyId)
				.eq('sub_category_id', subCategoryId)
				.eq('type', kind),
			intent === 'SCHEDULE'
				? db
						.from('properties')
						.select(
							'check_in_time, check_in_date, check_out_time, check_out_date',
						)
						.eq('id', propertyId)
						.single()
				: Promise.resolve({ data: null, error: null }),
		]);

		if (propertyDataResult.error) {
			console.error('chatbot query error:', propertyDataResult.error);
			return Response.json({ reply: t('serverError') }, { status: 500 });
		}

		const rows = (propertyDataResult.data ?? []) as PropertyDataRow[];
		const schedule = scheduleResult.data as PropertySchedule | null;

		const reply = buildResponse(
			intent,
			rows,
			messages,
			schedule ?? undefined,
		);

		return Response.json({ reply });
	} catch (e) {
		console.error('chatbot route error:', e);
		return Response.json(
			{ reply: 'Internal server error.' },
			{ status: 500 },
		);
	}
}
