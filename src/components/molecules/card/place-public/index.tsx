import { useTranslations } from 'next-intl';

import { GOOGLE_MAPS_DIRECTION_URL } from '@/config/config-constants';

import Image from 'next/image';
import IconDirections from '@/components/atoms/icon/directions';
import ButtonLink from '../../button-link';
import IconFavorite from '@/components/atoms/icon/favorite';
import IconModeHeat from '@/components/atoms/icon/mode-heat';

type PlacePublicProps = {
	address: string;
	description?: string;
	latitude?: number;
	longitude?: number;
	className?: string;
	featured?: boolean;
	mustSee?: boolean;
	image?: string;
	name: string;
};

const PlacePublic = ({
	address,
	description,
	latitude,
	longitude,
	className,
	featured,
	mustSee,
	name,
	image = '/static/img/default-location-2x.webp',
}: PlacePublicProps) => {
	const t = useTranslations();

	const graySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><rect width="4" height="4" fill="#a3e7d0" /></svg>`;
	const grayDataUrl = `data:image/svg+xml;base64,${Buffer.from(
		graySvg,
	).toString('base64')}`;

	return (
		<div
			className={`w-full flex flex-col gap-4 rounded-xl p-2 relative transition-all bg-white shadow-xs ${className}`}
		>
			<div className={`w-full flex gap-4 relative`}>
				<div className="w-18 h-18 rounded-md overflow-hidden relative shrink-0">
					<Image
						alt={name ?? 'Place image'}
						className="object-cover z-0 "
						src={
							image === null
								? '/static/img/default-location-2x.webp'
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
					{description && (
						<p className="text-sm opacity-75">{description}</p>
					)}
				</div>
				<div className="gap-1 lg:flex hidden items-center">
					{mustSee && (
						<div className="p-1.5 rounded-full w-fit h-fit">
							<IconModeHeat color="error" />
						</div>
					)}
					{featured && (
						<div className="p-1.5 rounded-full w-fit h-fit">
							<IconFavorite color="primary" />
						</div>
					)}
				</div>
				<ButtonLink
					className="hidden gap-1 lg:flex shrink-0 h-fit self-center"
					color="primary"
					iconLeft={<IconDirections />}
					label={t('Como llegar')}
					href={`${GOOGLE_MAPS_DIRECTION_URL}${latitude},${longitude}`}
					target="_blank"
				/>
			</div>
			<div className="flex gap-2 w-full lg:hidden">
				{mustSee && (
					<div className="p-1.5 rounded-full w-fit h-fit">
						<IconModeHeat color="error" />
					</div>
				)}
				{featured && (
					<div className="p-1.5 rounded-full w-fit h-fit">
						<IconFavorite color="primary" />
					</div>
				)}
				<ButtonLink
					className="w-fit ml-auto"
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
