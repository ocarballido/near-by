'use client';

import { useTranslations } from 'next-intl';
import Typography from '@/components/atoms/typography';

interface Props {
	wifi: string | null;
	checkInTime: string | null;
	checkOutTime: string | null;
	emergencyNumber: string | null;
}

export default function Step4Essentials({
	wifi,
	checkInTime,
	checkOutTime,
	emergencyNumber,
}: Props) {
	const t = useTranslations('ArrivalGuide');

	return (
		<div className="flex flex-col gap-1">
			<Typography component="h3" size="lg" className="mb-2">
				{t('step4Title')}
			</Typography>
			<div className="rounded-xl bg-gray-100/50 p-4 flex flex-col gap-1">
				<Typography
					weight="semibold"
					fontFamily="base"
					color="text-gray-900"
				>
					{t('step4Wifi')}
				</Typography>
				{!wifi ? (
					<Typography size="sm" weight="medium" color="text-gray-500">
						{t('step4WifiEmpty')}
					</Typography>
				) : (
					<Typography size="sm" weight="medium" color="text-gray-500">
						{wifi}
					</Typography>
				)}
			</div>

			{checkInTime && (
				<div className="rounded-xl bg-gray-100/50 p-4 flex items-center justify-between">
					<Typography
						weight="semibold"
						fontFamily="base"
						color="text-gray-900"
					>
						{t('step4CheckIn')}
					</Typography>
					<Typography size="sm" weight="medium" color="text-gray-500">
						{checkInTime}
					</Typography>
				</div>
			)}

			{checkOutTime && (
				<div className="rounded-xl bg-gray-100/50 p-4 flex items-center justify-between">
					<Typography
						weight="semibold"
						fontFamily="base"
						color="text-gray-900"
					>
						{t('step4CheckOut')}
					</Typography>
					<Typography size="sm" weight="medium" color="text-gray-500">
						{checkOutTime}
					</Typography>
				</div>
			)}

			{emergencyNumber && (
				<div className="rounded-xl bg-red-50 p-3 flex items-center justify-between">
					<Typography
						weight="semibold"
						fontFamily="base"
						color="text-red-700"
					>
						{t('step4Emergency')}
					</Typography>
					<Typography size="sm" weight="medium" color="text-red-700">
						{emergencyNumber}
					</Typography>
				</div>
			)}
		</div>
	);
}
