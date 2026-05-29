import { getTranslations, getLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types';

import { createSSRClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { getSeasonalTip } from '@/lib/get-seasonal-tip';

import Typography from '@/components/atoms/typography';
import DashboardCard from '@/components/organisms/dashboard-card';
import DashboardCardBody from '@/components/organisms/dashboard-card/dashboard-body';
import DashboardCardHeading from '@/components/organisms/dashboard-card/dashboard-heading';
import DashboardData from '@/components/organisms/dashboard-card/dashboard-data';
import IconLocationOn from '@/components/atoms/icon/location-on';

type WeekRow = {
	week_label: string;
	week_start: string;
	week_end: string;
	visit_count: number;
};

const PropertyVisitsStats = async () => {
	const t = await getTranslations();
	const locale = await getLocale();

	const ssrClient = await createSSRClient();
	const {
		data: { user },
		error: authError,
	} = await ssrClient.auth.getUser();

	if (authError || !user) redirect('/auth/login');

	const supabase = await createServerAdminClient();
	const db = supabase as unknown as SupabaseClient<Database>;

	const { data, error } = await db.rpc('get_property_visits_by_user', {
		p_user_id: user.id,
	});

	if (error || !data) return null;

	const mockRows: WeekRow[] = [
		{
			week_label: 'this_week',
			week_start: '2026-05-26',
			week_end: '2026-06-01',
			visit_count: 14,
		},
		{
			week_label: 'last_week',
			week_start: '2026-05-19',
			week_end: '2026-05-25',
			visit_count: 9,
		},
		{
			week_label: 'two_weeks_ago',
			week_start: '2026-05-12',
			week_end: '2026-05-18',
			visit_count: 21,
		},
	];

	const rows: WeekRow[] = mockRows;
	// const rows = data as WeekRow[];

	const totalVisits = rows.reduce((acc, r) => acc + (r.visit_count ?? 0), 0);

	if (totalVisits === 0) return null;

	const validLocales = ['es', 'en', 'fr'] as const;
	type ValidLocale = (typeof validLocales)[number];
	const safeLocale: ValidLocale = validLocales.includes(locale as ValidLocale)
		? (locale as ValidLocale)
		: 'es';

	const tip = getSeasonalTip(new Date(), safeLocale);

	const labelMap: Record<string, string> = {
		this_week: t('visitsThisWeek'),
		last_week: t('visitsLastWeek'),
		two_weeks_ago: t('visitsTwoWeeksAgo'),
	};

	const formatDateRange = (start: string, end: string) => {
		const s = new Date(start).toLocaleDateString(locale, {
			day: '2-digit',
			month: 'short',
		});
		const e = new Date(end).toLocaleDateString(locale, {
			day: '2-digit',
			month: 'short',
		});
		return `${s} - ${e}`;
	};

	return (
		<>
			<DashboardCard>
				<DashboardCardHeading>
					<div className="p-2 rounded-full bg-primary-50">
						<IconLocationOn color="primary" />
					</div>
					<Typography component="h3" className="text-lg!">
						{t('visitsTitle')}
					</Typography>
				</DashboardCardHeading>

				<DashboardCardBody>
					{rows.map((row) => (
						<DashboardData
							key={row.week_label}
							label={
								<div className="flex flex-col">
									<Typography size="sm" weight="medium">
										{labelMap[row.week_label] ??
											row.week_label}
									</Typography>
									<Typography size="sm" color="text-gray-500">
										{formatDateRange(
											row.week_start,
											row.week_end,
										)}
									</Typography>
								</div>
							}
							action={
								<Typography
									size="sm"
									weight="medium"
									color="text-primary-700"
									className="px-3 py-2 rounded-full bg-primary-100"
								>
									{row.visit_count}
								</Typography>
							}
						/>
					))}
					{tip && (
						<div className="flex flex-col gap-2 p-4 bg-primary-50 rounded-lg mt-3">
							<div className="flex items-center gap-2">
								<span className="text-2xl">{tip.emoji}</span>
								<Typography
									component="h3"
									size="base"
									weight="semibold"
								>
									{tip.title}
								</Typography>
							</div>
							<Typography size="sm" color="text-gray-600">
								{tip.text}
							</Typography>
						</div>
					)}
				</DashboardCardBody>
			</DashboardCard>
		</>
	);
};

export default PropertyVisitsStats;
