'use client';

import Typography from '@/components/atoms/typography';
import { useTranslations } from 'next-intl';

export default function Step5Done() {
	const t = useTranslations('ArrivalGuide');

	return (
		<div className="flex flex-col items-center justify-center gap-1 py-4 text-center">
			<span className="text-5xl">🎉</span>
			<Typography component="h3" size="lg" className="mb-2">
				{t('step5Title')}
			</Typography>
			<Typography>{t('step5Subtitle')}</Typography>
		</div>
	);
}
