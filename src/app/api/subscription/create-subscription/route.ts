import { NextResponse } from 'next/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';

export async function POST(request: Request) {
	const { userId } = await request.json();
	if (!userId) {
		return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
	}

	const supabase = await createServerAdminClient();

	const now = new Date().toISOString();
	const { error } = await supabase.from('subscriptions').insert({
		user_id: userId,
		plan_id: 'free',
		status: 'active',
		current_period_start: now,
		current_period_end: null,
	});

	if (error) {
		console.error('Error creando subscription:', error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({ success: true });
}
