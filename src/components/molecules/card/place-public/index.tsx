import { useTranslations } from 'next-intl';

import { GOOGLE_MAPS_DIRECTION_URL } from '@/config/config-constants';

import Image from 'next/image';
import IconDirections from '@/components/atoms/icon/directions';
import ButtonLink from '../../button-link';
import IconFavorite from '@/components/atoms/icon/favorite';
import IconModeHeat from '@/components/atoms/icon/mode-heat';
import Typography from '@/components/atoms/typography';

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
	image = '/static/img/place-placeholder/place_placeholder_01.webp',
}: PlacePublicProps) => {
	const t = useTranslations();

	const graySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><rect width="4" height="4" fill="#a3e7d0" /></svg>`;
	const grayDataUrl = `data:image/svg+xml;base64,${Buffer.from(
		graySvg,
	).toString('base64')}`;

	return (
		<div
			className={`flex gap-0 flex-col p-2 bg-white rounded-xl items-center justify-center text-center relative shadow-xs ${className}`}
		>
			<div className="relative grow min-h-[250px] h-full w-full rounded-md overflow-hidden bg-gradient-to-tr from-[#ffa263] to-[#6cffc9]">
				{(mustSee || featured) && (
					<div className="flex p-1 items-center absolute z-1 rounded-full right-2 top-2 gap-1">
						{mustSee && (
							<div className="p-1.5 rounded-full w-fit h-fit bg-white shadow-xs">
								<IconModeHeat color="error" size={20} />
							</div>
						)}
						{featured && (
							<div className="p-1.5 rounded-full w-fit h-fit bg-white shadow-xs">
								<IconFavorite color="primary" size={20} />
							</div>
						)}
					</div>
				)}
				<Image
					alt="Mountains"
					src={
						image === null
							? '/static/img/place-placeholder/place_placeholder_01.webp'
							: image
					}
					fill={true}
					className="object-cover w-full h-auto"
					blurDataURL={grayDataUrl}
				/>
			</div>
			<div className="p-2 w-full text-left flex flex-col gap-1">
				<Typography component="h5">{name}</Typography>
				<Typography>{address}</Typography>

				{description && (
					<p className="text-sm opacity-75">{description}</p>
				)}
			</div>
			<div className="p-2 w-full flex gap-2 items-center">
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
