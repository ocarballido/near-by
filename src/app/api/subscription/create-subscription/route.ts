import { NextResponse } from 'next/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, TablesInsert } from '@/lib/types';

export async function POST(request: Request) {
	const body = await request.json();
	const userId = body?.userId;

	if (typeof userId !== 'string' || userId.length === 0) {
		return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
	}

	const supabase = await createServerAdminClient();

	const db = supabase as unknown as SupabaseClient<Database>;

	const now = new Date().toISOString();

	const payload: TablesInsert<'subscriptions'> = {
		user_id: userId,
		plan_id: 'free',
		status: 'active',
		current_period_start: now,
		current_period_end: null,
		// created_at / updated_at / id son opcionales según tu schema
	};

	const { error } = await db.from('subscriptions').insert(payload);

	if (error) {
		console.error('Error creando subscription:', error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({ success: true });
}
