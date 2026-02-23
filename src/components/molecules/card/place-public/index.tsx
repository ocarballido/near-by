import { useTranslations } from 'next-intl';

import { GOOGLE_MAPS_DIRECTION_URL } from '@/config/config-constants';

import Image from 'next/image';
import IconDirections from '@/components/atoms/icon/directions';
import ButtonLink from '../../button-link';
import Typography from '@/components/atoms/typography';
import IconLocationOn from '@/components/atoms/icon/location-on';
import IconModeHeat from '@/components/atoms/icon/mode-heat';
import IconFavorite from '@/components/atoms/icon/favorite';
import IconInfo from '@/components/atoms/icon/info';

import { CATEGORIES_SUB_CATEGORIES } from '@/config/config-constants';

type CategoryKey = keyof typeof CATEGORIES_SUB_CATEGORIES;
type CategoryId = (typeof CATEGORIES_SUB_CATEGORIES)[CategoryKey]['id'];

const {
	HEALTH_AND_WELLNESS,
	FOOD_AND_DRINK,
	ARTS_AND_CULTURE,
	PARKS_AND_NATURE,
	SHOPPING,
	SERVICES,
	TRANSPORTATION,
	ENTERTAINMENT_AND_NIGHTLIFE,
	ATTRACTIONS_AND_TOURISM,
	SECURITY_AND_EMERGENCIES,
	FAMILY_AND_KIDS,
	PETS,
} = CATEGORIES_SUB_CATEGORIES;

const DEFAULT_PLACEHOLDER =
	'/static/img/place-placeholder/place_placeholder_04.webp';

const CATEGORY_PLACEHOLDER = {
	[HEALTH_AND_WELLNESS.id]:
		'/static/img/place-placeholder/place_placeholder_01.webp',
	[FOOD_AND_DRINK.id]:
		'/static/img/place-placeholder/place_placeholder_09.webp',
	[ARTS_AND_CULTURE.id]:
		'/static/img/place-placeholder/place_placeholder_04.webp',
	[PARKS_AND_NATURE.id]:
		'/static/img/place-placeholder/place_placeholder_08.webp',
	[SHOPPING.id]: '/static/img/place-placeholder/place_placeholder_12.webp',
	[SERVICES.id]: '/static/img/place-placeholder/place_placeholder_05.webp',
	[TRANSPORTATION.id]:
		'/static/img/place-placeholder/place_placeholder_11.webp',
	[ENTERTAINMENT_AND_NIGHTLIFE.id]:
		'/static/img/place-placeholder/place_placeholder_07.webp',
	[ATTRACTIONS_AND_TOURISM.id]:
		'/static/img/place-placeholder/place_placeholder_06.webp',
	[SECURITY_AND_EMERGENCIES.id]:
		'/static/img/place-placeholder/place_placeholder_01.webp',
	[FAMILY_AND_KIDS.id]:
		'/static/img/place-placeholder/place_placeholder_08.webp',
	[PETS.id]: '/static/img/place-placeholder/place_placeholder_10.webp',
} satisfies Record<CategoryId, string>;

// Type guard: convierte string -> CategoryId cuando corresponde
const isCategoryId = (value: string): value is CategoryId => {
	return Object.prototype.hasOwnProperty.call(CATEGORY_PLACEHOLDER, value);
};

const getPlaceholderImage = (categoryId?: string): string => {
	if (categoryId && isCategoryId(categoryId)) {
		return CATEGORY_PLACEHOLDER[categoryId];
	}
	return DEFAULT_PLACEHOLDER;
};

type PlacePublicProps = {
	address: string;
	categoryId?: string;
	description?: string;
	latitude?: number;
	longitude?: number;
	featured?: boolean;
	mustSee?: boolean;
	image?: string;
	name: string;
};

const PlacePublic = ({
	address,
	categoryId,
	description,
	latitude,
	longitude,
	featured,
	mustSee,
	name,
	image,
}: PlacePublicProps) => {
	const t = useTranslations();

	const graySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><rect width="4" height="4" fill="#a3e7d0" /></svg>`;
	const grayDataUrl = `data:image/svg+xml;base64,${Buffer.from(
		graySvg,
	).toString('base64')}`;

	const src = image ?? getPlaceholderImage(categoryId);

	return (
		<div
			className={`flex items-end rounded-xl overflow-hidden px-2 pb-2 pt-[180px] relative min-h-[400px] transition-all [&>.content]:p-3 [&>.content]:rounded-lg shadow-xs hover:px-0 hover:pb-0 hover:pt-[172px] hover:[&>.content]:p-5 hover:[&>.content]:rounded-none bg-gradient-to-tr from-[#ffa263] to-[#6cffc9]`}
		>
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
			<div className="content transition-all flex justify-end gap-2 flex-col relative w-full bg-white z-5">
				<div className="flex gap-2">
					<Typography component="h5">{name}</Typography>
				</div>
				<div className="flex gap-1.5">
					<span className="grow-0">
						<IconLocationOn color="primary" />
					</span>
					<Typography weight="medium">{address}</Typography>
				</div>
				{description && (
					<div className="flex gap-1.5">
						<span className="grow-0">
							<IconInfo color="primary" />
						</span>
						<Typography
							weight="normal"
							size="sm"
							color="text-gray-500"
						>
							{description}
						</Typography>
					</div>
				)}
				<ButtonLink
					className="w-full mt-2"
					color="primary"
					iconLeft={<IconDirections />}
					label={t('Como llegar')}
					href={`${GOOGLE_MAPS_DIRECTION_URL}${latitude},${longitude}`}
					target="_blank"
				/>
			</div>
			<Image
				className="object-cover z-0"
				src={src}
				fill={true}
				placeholder="blur"
				blurDataURL={grayDataUrl}
				alt={name}
			/>
		</div>
	);
};

export default PlacePublic;
