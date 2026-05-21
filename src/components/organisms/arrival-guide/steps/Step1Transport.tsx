'use client';

import { useTranslations } from 'next-intl';

import Typography from '@/components/atoms/typography';
import ButtonLink from '@/components/molecules/button-link';
import IconLocationOn from '@/components/atoms/icon/location-on';

interface Props {
	address: string;
}

export default function Step1Transport({ address }: Props) {
	const t = useTranslations('ArrivalGuide');

	const drivingUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}&travelmode=driving`;
	const transitUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}&travelmode=transit`;

	return (
		<div className="flex flex-col gap-1">
			<Typography component="h3" size="lg" className="mb-2">
				{t('step1Title')}
			</Typography>

			<div className="rounded-xl bg-gray-100/50 p-4 flex items-center justify-between gap-2">
				<div className="flex flex-col">
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
					<Typography
						size="sm"
						weight="medium"
						color="text-primary-600"
					>
						{address}
					</Typography>
				</div>
				<ButtonLink
					label=""
					href={drivingUrl}
					target="_blank"
					color="white"
					className="px-2!"
					iconLeft={<IconLocationOn />}
				/>
			</div>

			<div className="rounded-xl bg-gray-100/50 p-4 flex items-center justify-between gap-2">
				<div className="flex flex-col">
					<Typography
						weight="semibold"
						fontFamily="base"
						color="text-gray-900"
					>
						{t('step1Transit')}
					</Typography>
					<Typography size="sm" weight="medium" color="text-gray-500">
						{t('step1TransitText')}
					</Typography>
				</div>
				<ButtonLink
					label=""
					href={transitUrl}
					target="_blank"
					color="white"
					className="px-2!"
					iconLeft={<IconLocationOn />}
				/>
			</div>

			<div className="rounded-xl bg-gray-100/50 p-4 flex items-center justify-between gap-2">
				<div className="flex flex-col">
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
					<Typography
						size="sm"
						weight="medium"
						color="text-primary-600"
					>
						{address}
					</Typography>
				</div>
				<ButtonLink
					label=""
					href={drivingUrl}
					target="_blank"
					color="white"
					className="px-2!"
					iconLeft={<IconLocationOn />}
				/>
			</div>
		</div>
	);
}
