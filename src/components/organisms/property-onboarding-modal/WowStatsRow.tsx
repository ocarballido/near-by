'use client';

import Typography from '@/components/atoms/typography';
import { useCountUp } from '@/hooks/useCountUp';
import { useTranslations } from 'next-intl';

interface Props {
	totalLocations: number;
	totalInfo: number;
}

interface StatItemProps {
	value: number | string;
	label: string;
}

function StatItem({ value, label }: StatItemProps) {
	return (
		<div className="flex flex-col items-center gap-1 flex-1">
			<Typography component="span" size="xl" color="text-primary-500">
				{value}
			</Typography>
			<Typography
				component="span"
				lineHeight="tight"
				className="text-center text-xs"
			>
				{label}
			</Typography>
		</div>
	);
}

export function WowStatsRow({ totalLocations, totalInfo }: Props) {
	const t = useTranslations('wow');
	const animatedLocations = useCountUp(totalLocations);
	const animatedInfo = useCountUp(totalInfo);

	return (
		<div className="flex items-stretch justify-around gap-2 rounded-xl bg-primary-50 p-3">
			<StatItem value={animatedLocations} label={t('stats.locations')} />
			<div className="w-px bg-primary-100" />
			<StatItem value={animatedInfo} label={t('stats.infoSections')} />
		</div>
	);
}
