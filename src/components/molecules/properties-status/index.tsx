import { getTranslations } from 'next-intl/server';
import clsx from 'clsx';
import BadgeCheck from '@/components/atoms/BadgeCheck';
import IconError from '@/components/atoms/icon/error';
import Typography from '@/components/atoms/typography';
import IconCircle from '@/components/atoms/icon/circle';
import IconCheckCircle from '@/components/atoms/icon/check-circle';
import Link from 'next/link';
import IconApartment from '@/components/atoms/icon/apartment';
import ButtonLink from '../button-link';
import IconArrowRightAlt from '@/components/atoms/icon/arrow-right-alt';
import DashboardCard from '@/components/organisms/dashboard-card';
import DashboardCardBody from '@/components/organisms/dashboard-card/dashboard-body';
import DashboardCardHeading from '@/components/organisms/dashboard-card/dashboard-heading';
import DashboardData from '@/components/organisms/dashboard-card/dashboard-data';

type Props = {
	completedCount: number;
	incompleteCount: number;
};

const PropertiesStatus = async ({ completedCount, incompleteCount }: Props) => {
	const t = await getTranslations();

	return (
		<DashboardCard>
			<DashboardCardHeading>
				<div className="p-2 rounded-full bg-primary-50">
					<IconApartment color="primary" />
				</div>
				<Typography component="h3" className="text-lg!">
					{t('propertiesStatusTitle')}
				</Typography>
			</DashboardCardHeading>

			<DashboardCardBody>
				<DashboardData
					label={
						<Typography
							size="sm"
							weight="medium"
							className="flex gap-2 items-center"
						>
							<IconCheckCircle color="primary" />
							{t('propertiesStatus.completed')}
						</Typography>
					}
					action={
						<ButtonLink
							label={`${completedCount} ${t('propertiesStatus.properties')}`}
							color="primary"
							href="/app/properties"
							iconRight={<IconArrowRightAlt />}
							className="shrink-0"
						/>
					}
				/>
				<DashboardData
					label={
						<Typography
							size="sm"
							weight="medium"
							className="flex gap-2 items-center"
						>
							<IconError color="error" />
							{t('propertiesStatus.inProgress')}
						</Typography>
					}
					action={
						incompleteCount ? (
							<ButtonLink
								label={`${incompleteCount} ${t('propertiesStatus.properties')}`}
								color="error"
								href="/app/properties"
								iconRight={<IconArrowRightAlt color="error" />}
								className="shrink-0"
							/>
						) : (
							<ButtonLink
								label={`${incompleteCount} ${t('propertiesStatus.properties')}`}
								color="error"
								href="/app/properties"
								iconRight={<IconArrowRightAlt color="error" />}
								className="shrink-0"
							/>
						)
					}
				/>
				<div className="flex flex-col gap-2 p-4 bg-primary-50 rounded-lg mt-3">
					<div className="flex items-center gap-2">
						<span className="text-2xl">
							{t('dashboardPropertyTip.emoji')}
						</span>
						<Typography
							component="h3"
							size="base"
							weight="semibold"
						>
							{t('dashboardPropertyTip.title')}
						</Typography>
					</div>
					<Typography size="sm" color="text-gray-600">
						{t('dashboardPropertyTip.description')}
					</Typography>
				</div>
			</DashboardCardBody>
		</DashboardCard>
	);
};

export default PropertiesStatus;
