import { redirect } from 'next/navigation';
import { createSSRClient } from '@/lib/supabase/server';
import { trackEvent } from '@/lib/analytics/mixpanel';

import AppContentTemplate from '@/components/templates/app-content';
import PropertyNumber from '@/components/molecules/property-number';

type PageProps = {
	searchParams?: Promise<{ fromAuth?: string }>;
};

export default async function DashboardContent({ searchParams }: PageProps) {
	const { fromAuth } = (await searchParams) ?? {};
	const shouldForceFirstProperty = fromAuth === '1';

	const ssrClient = await createSSRClient();
	const {
		data: { user },
		error: authError,
	} = await ssrClient.auth.getUser();

	if (authError || !user) redirect('/auth/login');

	if (shouldForceFirstProperty) {
		try {
			await trackEvent({
				event: 'onboarding_start',
				distinctId: user.id,
				props: {
					page: 'dashboard_home',
					fromAuth: 1,
				},
			});
		} catch {
			// no romper
		}
	}

	return (
		<AppContentTemplate>
			<div className="p-4 font-roboto flex flex-col grow justify-center items-center gap-8 rounded-lg overflow-hidden">
				<PropertyNumber
					shouldForceFirstProperty={shouldForceFirstProperty}
				/>
			</div>
		</AppContentTemplate>
	);
}
