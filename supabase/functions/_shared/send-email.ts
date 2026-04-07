import { createClient } from 'npm:@supabase/supabase-js@2';
import { Resend } from 'npm:resend';
import { renderA1NoPropertyDay2 } from '../send-sequence-email/templates/a1-no-property-day2.ts';
import { renderA2NoPropertyDay7 } from '../send-sequence-email/templates/a2-no-property-day7.ts';
import { renderB1IncompleteDay3 } from '../send-sequence-email/templates/b1-incomplete-day3.ts';
import { renderB2IncompleteDay14 } from '../send-sequence-email/templates/b2-incomplete-day14.ts';
import { renderC1NoFeaturedDay5 } from '../send-sequence-email/templates/c1-no-featured-day5.ts';
import { renderD1WeeklyDigest } from '../send-sequence-email/templates/d1-weekly-digest.ts';
import { renderE1Broadcast } from '../send-sequence-email/templates/e1-broadcast.ts';

type DenoEnv = {
	env: { get(key: string): string | undefined };
};
declare const Deno: DenoEnv;

const APP_URL = 'https://bnbexplorer.com';
const LOGO_SYMBOL_URL =
	'https://bnbexplorer.com/static/img/mail/symbol_shadow_colored.png';
const FOOTER_LOGO_URL =
	'https://bnbexplorer.com/static/img/mail/brand_colored.png';
const HERO_NO_PROPERTY_URL =
	'https://bnbexplorer.com/static/img/mail/hero_no_property.png';
const HERO_UNCOMPLETE_URL =
	'https://bnbexplorer.com/static/img/mail/hero_uncomplite.png';
const HERO_NO_FAVORITES_URL =
	'https://bnbexplorer.com/static/img/mail/hero_no_favorites.png';

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
		locale = 'en',
		propertyId,
		propertyName,
	} = payload;

	const resend = new Resend(Deno.env.get('RESEND_API_KEY')!);

	const supabase = createClient(
		Deno.env.get('SUPABASE_URL')!,
		Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
	);

	const { data: profile, error: profileError } = await supabase
		.from('profiles')
		.select('email_opt_out, unsubscribe_token')
		.eq('user_id', userId)
		.single();

	if (profileError || !profile) {
		return { error: 'Profile not found' };
	}

	if (profile.email_opt_out === true) {
		return { skipped: true, reason: 'User unsubscribed' };
	}

	const unsubscribeUrl = `${APP_URL}/unsubscribe?token=${profile.unsubscribe_token}`;

	const templateParams = {
		locale,
		appUrl: APP_URL,
		logoSymbolUrl: LOGO_SYMBOL_URL,
		footerLogoUrl: FOOTER_LOGO_URL,
		unsubscribeUrl,
	};

	let subject: string;
	let html: string;

	if (type === 'no_property' && step === 1) {
		({ subject, html } = renderA1NoPropertyDay2({
			...templateParams,
			heroUrl: HERO_NO_PROPERTY_URL,
		}));
	} else if (type === 'no_property' && step === 2) {
		({ subject, html } = renderA2NoPropertyDay7({
			...templateParams,
			heroUrl: HERO_NO_PROPERTY_URL,
		}));
	} else if (type === 'incomplete_property' && step === 1) {
		if (!propertyId || !propertyName)
			return { error: 'propertyId and propertyName required' };
		({ subject, html } = renderB1IncompleteDay3({
			...templateParams,
			heroUrl: HERO_UNCOMPLETE_URL,
			propertyId,
			propertyName,
		}));
	} else if (type === 'incomplete_property' && step === 2) {
		if (!propertyId || !propertyName)
			return { error: 'propertyId and propertyName required' };
		({ subject, html } = renderB2IncompleteDay14({
			...templateParams,
			heroUrl: HERO_UNCOMPLETE_URL,
			propertyId,
			propertyName,
		}));
	} else if (type === 'no_featured' && step === 1) {
		if (!propertyId || !propertyName)
			return { error: 'propertyId and propertyName required' };
		({ subject, html } = renderC1NoFeaturedDay5({
			...templateParams,
			heroUrl: HERO_NO_FAVORITES_URL,
			propertyId,
			propertyName,
		}));
	} else {
		return { error: `Unknown type/step: ${type}/${step}` };
	}

	const { error: sendError } = await resend.emails.send({
		from: 'BNBexplorer <no-reply@bnbexplorer.com>',
		to: [email],
		subject,
		html,
	});

	if (sendError) {
		return { error: String(sendError) };
	}

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

// ─────────────────────────────────────────
// Weekly digest — función separada
// ─────────────────────────────────────────

export type PropertyVisit = {
	property_name: string;
	visit_count: number;
};

export type Tip = {
	emoji: string;
	title: string;
	text: string;
};

export type SendWeeklyDigestPayload = {
	userId: string;
	email: string;
	locale?: string;
	propertyVisits: PropertyVisit[];
	tip: Tip | null;
};

export async function sendWeeklyDigest(
	payload: SendWeeklyDigestPayload,
): Promise<{
	sent?: boolean;
	skipped?: boolean;
	reason?: string;
	error?: string;
}> {
	const { userId, email, locale = 'es', propertyVisits, tip } = payload;

	const resend = new Resend(Deno.env.get('RESEND_API_KEY')!);

	const supabase = createClient(
		Deno.env.get('SUPABASE_URL')!,
		Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
	);

	const { data: profile, error: profileError } = await supabase
		.from('profiles')
		.select('email_opt_out, unsubscribe_token')
		.eq('user_id', userId)
		.single();

	if (profileError || !profile) {
		return { error: 'Profile not found' };
	}

	if (profile.email_opt_out === true) {
		return { skipped: true, reason: 'User unsubscribed' };
	}

	const unsubscribeUrl = `${APP_URL}/unsubscribe?token=${profile.unsubscribe_token}`;

	const { subject, html } = renderD1WeeklyDigest({
		locale,
		appUrl: APP_URL,
		logoSymbolUrl: LOGO_SYMBOL_URL,
		footerLogoUrl: FOOTER_LOGO_URL,
		unsubscribeUrl,
		propertyVisits,
		tip,
	});

	const { error: sendError } = await resend.emails.send({
		from: 'BNBexplorer <no-reply@bnbexplorer.com>',
		to: [email],
		subject,
		html,
	});

	if (sendError) {
		return { error: String(sendError) };
	}

	const { error: logError } = await supabase
		.from('email_sequence_log')
		.insert({
			user_id: userId,
			type: 'weekly_digest',
			step: 1,
			ref_id: null,
		});

	if (logError) {
		console.error('Failed to log weekly digest:', logError);
	}

	return { sent: true };
}

// ─────────────────────────────────────────
// Broadcast — newsletters y comunicados
// ─────────────────────────────────────────

export type BroadcastContent = {
	subject: string;
	preheader: string;
	title: string;
	mainText: string;
	alertText?: string;
	bullets?: string[];
	ctaLabel?: string;
};

export type SendBroadcastPayload = {
	es: BroadcastContent;
	en: BroadcastContent;
	fr: BroadcastContent;
	imageUrl?: string;
	ctaUrl?: string;
	emailType?: 'newsletter' | 'survey' | 'announcement';
};

export async function sendBroadcast(payload: SendBroadcastPayload): Promise<{
	sent: number;
	skipped: number;
	errors: number;
}> {
	const resend = new Resend(Deno.env.get('RESEND_API_KEY')!);

	const supabase = createClient(
		Deno.env.get('SUPABASE_URL')!,
		Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
	);

	// 1. Obtener todos los usuarios de auth
	const { data: usersData, error: usersError } =
		await supabase.auth.admin.listUsers();

	if (usersError || !usersData) {
		throw new Error('Failed to fetch users');
	}

	// 2. Obtener profiles para cruzar opt_out, unsubscribe_token y locale
	type ProfileRow = {
		user_id: string;
		email_opt_out: boolean;
		unsubscribe_token: string;
		locale: string | null;
	};

	const { data: profiles, error: profilesError } = (await supabase
		.from('profiles')
		.select('user_id, email_opt_out, unsubscribe_token, locale')
		.eq('email_opt_out', false)) as {
		data: ProfileRow[] | null;
		error: unknown;
	};

	if (profilesError || !profiles) {
		throw new Error('Failed to fetch profiles');
	}

	// 3. Cruzar ambos en un Map para lookup eficiente
	const profileMap = new Map(profiles.map((p) => [p.user_id, p]));

	let sent = 0;
	let skipped = 0;
	let errors = 0;

	for (const authUser of usersData.users) {
		const profile = profileMap.get(authUser.id);

		if (!profile) {
			skipped++;
			continue;
		}

		const email = authUser.email;
		if (!email) {
			skipped++;
			continue;
		}

		const unsubscribeUrl = `${APP_URL}/unsubscribe?token=${profile.unsubscribe_token}`;
		const locale = profile.locale ?? 'en';

		const localeKey =
			locale === 'es' || locale === 'en' || locale === 'fr'
				? locale
				: 'en';

		const content = payload[localeKey];

		const { subject, html } = renderE1Broadcast({
			locale,
			appUrl: APP_URL,
			logoSymbolUrl: LOGO_SYMBOL_URL,
			footerLogoUrl: FOOTER_LOGO_URL,
			unsubscribeUrl,
			imageUrl: payload.imageUrl,
			ctaUrl: payload.ctaUrl,
			emailType: payload.emailType,
			...content,
		});

		const { error: sendError } = await resend.emails.send({
			from: 'BNBexplorer <contact@bnbexplorer.com>',
			to: [email],
			subject,
			html,
		});

		if (sendError) {
			console.error(`Failed to send to ${email}:`, sendError);
			errors++;
			continue;
		}

		// 4. Registrar en email_sequence_log
		const { error: logError } = await supabase
			.from('email_sequence_log')
			.insert({
				user_id: authUser.id,
				type: payload.emailType ?? 'newsletter',
				step: 1,
				ref_id: null,
			});

		if (logError) {
			console.error('Failed to log email:', logError);
		}

		sent++;
	}

	return { sent, skipped, errors };
}
