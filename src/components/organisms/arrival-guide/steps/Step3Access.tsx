'use client';

import Typography from '@/components/atoms/typography';
import { useTranslations } from 'next-intl';

interface Props {
	accessInstructions: string | null;
}

export default function Step3Access({ accessInstructions }: Props) {
	const t = useTranslations('ArrivalGuide');

	return (
		<div className="flex flex-col gap-1">
			<Typography component="h3" size="lg" className="mb-2">
				{t('step3Title')}
			</Typography>
			{!accessInstructions ? (
				<Typography size="sm" weight="medium" color="text-gray-500">
					{t('step3Empty')}
				</Typography>
			) : (
				<Typography size="sm" weight="medium" color="text-gray-500">
					{accessInstructions}
				</Typography>
			)}
		</div>
	);
}
