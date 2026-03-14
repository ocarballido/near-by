type DenoEnv = {
	env: {
		get(key: string): string | undefined;
	};
	serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

declare const Deno: DenoEnv;

interface HeadersWithForEach {
	forEach: (callback: (value: string, key: string) => void) => void;
}

function headersToObject(headers: HeadersWithForEach): Record<string, string> {
	const obj: Record<string, string> = {};
	headers.forEach((value, key) => {
		obj[key] = value;
	});
	return obj;
}

import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0';
import { Resend } from 'npm:resend';
import { renderMagicLinkEmail } from './templates/magicLinkTemplate';

const resend = new Resend(Deno.env.get('RESEND_API_KEY')!);

// Hook secret (remove the 'v1,whsec_' prefix before verifying)
const rawSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET')!;
const hookSecret = rawSecret.replace('v1,whsec_', '');

Deno.serve(async (req: Request) => {
	try {
		const payload = await req.text();
		const headers = headersToObject(
			req.headers as unknown as HeadersWithForEach,
		);

		const wh = new Webhook(hookSecret);
		const { user, email_data } = wh.verify(payload, headers) as {
			user: {
				email: string;
				user_metadata?: { language?: string };
			};
			email_data: {
				token: string;
				token_hash: string;
				redirect_to: string;
				email_action_type: string;
				site_url: string;
				token_new?: string;
				token_hash_new?: string;
			};
		};

		// Locale: from metadata or from redirect_to (?locale=es)
		const locale =
			user.user_metadata?.language ??
			(() => {
				try {
					const url = new URL(email_data.redirect_to);
					return url.searchParams.get('locale') ?? 'en';
				} catch {
					return 'en';
				}
			})();

		// URL base del proyecto Supabase (la expone el runtime, como en el ejemplo oficial)
		const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';

		// Magic link: seguir exactamente el patrón oficial del send-email hook
		// /auth/v1/verify se encarga de validar el token y luego redirigir a redirect_to
		const magicLink = `${supabaseUrl}/auth/v1/verify?token=${encodeURIComponent(
			email_data.token_hash,
		)}&type=${encodeURIComponent(
			email_data.email_action_type,
		)}&redirect_to=${encodeURIComponent(email_data.redirect_to)}`;

		const { subject, html } = renderMagicLinkEmail({
			locale,
			magicLink,
			productName: 'BNBexplorer',
			appUrl: 'https://bnbexplorer.com',
			heroUrl: 'https://bnbexplorer.com/static/img/mail/hero.png',
			logoSymbolUrl:
				'https://bnbexplorer.com/static/img/mail/symbol_shadow_colored.png',
			videoImageUrl: 'https://bnbexplorer.com/static/img/mail/video.png',
			footerLogoUrl:
				'https://bnbexplorer.com/static/img/mail/brand_colored.png',
		});

		const { error } = await resend.emails.send({
			from: 'BNBexplorer <no-reply@bnbexplorer.com>',
			to: [user.email],
			subject,
			html,
		});

		if (error) {
			throw error;
		}

		return new Response(JSON.stringify({}), {
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
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}
});
