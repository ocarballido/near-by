import { getTranslations, getLocale } from 'next-intl/server';
import Typography from '@/components/atoms/typography';
import ButtonLink from '@/components/molecules/button-link';
import IconArrowRightAlt from '@/components/atoms/icon/arrow-right-alt';
import { CATEGORIES_SUB_CATEGORIES } from '@/config/config-constants';
import { formatRelativeDays } from '@/utils/format-relative-days';
import IconEdit from '@/components/atoms/icon/edit';
import DashboardCard from '@/components/organisms/dashboard-card';
import DashboardCardBody from '@/components/organisms/dashboard-card/dashboard-body';
import DashboardCardHeading from '@/components/organisms/dashboard-card/dashboard-heading';
import DashboardData from '@/components/organisms/dashboard-card/dashboard-data';

type Props = {
	lastEdited: { id: string; name: string; updated_at: string } | null;
};

const LastActivity = async ({ lastEdited }: Props) => {
	const t = await getTranslations();
	const locale = await getLocale();

	if (!lastEdited?.updated_at) return null;

	return (
		<DashboardCard>
			<DashboardCardHeading>
				<div className="p-2 rounded-full bg-primary-50">
					<IconEdit color="primary" />
				</div>
				<Typography component="h3" className="text-lg!">
					{t('lastActivity.title')}
				</Typography>
			</DashboardCardHeading>

			<DashboardCardBody>
				<DashboardData
					label={
						<Typography size="sm" weight="medium">
							{t('lastActivity.edited', {
								property: lastEdited.name,
								time: formatRelativeDays(
									lastEdited.updated_at,
									locale,
								),
							})}
						</Typography>
					}
					action={
						<ButtonLink
							label={t('lastActivity.seeProperty')}
							color="secondary"
							href={`/app/properties/${lastEdited.id}/${CATEGORIES_SUB_CATEGORIES.LODGING.id}/${CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.MANUAL.id}`}
							className="w-full lg:w-fit"
							iconRight={<IconArrowRightAlt />}
						/>
					}
				/>
			</DashboardCardBody>
		</DashboardCard>
	);
};

export default LastActivity;
