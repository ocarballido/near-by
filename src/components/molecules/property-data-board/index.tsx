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
		<div className="bg-primary-900 p-3 flex gap-3 flex-col mx-1 mt-1 rounded-md md:mx-0 md:mt-0 md:rounded-none relative overflow-hidden">
			<Image
				src="/static/img/home/blur.webp"
				fill={true}
				alt="Blur image"
				className="absolute object-cover"
				priority
			/>
			<div className="flex gap-1 rounded-md">
				<div className="flex flex-wrap gap-1 relative z-1">
					<BadgeCheck
						label={propertyName}
						checked
						checkedColor="secondary"
						iconChecked={<IconHome size={16} color="success" />}
					/>
					<BadgeCheck
						label={propertyAddress}
						checked
						checkedColor="secondary"
						iconChecked={
							<IconLocationOn size={16} color="success" />
						}
					/>
					{(propertyCheckInDate || propertyCheckInTime) && (
						<BadgeCheck
							label={`${propertyCheckInDate ? formatDate(propertyCheckInDate, locale) + ' | ' : ''} ${propertyCheckInTime ? formatTime(propertyCheckInTime, locale) : ''}`}
							checked
							checkedColor="secondary"
							iconChecked={
								<IconCheckIn size={16} color="success" />
							}
						/>
					)}
					{(propertyCheckOutDate || propertyCheckOutTime) && (
						<BadgeCheck
							label={`${propertyCheckOutDate ? formatDate(propertyCheckOutDate, locale) + ' | ' : ''} ${propertyCheckOutTime ? formatTime(propertyCheckOutTime, locale) : ''}`}
							checked
							checkedColor="secondary"
							iconChecked={
								<IconCheckOut size={16} color="success" />
							}
						/>
					)}
				</div>
			</div>
			<div className="flex flex-col lg:flex-row gap-1 relative z-1">
				<ButtonLink
					label={t('Mis Propiedades')}
					href="/app/properties"
					color="primary"
					className="w-full"
				/>
				<ButtonLink
					label={t('Editar')}
					href={`/app/properties/edit/${propertyId}`}
					color="white"
					className="w-full"
				/>
				<ButtonLink
					label={t('feedback.cta')}
					href={`/app/feedback/dashboard/property/${propertyId}?returnTo=/app/properties/${propertyId}/${categoryId}/${subCategoryId}`}
					color="white"
					className="w-full"
				/>
			</div>
		</div>
	);
};

export default PropertyDataBoard;
