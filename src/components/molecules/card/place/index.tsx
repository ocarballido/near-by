import { useTranslations } from 'next-intl';

import Image from 'next/image';
import IconDelete from '@/components/atoms/icon/delete';
import IconEdit from '@/components/atoms/icon/edit';
import Button from '../../button';
import ButtonIcon from '@/components/atoms/button-icon';

type PlaceProps = {
	address: string;
	className?: string;
	editeable?: boolean;
	handleDelete?: () => void;
	handleEdit?: () => void;
	image?: string;
	name: string;
};

const Place = ({
	address,
	className,
	editeable = false,
	handleDelete,
	handleEdit,
	name,
	image = '/static/img/placeholders/house-placeholder.png',
}: PlaceProps) => {
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
						placeholder="blur"
						blurDataURL={grayDataUrl}
						src={
							image === null
								? '/static/img/placeholders/house-placeholder.png'
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
				</div>
				<div className="hidden gap-1 sm:flex">
					<ButtonIcon
						onClick={handleDelete}
						icon={<IconDelete />}
						color="secondary"
					/>
					{editeable && (
						<ButtonIcon
							onClick={handleEdit}
							icon={<IconEdit />}
							color="secondary"
						/>
					)}
				</div>
			</div>
			<div className="flex gap-2 w-full sm:hidden">
				<Button
					className="w-full button__delete"
					color="secondary"
					iconLeft={<IconDelete />}
					label={t('Eliminar')}
					onClick={handleDelete}
				/>
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
