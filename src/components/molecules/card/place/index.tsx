import { useTranslations } from 'next-intl';

import Image from 'next/image';
import IconDelete from '@/components/atoms/icon/delete';
import IconEdit from '@/components/atoms/icon/edit';
import Button from '../../button';
import ButtonIcon from '@/components/atoms/button-icon';
import IconFavorite from '@/components/atoms/icon/favorite';
import IconModeHeat from '@/components/atoms/icon/mode-heat';

type PlaceProps = {
	address: string;
	description?: string;
	className?: string;
	editeable?: boolean;
	handleDelete?: () => void;
	handleEdit?: () => void;
	handleFeatured?: () => void;
	handleMustVisit?: () => void;
	image?: string;
	name: string;
	featured?: boolean;
	mustVisit?: boolean;
};

const Place = ({
	address,
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
	image = '/static/img/place-placeholder/place_placeholder_01.webp',
}: PlaceProps) => {
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
				<div className="w-18 h-18 rounded-md overflow-hidden relative shrink-0 bg-gradient-to-tr from-[#ffa263] to-[#6cffc9]">
					<Image
						alt={name}
						className="object-cover z-0 "
						placeholder="blur"
						blurDataURL={grayDataUrl}
						src={
							image === null
								? '/static/img/place-placeholder/place_placeholder_01.webp'
								: image
						}
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
