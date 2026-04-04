import { getTranslations } from 'next-intl/server';
import clsx from 'clsx';
import BadgeCheck from '@/components/atoms/BadgeCheck';
import IconError from '@/components/atoms/icon/error';
import Typography from '@/components/atoms/typography';
import IconCircle from '@/components/atoms/icon/circle';
import IconCheckCircle from '@/components/atoms/icon/check-circle';
import Link from 'next/link';

type Props = {
	completedCount: number;
	incompleteCount: number;
};

const PropertiesStatus = async ({ completedCount, incompleteCount }: Props) => {
	const t = await getTranslations();

	return (
		<div className="flex flex-col justify-center gap-1 w-full p-3">
			<Typography component="h3" size="lg" className="mb-1">
				{t('propertiesStatusTitle')}
			</Typography>
			<div className="flex gap-1 w-full">
				<Link href="/app/properties" className="flex-1">
					<div className="rounded-full inline-flex items-center gap-1 font-bold text-xs pl-1.5 pr-3 py-1 cursor-pointer select-none transition-colors min-h-[32px] bg-primary-100 text-primary-900 hover:bg-primary-200 w-full">
						<IconCheckCircle color="primary" size={20} />
						<span>{`${t('propertiesStatus.completed')}: ${completedCount}`}</span>
					</div>
				</Link>
				<Link href="/app/properties" className="flex-1">
					<div className="rounded-full inline-flex items-center gap-1 font-bold text-xs pl-1.5 pr-3 py-1 cursor-pointer select-none transition-colors min-h-[32px] bg-error-100 text-error-900 hover:bg-error-200 w-full">
						<IconError color="error" size={20} />
						<span>{`${t('propertiesStatus.inProgress')}: ${incompleteCount}`}</span>
					</div>
				</Link>
			</div>
			<div className="flex flex-col gap-2 bg-white rounded-xl shadow-xs p-4">
				<div className="flex items-center gap-2">
					<span className="text-2xl">
						{t('dashboardPropertyTip.emoji')}
					</span>
					<Typography component="h3" size="base" weight="semibold">
						{t('dashboardPropertyTip.title')}
					</Typography>
				</div>
				<Typography size="sm" color="text-gray-600">
					{t('dashboardPropertyTip.description')}
				</Typography>
			</div>
		</div>
	);
};

export default PropertiesStatus;
