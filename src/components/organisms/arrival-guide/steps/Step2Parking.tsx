'use client';

import { useTranslations } from 'next-intl';
import type { ArrivalParking } from '@/app/[locale]/public/[...slug]/_data';
import Typography from '@/components/atoms/typography';
import ButtonLink from '@/components/molecules/button-link';
import IconOpenInNew from '@/components/atoms/icon/open-in-new';
import IconLocationOn from '@/components/atoms/icon/location-on';

interface Props {
	parkings: ArrivalParking[];
}

function mapsUrl(name: string, address: string) {
	return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + address)}`;
}

export default function Step2Parking({ parkings }: Props) {
	const t = useTranslations('ArrivalGuide');

	return (
		<div className="flex flex-col gap-1">
			<Typography component="h3" size="lg" className="mb-2">
				{t('step2Title')}
			</Typography>
			{parkings.length === 0 ? (
				<p className="text-sm text-gray-500">{t('step2Empty')}</p>
			) : (
				<ul className="flex flex-col gap-1">
					{parkings.map((p) => (
						<li
							key={p.id}
							className="rounded-xl bg-gray-100/50 p-4 flex items-center justify-between gap-2"
						>
							<div className="flex flex-col">
								<Typography
									weight="semibold"
									fontFamily="base"
									color="text-gray-900"
								>
									{p.name}
								</Typography>
								<Typography
									size="sm"
									weight="medium"
									color="text-gray-500"
								>
									{p.address}
								</Typography>
							</div>
							<ButtonLink
								label=""
								href={mapsUrl(p.name, p.address)}
								target="_blank"
								color="white"
								className="px-2!"
								iconLeft={<IconLocationOn />}
							/>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
