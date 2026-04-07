import { redirect } from 'next/navigation';
import { GlobalProvider } from '@/lib/context/GlobalContext';
import { AIUsageProvider } from '@/lib/context/AIUsageContext';
import AppLayout from '@/components/layouts/app';
import { getSidebarData } from '@/utils/get-sidebar-data';
import { EditMenuProvider } from '@/lib/context/EditMenuContext';
import EditorModalStorageCleaner from '@/components/cleanup/auto-content-modal-cleanup';

import { createSSRClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';

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
