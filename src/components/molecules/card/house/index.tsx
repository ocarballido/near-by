import { useTranslations } from 'next-intl';

import Image from 'next/image';
import IconApartment from '@/components/atoms/icon/apartment';
import IconLocationOn from '@/components/atoms/icon/location-on';
import IconDelete from '@/components/atoms/icon/delete';
import IconEdit from '@/components/atoms/icon/edit';
import Button from '../../button';
import ButtonLink from '../../button-link';

type HouseProps = {
	address: string;
	className?: string;
	handleDelete?: () => void;
	href?: string;
	image?: string | null;
	name: string;
	deleatable?: boolean;
	editeable?: boolean;
};

const House = ({
	address,
	className,
	handleDelete,
	href,
	name,
	deleatable = true,
	editeable = true,
	image = '/static/img/placeholders/house-placeholder.png',
}: HouseProps) => {
	const t = useTranslations();

	const graySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><rect width="4" height="4" fill="#a3e7d0" /></svg>`;
	const grayDataUrl = `data:image/svg+xml;base64,${Buffer.from(
		graySvg
	).toString('base64')}`;

	return (
		<div
			className={`flex items-end rounded-xl overflow-hidden p-2 relative h-[400px] transition-all [&>.content]:p-3 [&>.content]:rounded-lg hover:shadow-2xl hover:p-0 hover:[&>.content]:p-5 hover:[&>.content]:rounded-none ${className}`}
		>
			<div className="content transition-all flex justify-end gap-2 flex-col relative w-full bg-white z-5">
				<div className="flex gap-2">
					<IconApartment />
					<h5 className="font-heading font-bold text-md mt-0.5">
						{name}
					</h5>
				</div>
				<div className="flex gap-2 mb-2">
					<IconLocationOn />
					<p className="font-body font-medium text-md mt-0.5">
						{address}
					</p>
				</div>
				<div className="flex gap-2 w-full">
					{deleatable && (
						<Button
							className="w-full button__delete"
							color="secondary"
							iconLeft={<IconDelete />}
							label={t('Eliminar')}
							onClick={handleDelete}
						/>
					)}
					{editeable && href && (
						<ButtonLink
							className="w-full"
							iconLeft={<IconEdit />}
							label={t('Editar')}
							href={href}
						/>
					)}
				</div>
			</div>
			<Image
				className="object-cover z-0"
				src={
					image === null
						? '/static/img/placeholders/house-placeholder.png'
						: image
				}
				fill={true}
				placeholder="blur"
				blurDataURL={grayDataUrl}
				alt={name}
			/>
		</div>
	);
};

export default House;
