import { useTranslations } from 'next-intl';

import { GOOGLE_MAPS_DIRECTION_URL } from '@/config/config-constants';

import Image from 'next/image';
import IconDirections from '@/components/atoms/icon/directions';
import ButtonLink from '../../button-link';

type PlacePublicProps = {
	address: string;
	latitude: number;
	longitude: number;
	className?: string;
	image?: string;
	name: string;
};

const PlacePublic = ({
	address,
	latitude,
	longitude,
	className,
	name,
	image = '/static/img/placeholders/house-placeholder.png',
}: PlacePublicProps) => {
	const t = useTranslations();

	const graySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><rect width="4" height="4" fill="#a3e7d0" /></svg>`;
	const grayDataUrl = `data:image/svg+xml;base64,${Buffer.from(
		graySvg
	).toString('base64')}`;

	return (
		<div
			className={`w-full flex flex-col gap-4 rounded-xl p-2 relative transition-all hover:bg-gray-100 ${className}`}
		>
			<div className={`w-full flex gap-4 sm:items-center relative`}>
				<div className="w-18 h-18 rounded-md overflow-hidden relative shrink-0">
					<Image
						alt={name}
						className="object-cover z-0 "
						src={
							image === null
								? '/static/img/placeholders/house-placeholder.png'
								: image
						}
						placeholder="blur"
						blurDataURL={grayDataUrl}
						fill
					/>
				</div>
				<div className="flex flex-col gap-0 mr-auto">
					<h5 className="font-heading font-bold text-md">{name}</h5>
					<p className="font-body font-medium text-md mt-0.5 text-secondary-600">
						{address}
					</p>
				</div>
				<ButtonLink
					className="hidden gap-1 lg:flex shrink-0"
					color="primary"
					iconLeft={<IconDirections />}
					label={t('Como llegar')}
					href={`${GOOGLE_MAPS_DIRECTION_URL}${latitude},${longitude}`}
					target="_blank"
				/>
			</div>
			<div className="flex gap-2 w-full lg:hidden">
				<ButtonLink
					className="w-full"
					color="primary"
					iconLeft={<IconDirections />}
					label={t('Como llegar')}
					href={`${GOOGLE_MAPS_DIRECTION_URL}${latitude},${longitude}`}
					target="_blank"
				/>
			</div>
		</div>
	);
};

export default PlacePublic;
