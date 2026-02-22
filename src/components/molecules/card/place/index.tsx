import { useTranslations } from 'next-intl';

import Image from 'next/image';
import IconDelete from '@/components/atoms/icon/delete';
import IconEdit from '@/components/atoms/icon/edit';
import Button from '../../button';
import ButtonIcon from '@/components/atoms/button-icon';
import IconFavorite from '@/components/atoms/icon/favorite';
import IconModeHeat from '@/components/atoms/icon/mode-heat';

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
	'/static/img/place-placeholder/place_placeholder_01.webp';

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

type PlaceProps = {
	address: string;
	categoryId?: string;
	description?: string;
	className?: string;
	editeable?: boolean;
	handleDelete?: () => void;
	handleEdit?: () => void;
	handleFeatured?: () => void;
	handleMustVisit?: () => void;
	image?: string | null;
	name: string;
	featured?: boolean;
	mustVisit?: boolean;
};

const Place = ({
	address,
	categoryId,
	description,
	className,
	editeable = false,
	handleDelete,
	handleEdit,
	handleFeatured,
	handleMustVisit,
	name,
	featured,
	mustVisit,
	image,
}: PlaceProps) => {
	const t = useTranslations();

	const graySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><rect width="4" height="4" fill="#a3e7d0" /></svg>`;
	const grayDataUrl = `data:image/svg+xml;base64,${Buffer.from(
		graySvg,
	).toString('base64')}`;

	const src = image ?? getPlaceholderImage(categoryId);

	return (
		<div
			className={`w-full flex flex-col gap-4 rounded-xl p-2 relative transition-all hover:shadow-xs hover:bg-white ${className}`}
		>
			<div className={`w-full flex gap-4 relative`}>
				<div className="w-18 h-18 rounded-md overflow-hidden relative shrink-0 bg-gradient-to-tr from-[#ffa263] to-[#6cffc9]">
					<Image
						alt={name}
						className="object-cover z-0 "
						placeholder="blur"
						blurDataURL={grayDataUrl}
						src={src}
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
					<ButtonIcon
						onClick={handleMustVisit}
						icon={<IconModeHeat />}
						className={`${mustVisit ? 'opacity-100' : 'opacity-30'} h-fit`}
						color={`${mustVisit ? 'error' : 'secondary'}`}
					/>
					<ButtonIcon
						onClick={handleFeatured}
						icon={<IconFavorite />}
						className={`${featured ? 'opacity-100' : 'opacity-30'} h-fit`}
						color={`${featured ? 'primary' : 'secondary'}`}
					/>
					<ButtonIcon
						onClick={handleDelete}
						icon={<IconDelete />}
						color="secondary"
						className="hidden sm:flex h-fit"
					/>
					{editeable && (
						<ButtonIcon
							onClick={handleEdit}
							icon={<IconEdit />}
							color="secondary"
							className="hidden sm:flex"
						/>
					)}
				</div>
			</div>
			<div className="flex gap-2 w-full lg:hidden rounded-full justify-around">
				<ButtonIcon
					onClick={handleMustVisit}
					icon={<IconModeHeat />}
					className={`${mustVisit ? 'opacity-100' : 'opacity-30'} w-full`}
					color={`${mustVisit ? 'error' : 'secondary'}`}
				/>
				<ButtonIcon
					onClick={handleFeatured}
					icon={<IconFavorite />}
					className={`${featured ? 'opacity-100' : 'opacity-30'} w-full`}
					color={`${featured ? 'primary' : 'secondary'}`}
				/>
				<ButtonIcon
					onClick={handleDelete}
					icon={<IconDelete />}
					color="secondary"
					className="w-full"
				/>
				{/* <Button
					className="w-full button__delete"
					color="secondary"
					iconLeft={<IconDelete />}
					label={t('Eliminar')}
					onClick={handleDelete}
				/> */}
				{editeable && (
					<Button
						className="w-full"
						iconLeft={<IconEdit />}
						label={t('Editar')}
						onClick={handleEdit}
					/>
				)}
			</div>
		</div>
	);
};

export default Place;
