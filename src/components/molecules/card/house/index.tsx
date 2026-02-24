import { useTranslations, useLocale } from 'next-intl';

import Image from 'next/image';
import IconApartment from '@/components/atoms/icon/apartment';
import IconLocationOn from '@/components/atoms/icon/location-on';
import IconDelete from '@/components/atoms/icon/delete';
import IconEdit from '@/components/atoms/icon/edit';
import IconCheckIn from '@/components/atoms/icon/check-in';
import IconCheckOut from '@/components/atoms/icon/check-out';
import Button from '../../button';
import ButtonLink from '../../button-link';
import IconOpenInNew from '@/components/atoms/icon/open-in-new';
import PropertySteps from '../../property-steps';
import Typography from '@/components/atoms/typography';

import { formatDate, formatTime } from '@/utils/format-date-time';

type HouseProps = {
	address: string;
	className?: string;
	handleDelete?: () => void;
	href?: string;
	propertyId?: string;
	image?: string | null;
	name: string;
	deleatable?: boolean;
	editeable?: boolean;
	hasLocation?: boolean;
	hasInfo?: boolean;
	checkInDate?: string;
	checkInTime?: string;
	checkOutDate?: string;
	checkOutTime?: string;
};

const House = ({
	address,
	className,
	handleDelete,
	href,
	propertyId,
	name,
	deleatable = true,
	editeable = true,
	hasLocation,
	hasInfo,
	checkInDate,
	checkInTime,
	checkOutDate,
	checkOutTime,
	image = '/static/img/default-property-2x.webp',
}: HouseProps) => {
	const t = useTranslations();
	const locale = useLocale();

	const graySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><rect width="4" height="4" fill="#a3e7d0" /></svg>`;
	const grayDataUrl = `data:image/svg+xml;base64,${Buffer.from(
		graySvg,
	).toString('base64')}`;

	return (
		<div
			className={`flex items-end rounded-xl overflow-hidden px-2 pb-2 pt-[180px] relative min-h-[400px] transition-all [&>.content]:p-3 [&>.content]:rounded-lg hover:shadow-2xl hover:px-0 hover:pb-0 hover:pt-[172px] hover:[&>.content]:p-5 hover:[&>.content]:rounded-none ${className}`}
		>
			<ButtonLink
				className="w-fit absolute z-6 top-2 right-2 rounded-full !pr-2 pl-2"
				iconRight={<IconOpenInNew />}
				label=""
				color="white"
				href={`/public/${propertyId}/welcome/highlights`}
				target="_blank"
			/>
			<div className="content transition-all flex justify-end gap-2 flex-col relative w-full bg-white z-5">
				<div className="flex gap-2 items-center">
					<span className="grow-0 p-1.5 bg-primary-100 rounded-full h-fit">
						<IconApartment color="primary" size={18} />
					</span>
					<Typography component="h5">{name}</Typography>
				</div>
				<div className="flex gap-2  items-center">
					<span className="grow-0 p-1.5 bg-primary-100 rounded-full h-fit">
						<IconLocationOn color="primary" size={18} />
					</span>
					<Typography size="sm" weight="medium" color="text-gray-600">
						{address}
					</Typography>
				</div>
				{(checkInDate ||
					checkInTime ||
					checkOutDate ||
					checkInTime) && (
					<div className="flex gap-2 flex-wrap">
						{(checkInDate || checkInTime) && (
							<div className="flex gap-2 flex-1 items-center">
								<span className="grow-0 p-1.5 bg-primary-100 rounded-full h-fit">
									<IconCheckIn size={18} color="primary" />
								</span>
								<Typography
									size="sm"
									color="text-gray-600"
									weight="medium"
								>
									{checkInDate && (
										<span className="mr-2">
											{formatDate(checkInDate, locale)}
										</span>
									)}
									{checkInTime && (
										<span>
											{formatTime(checkInTime, locale)}
										</span>
									)}
								</Typography>
							</div>
						)}
						{(checkOutDate || checkInTime) && (
							<div className="flex gap-2 flex-1 items-center">
								<span className="grow-0 p-1.5 bg-primary-100 rounded-full h-fit">
									<IconCheckOut size={18} color="primary" />
								</span>
								<Typography
									size="sm"
									weight="medium"
									color="text-gray-600"
								>
									{checkOutDate && (
										<span className="mr-2">
											{formatDate(checkOutDate, locale)}
										</span>
									)}
									{checkOutTime && (
										<span>
											{formatTime(checkOutTime, locale)}
										</span>
									)}
								</Typography>
							</div>
						)}
					</div>
				)}
				{(!hasInfo || !hasLocation) && (
					<PropertySteps
						hasLocation={hasLocation || false}
						hasInfo={hasInfo || false}
					/>
				)}
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
						? '/static/img/default-property-2x.webp'
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
