'use client';

import Typography from '@/components/atoms/typography';
import { useTranslations } from 'next-intl';

interface Props {
	address: string;
}

export default function Step1Transport({ address }: Props) {
	const t = useTranslations('ArrivalGuide');

	return (
		<div className="flex flex-col gap-1">
			<Typography component="h3" size="lg" className="mb-2">
				{t('step1Title')}
			</Typography>
			<div className="rounded-xl bg-gray-100/50 p-4 flex flex-col gap-1">
				<Typography
					weight="semibold"
					fontFamily="base"
					color="text-gray-900"
				>
					{t('step1Taxi')}
				</Typography>
				<Typography size="sm" weight="medium" color="text-gray-500">
					{t('step1TaxiText')}
				</Typography>
				<Typography size="sm" weight="medium" color="text-primary-600">
					{address}
				</Typography>
			</div>
			<div className="rounded-xl bg-gray-100/50 p-4 flex flex-col gap-1">
				<Typography
					weight="semibold"
					fontFamily="base"
					color="text-gray-900"
				>
					{t('step1Car')}
				</Typography>
				<Typography size="sm" weight="medium" color="text-gray-500">
					{t('step1CarText')}
				</Typography>
				<Typography size="sm" weight="medium" color="text-primary-600">
					{address}
				</Typography>
			</div>
		</div>
	);
}
