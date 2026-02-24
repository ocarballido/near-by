import { useTranslations, useLocale } from 'next-intl';

import { GOOGLE_MAPS_DIRECTION_URL } from '@/config/config-constants';

import Image from 'next/image';
import IconDirections from '@/components/atoms/icon/directions';
import ButtonLink from '../../button-link';
import Typography from '@/components/atoms/typography';
import IconLocationOn from '@/components/atoms/icon/location-on';
import IconModeHeat from '@/components/atoms/icon/mode-heat';
import IconFavorite from '@/components/atoms/icon/favorite';
import IconCheckIn from '@/components/atoms/icon/check-in';
import IconCheckOut from '@/components/atoms/icon/check-out';

import { formatDate, formatTime } from '@/utils/format-date-time';

type HousePublicProps = {
	address: string;
	className?: string;
	latitude?: number;
	longitude?: number;
	featured?: boolean;
	mustSee?: boolean;
	image?: string | null;
	name: string;
	checkInDate?: string;
	checkInTime?: string;
	checkOutDate?: string;
	checkOutTime?: string;
};

const HousePublic = ({
	address,
	className,
	latitude,
	longitude,
	featured,
	mustSee,
	name,
	checkInDate,
	checkInTime,
	checkOutDate,
	checkOutTime,
	image = '/static/img/header-trimed-2x.webp',
}: HousePublicProps) => {
	const t = useTranslations();
	const locale = useLocale();

	const graySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><rect width="4" height="4" fill="#a3e7d0" /></svg>`;
	const grayDataUrl = `data:image/svg+xml;base64,${Buffer.from(
		graySvg,
	).toString('base64')}`;

	console.log(checkInDate);

	return (
		<div
			className={`flex items-end rounded-xl overflow-hidden px-2 pb-2 pt-[180px] relative min-h-[400px] transition-all [&>.content]:p-3 [&>.content]:rounded-lg shadow-xs hover:shadow-2xl hover:px-0 hover:pb-0 hover:pt-[172px] hover:[&>.content]:p-5 hover:[&>.content]:rounded-none bg-gradient-to-tr from-[#ffa263] to-[#6cffc9] ${className}`}
		>
			{(mustSee || featured) && (
				<div className="flex p-1 items-center absolute z-1 rounded-full right-2 top-2 gap-1">
					{mustSee && (
						<div className="p-1.5 rounded-full w-fit h-fit bg-white shadow-xs">
							<IconModeHeat color="error" size={18} />
						</div>
					)}
					{featured && (
						<div className="p-1.5 rounded-full w-fit h-fit bg-white shadow-xs">
							<IconFavorite color="primary" size={18} />
						</div>
					)}
				</div>
			)}
			<div className="content transition-all flex justify-end gap-3 flex-col relative w-full bg-white z-5">
				<div className="flex gap-2">
					<Typography component="h5">{name}</Typography>
				</div>
				<div className="flex gap-2 items-center">
					<span className="grow-0 p-1.5 bg-primary-100 rounded-full h-fit">
						<IconLocationOn size={18} color="primary" />
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
				<ButtonLink
					className="w-full"
					color="primary"
					iconLeft={<IconDirections />}
					label={t('Como llegar')}
					href={`${GOOGLE_MAPS_DIRECTION_URL}${latitude},${longitude}`}
					target="_blank"
				/>
			</div>
			<Image
				className="object-cover z-0"
				src={
					image === null ? '/static/img/header-trimed-2x.webp' : image
				}
				fill={true}
				placeholder="blur"
				blurDataURL={grayDataUrl}
				alt={name}
			/>
		</div>
	);
};

export default HousePublic;
