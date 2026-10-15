import { redirect } from 'next/navigation';
import { GlobalProvider } from '@/lib/context/GlobalContext';
import { AIUsageProvider } from '@/lib/context/AIUsageContext';
import AppLayout from '@/components/layouts/app';
import { getSidebarData } from '@/utils/get-sidebar-data';
import { EditMenuProvider } from '@/lib/context/EditMenuContext';
import EditorModalStorageCleaner from '@/components/cleanup/auto-content-modal-cleanup';

import { createSSRClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { trackEvent } from '@/lib/analytics/mixpanel';
import type { Database } from '@/lib/types';
import type { SupabaseClient } from '@supabase/supabase-js';

import { PaywallProvider } from '@/lib/context/PaywallContext';
import { getPaywallPhase } from '@/lib/paywall/getPaywallPhase';
import { resolvePaywallBehavior } from '@/lib/paywall/resolvePaywallBehavior';

export default async function Layout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const categories = await getSidebarData();

	const ssrClient = await createSSRClient();
	const {
		data: { user },
		error,
	} = await ssrClient.auth.getUser();
	if (error || !user) redirect('/auth/login');

	const supabase = await createServerAdminClient();

	// Update silencioso del locale
	await supabase
		.from('profiles')
		.update({ locale } as never)
		.eq('user_id', user.id);

	// Alta nueva: el update solo afecta a la fila si signup_tracked_at sigue
	// vacío, así que new_user se envía una única vez por usuario aunque haya
	// varias cargas a la vez.
	const db = supabase as unknown as SupabaseClient<Database>;
	const { data: newSignupRows } = await db
		.from('profiles')
		.update({ signup_tracked_at: new Date().toISOString() })
		.eq('user_id', user.id)
		.is('signup_tracked_at', null)
		.select('user_id')
		.overrideTypes<{ user_id: string }[], { merge: false }>();

	// Se espera al envío: la fila ya está marcada y no habrá otro intento,
	// así que no puede quedar a medias si la función termina antes.
	if (newSignupRows && newSignupRows.length > 0) {
		try {
			await trackEvent({
				event: 'new_user',
				distinctId: user.id,
				props: {
					signup_method: user.app_metadata?.provider ?? 'unknown',
					locale,
				},
			});
		} catch (e) {
			console.error('Mixpanel trackEvent failed:', e);
		}
	}

	const { count } = await supabase
		.from('properties')
		.select('*', { count: 'exact', head: true })
		.eq('user_id', user.id);

	const propertyCount = count ?? 0;

	const phase = getPaywallPhase();
	const plan = 'free' as const;

	const paywallBehavior = resolvePaywallBehavior({
		phase,
		plan,
		propertyCount,
	});

	return (
		<PaywallProvider
			value={{ phase, plan, propertyCount, paywallBehavior }}
		>
			<GlobalProvider>
				<AIUsageProvider>
					<AppLayout>
						<EditMenuProvider initialData={categories}>
							<EditorModalStorageCleaner />
							{children}
						</EditMenuProvider>
					</AppLayout>
				</AIUsageProvider>
			</GlobalProvider>
		</PaywallProvider>
	);
}
