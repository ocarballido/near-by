import { createClient } from 'npm:@supabase/supabase-js@2';
import { Resend } from 'npm:resend';
import { renderA1NoPropertyDay2 } from '../send-sequence-email/templates/a1-no-property-day2.ts';
import { renderA2NoPropertyDay7 } from '../send-sequence-email/templates/a2-no-property-day7.ts';
import { renderB1IncompleteDay3 } from '../send-sequence-email/templates/b1-incomplete-day3.ts';
import { renderB2IncompleteDay14 } from '../send-sequence-email/templates/b2-incomplete-day14.ts';
import { renderC1NoFeaturedDay5 } from '../send-sequence-email/templates/c1-no-featured-day5.ts';

type DenoEnv = {
	env: { get(key: string): string | undefined };
};
declare const Deno: DenoEnv;

const APP_URL = 'https://bnbexplorer.com';
const LOGO_SYMBOL_URL = 'https://bnbexplorer.com/static/img/mail/symbol.png';
const FOOTER_LOGO_URL = 'https://bnbexplorer.com/static/img/mail/logo.png';

export type SendSequenceEmailPayload = {
	type: string;
	step: number;
	userId: string;
	email: string;
	locale?: string;
	propertyId?: string;
	propertyName?: string;
};

export async function sendSequenceEmail(
	payload: SendSequenceEmailPayload,
): Promise<{
	sent?: boolean;
	skipped?: boolean;
	reason?: string;
	error?: string;
}> {
	const {
		type,
		step,
		userId,
		email,
		locale = 'es',
		propertyId,
		propertyName,
	} = payload;

	const resend = new Resend(Deno.env.get('RESEND_API_KEY')!);

	const supabase = createClient(
		Deno.env.get('SUPABASE_URL')!,
		Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
	);

	// 1. Consultar perfil — verificar opt_out y obtener token
	const { data: profile, error: profileError } = await supabase
		.from('profiles')
		.select('email_opt_out, unsubscribe_token')
		.eq('user_id', userId)
		.single();

	if (profileError || !profile) {
		return { error: 'Profile not found' };
	}

	// 2. Si está dado de baja, no enviamos
	if (profile.email_opt_out === true) {
		return { skipped: true, reason: 'User unsubscribed' };
	}

	// 3. Construir URL de baja
	const unsubscribeUrl = `${APP_URL}/unsubscribe?token=${profile.unsubscribe_token}`;

	const templateParams = {
		locale,
		appUrl: APP_URL,
		logoSymbolUrl: LOGO_SYMBOL_URL,
		footerLogoUrl: FOOTER_LOGO_URL,
		unsubscribeUrl,
	};

	// 4. Seleccionar template
	let subject: string;
	let html: string;

	if (type === 'no_property' && step === 1) {
		({ subject, html } = renderA1NoPropertyDay2(templateParams));
	} else if (type === 'no_property' && step === 2) {
		({ subject, html } = renderA2NoPropertyDay7(templateParams));
	} else if (type === 'incomplete_property' && step === 1) {
		if (!propertyId || !propertyName)
			return { error: 'propertyId and propertyName required' };
		({ subject, html } = renderB1IncompleteDay3({
			...templateParams,
			propertyId,
			propertyName,
		}));
	} else if (type === 'incomplete_property' && step === 2) {
		if (!propertyId || !propertyName)
			return { error: 'propertyId and propertyName required' };
		({ subject, html } = renderB2IncompleteDay14({
			...templateParams,
			propertyId,
			propertyName,
		}));
	} else if (type === 'no_featured' && step === 1) {
		if (!propertyId || !propertyName)
			return { error: 'propertyId and propertyName required' };
		({ subject, html } = renderC1NoFeaturedDay5({
			...templateParams,
			propertyId,
			propertyName,
		}));
	} else {
		return { error: `Unknown type/step: ${type}/${step}` };
	}

	// 5. Enviar con Resend
	const { error: sendError } = await resend.emails.send({
		from: 'BNBexplorer <no-reply@bnbexplorer.com>',
		to: [email],
		subject,
		html,
	});

	if (sendError) {
		return { error: String(sendError) };
	}

	// 6. Registrar en email_sequence_log
	const { error: logError } = await supabase
		.from('email_sequence_log')
		.insert({
			user_id: userId,
			type,
			step,
			ref_id: propertyId ?? null,
		});

	if (logError) {
		console.error('Failed to log email:', logError);
	}

	return { sent: true };
}
