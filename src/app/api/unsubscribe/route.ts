import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		const { token } = await req.json();

		if (!token) {
			return NextResponse.json(
				{ error: 'Missing token' },
				{ status: 400 },
			);
		}

		const supabase = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.PRIVATE_SUPABASE_SERVICE_KEY!,
		);

		// Buscar el perfil por token
		const { data: profile, error: findError } = await supabase
			.from('profiles')
			.select('user_id')
			.eq('unsubscribe_token', token)
			.single();

		if (findError || !profile) {
			return NextResponse.json(
				{ error: 'Invalid token' },
				{ status: 404 },
			);
		}

		// Marcar como dado de baja
		const { error: updateError } = await supabase
			.from('profiles')
			.update({ email_opt_out: true })
			.eq('unsubscribe_token', token);

		if (updateError) {
			return NextResponse.json(
				{ error: 'Update failed' },
				{ status: 500 },
			);
		}

		return NextResponse.json({ ok: true });
	} catch (error) {
		console.error('Unsubscribe error:', error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}
