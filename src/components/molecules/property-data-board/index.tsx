'use client';

import { useTranslations, useLocale } from 'next-intl';

import { formatDate, formatTime } from '@/utils/format-date-time';

import Image from 'next/image';
import BadgeCheck from '@/components/atoms/BadgeCheck';
import IconHome from '@/components/atoms/icon/home';
import IconLocationOn from '@/components/atoms/icon/location-on';
import IconCheckIn from '@/components/atoms/icon/check-in';
import IconCheckOut from '@/components/atoms/icon/check-out';
import ButtonLink from '../button-link';
import IconEdit from '@/components/atoms/icon/edit';
import IconApartment from '@/components/atoms/icon/apartment';
import IconHelp from '@/components/atoms/icon/help';
import IconConstruction from '@/components/atoms/icon/construction';

type PropertyDataBoardProps = {
	propertyId: string;
	categoryId: string;
	subCategoryId: string;
	propertyName: string;
	propertyAddress: string;
	propertyCheckInDate: string;
	propertyCheckInTime: string;
	propertyCheckOutDate: string;
	propertyCheckOutTime: string;
};

const PropertyDataBoard = ({
	propertyId,
	categoryId,
	subCategoryId,
	propertyName,
	propertyAddress,
	propertyCheckInDate,
	propertyCheckInTime,
	propertyCheckOutDate,
	propertyCheckOutTime,
}: PropertyDataBoardProps) => {
	const t = useTranslations();
	const locale = useLocale();

	return (
		<div className="bg-gradient-to-tr from-[#ffa263] to-[#6cffc9] mx-1.5 mt-1.5 p-4 flex gap-3 flex-col rounded-md relative overflow-hidden">
			<div className="grid grid-cols-2 xl:grid-cols-3 gap-3 justify-center">
				<div className="col-span-2 xl:col-span-1 flex gap-2 items-center">
					<div className="shrink-0 h-8 w-8 flex justify-center items-center p-1 rounded-full bg-white/50">
						<IconHome size={20} color="primary" />
					</div>
					<p className="text-sm font-medium">{propertyName}</p>
				</div>

				{(propertyCheckInDate || propertyCheckInTime) && (
					<div className="flex gap-2 items-center">
						<div className="shrink-0 h-8 w-8 flex justify-center items-center p-1 rounded-full bg-white/50">
							<IconCheckIn size={20} color="primary" />
						</div>
						<p className="text-sm font-medium">{`${propertyCheckInDate ? formatDate(propertyCheckInDate, locale) + ' | ' : ''} ${propertyCheckInTime ? formatTime(propertyCheckInTime, locale) : ''}`}</p>
					</div>
				)}

				{(propertyCheckOutDate || propertyCheckOutTime) && (
					<div className="flex gap-2 items-center">
						<div className="shrink-0 h-8 w-8 flex justify-center items-center p-1 rounded-full bg-white/50">
							<IconCheckOut size={20} color="primary" />
						</div>
						<p className="text-sm font-medium">{`${propertyCheckOutDate ? formatDate(propertyCheckOutDate, locale) + ' | ' : ''} ${propertyCheckOutTime ? formatTime(propertyCheckOutTime, locale) : ''}`}</p>
					</div>
				)}
			</div>

			<div className="flex flex-col sm:flex-row gap-1 relative z-1">
				<ButtonLink
					label={t('Editar')}
					href={`/app/properties/edit/${propertyId}?from=manage`}
					color="white"
					className="w-full xl:w-fit"
					iconLeft={<IconEdit />}
				/>
				<ButtonLink
					label={t('Mis Propiedades')}
					href="/app/properties"
					color="white"
					className="w-full xl:w-fit"
					iconLeft={<IconApartment />}
				/>
			</div>
		</div>
	);
};

export default PropertyDataBoard;
