import { sendBroadcast } from '../_shared/send-email.ts';

type DenoEnv = {
	env: { get(key: string): string | undefined };
	serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};
declare const Deno: DenoEnv;

Deno.serve(async (req: Request) => {
	try {
		// 1. Solo POST
		if (req.method !== 'POST') {
			return new Response(
				JSON.stringify({ error: 'Method not allowed' }),
				{
					status: 405,
					headers: { 'Content-Type': 'application/json' },
				},
			);
		}

		// 2. Verificar secret para proteger el endpoint
		const secretHeader = req.headers.get('x-broadcast-secret');
		const expectedSecret = Deno.env.get('BROADCAST_SECRET');
		if (!expectedSecret || secretHeader !== expectedSecret) {
			return new Response(JSON.stringify({ error: 'Unauthorized' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// 3. Parsear body
		const body = (await req.json()) as {
			es: {
				subject: string;
				preheader: string;
				title: string;
				mainText: string;
				alertText?: string;
				bullets?: string[];
				ctaLabel?: string;
			};
			en: {
				subject: string;
				preheader: string;
				title: string;
				mainText: string;
				alertText?: string;
				bullets?: string[];
				ctaLabel?: string;
			};
			fr: {
				subject: string;
				preheader: string;
				title: string;
				mainText: string;
				alertText?: string;
				bullets?: string[];
				ctaLabel?: string;
			};
			imageUrl?: string;
			ctaUrl?: string;
			emailType?: 'newsletter' | 'survey' | 'announcement';
		};

		// 4. Validar campos obligatorios
		if (
			!body.es?.subject ||
			!body.es?.preheader ||
			!body.es?.title ||
			!body.es?.mainText
		) {
			return new Response(
				JSON.stringify({
					error: 'Missing required fields in ES: subject, preheader, title, mainText',
				}),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				},
			);
		}

		// 5. Enviar
		const result = await sendBroadcast(body);

		return new Response(JSON.stringify({ ok: true, ...result }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error: unknown) {
		let message = 'Unknown error';
		if (error && typeof error === 'object' && 'message' in error) {
			const maybeError = error as { message?: unknown };
			message =
				typeof maybeError.message === 'string'
					? maybeError.message
					: 'Unknown error';
		}
		return new Response(JSON.stringify({ error: message }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
});
