// app/actions/feedback/create-feedback.ts
'use server';

import { z } from 'zod';
import { createSSRClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types';

function fdString(formData: FormData, key: string): string | undefined {
	const v = formData.get(key);
	return typeof v === 'string' && v.length > 0 ? v : undefined;
}

const FeedbackSchema = z.object({
	message: z.string().min(1, 'El mensaje es obligatorio'),
	category: z
		.enum(['question', 'suggestion', 'unclear', 'bug', 'other'])
		.default('other'),
	user_email: z.string().email().optional().or(z.literal('')),
	status: z
		.enum(['new', 'triaged', 'planned', 'resolved', 'dismissed'])
		.optional(),
	source_area: z.enum([
		'create_property',
		'create_location',
		'create_info',
		'dashboard',
		'subscription',
	]),
	context_type: z.enum(['property', 'location', 'info', 'none']).optional(),
	context_id: z.string().uuid().optional(),
	flow_name: z.string().optional(),
	page_path: z.string().optional(),
	locale: z.string().optional(),
});

export type FeedbackFormState = {
	errors?: { server?: string[]; field?: Record<string, string[]> };
	success?: boolean;
};

export async function createFeedback(
	formData: FormData,
): Promise<FeedbackFormState> {
	try {
		const ssrClient = await createSSRClient();
		const {
			data: { user },
			error: authError,
		} = await ssrClient.auth.getUser();

		if (authError || !user) {
			return {
				errors: {
					server: ['No has iniciado sesión o tu sesión ha expirado'],
				},
			};
		}

		const raw = {
			message: fdString(formData, 'message'),
			category: fdString(formData, 'category'),
			user_email: fdString(formData, 'user_email'),
			source_area: fdString(formData, 'source_area'),
			context_type: fdString(formData, 'context_type'),
			context_id: fdString(formData, 'context_id'),
			flow_name: fdString(formData, 'flow_name'),
			page_path: fdString(formData, 'page_path'),
			locale: fdString(formData, 'locale'),
		};

		const parsed = FeedbackSchema.safeParse(raw);
		if (!parsed.success) {
			return { errors: { server: ['Datos inválidos'] } };
		}

		const v = parsed.data;

		const supabase = await createServerAdminClient();
		const db = supabase as unknown as SupabaseClient<Database>;

		const { error } = await db.from('feedback_messages').insert({
			user_id: user.id,
			user_email: v.user_email || null,
			status: 'new',
			category: v.category,
			message: v.message,
			metadata: {},
			source_area: v.source_area,
			context_type: v.context_type ?? null,
			context_id: v.context_id ?? null,
			flow_name: v.flow_name ?? null,
			page_path: v.page_path ?? null,
			locale: v.locale ?? null,
		});

		if (error) {
			console.error('Error insert feedback:', error);
			return { errors: { server: ['No se pudo enviar el comentario'] } };
		}

		return { success: true };
	} catch (e) {
		console.error(e);
		return { errors: { server: ['Error interno del servidor'] } };
	}
}
