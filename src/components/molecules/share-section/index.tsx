import { getTranslations } from 'next-intl/server';
import Typography from '@/components/atoms/typography';
import { ShareMenu } from '@/components/molecules/button-share';
import IconPersonAdd from '@/components/atoms/icon/person-add';
import DashboardCard from '@/components/organisms/dashboard-card';
import DashboardCardBody from '@/components/organisms/dashboard-card/dashboard-body';
import DashboardCardHeading from '@/components/organisms/dashboard-card/dashboard-heading';
import DashboardData from '@/components/organisms/dashboard-card/dashboard-data';

type Props = {
	userId: string;
};

const ShareSection = async ({ userId }: Props) => {
	const t = await getTranslations();

	return (
		<DashboardCard>
			<DashboardCardHeading>
				<div className="p-2 rounded-full bg-primary-50">
					<IconPersonAdd color="primary" />
				</div>
				<Typography component="h3" className="text-lg!">
					{t('shareButtonTitle')}
				</Typography>
			</DashboardCardHeading>

			<DashboardCardBody>
				<DashboardData
					label={
						<Typography size="sm" weight="medium">
							{t('shareButtonText')}
						</Typography>
					}
					action={
						<ShareMenu
							url="https://bnbexplorer.com"
							surface="landing_header"
							distinctId={userId}
							className="w-full lg:w-fit"
						/>
					}
				/>
			</DashboardCardBody>
		</DashboardCard>
	);
};

export default ShareSection;
