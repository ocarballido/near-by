import { NextRequest, NextResponse } from 'next/server';
import { createSSRClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
	try {
		// 1. Verificar que el usuario está autenticado y es admin
		const ssrClient = await createSSRClient();
		const {
			data: { user },
			error,
		} = await ssrClient.auth.getUser();

		console.log('user:', user?.email);
		console.log('error:', error);
		console.log('ADMIN_EMAILS:', process.env.ADMIN_EMAILS);

		if (error || !user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 },
			);
		}

		const adminEmails = (process.env.ADMIN_EMAILS ?? '')
			.split(',')
			.map((e) => e.trim())
			.filter(Boolean);

		console.log('user email:', user.email);
		console.log('adminEmails:', adminEmails);
		console.log('includes:', adminEmails.includes(user.email ?? ''));

		if (!adminEmails.includes(user.email ?? '')) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
		}

		// 2. Reenviar el body a la edge function con el secret
		const body = await req.json();

		const res = await fetch(
			`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-broadcast`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
					'x-broadcast-secret': process.env.BROADCAST_SECRET ?? '',
				},
				body: JSON.stringify(body),
			},
		);

		const data = await res.json();

		if (!res.ok) {
			return NextResponse.json(
				{ error: data.error ?? 'Edge function error' },
				{ status: res.status },
			);
		}

		return NextResponse.json(data);
	} catch (error) {
		console.error('Broadcast route error:', error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}
