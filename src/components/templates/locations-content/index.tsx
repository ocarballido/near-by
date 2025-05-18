'use client';

import { useState } from 'react';
import { useLoading } from '@/lib/context/LoadingContext';
import { useTranslations } from 'next-intl';

import { deleteLocation } from '@/app/actions/locations/delete-location';

import Image from 'next/image';

import addLocation from '../../../../public/static/img/add-location.webp';

import Place from '@/components/molecules/card/place';
import PropertiesContentEmpty from '../properties-content-empty';
import ButtonLink from '@/components/molecules/button-link';
import Modal from '@/components/organisms/modal';
import Alert from '@/components/molecules/alert';
import IconDelete from '@/components/atoms/icon/delete';
import IconAdd from '@/components/atoms/icon/add';
import IconMap from '@/components/atoms/icon/map';

export interface Location {
	id: string;
	group_id: string;
	name: string;
	address: string;
	image_url: string;
}

type AlertState = {
	type: 'error' | 'success';
	message: string;
};

interface LocationsProps {
	locations: Location[];
	propertyId: string;
	categoryId: string;
	subCategoryId: string;
	propertySlug: string;
	lat?: number;
	lng?: number;
}

export function LocationsContent({
	locations,
	propertyId,
	categoryId,
	subCategoryId,
	propertySlug,
	lat,
	lng,
}: LocationsProps) {
	const t = useTranslations();

	const [isOpen, setIsOpen] = useState(false);
	const [alert, setAlert] = useState<AlertState | null>(null);
	const [selectedLocation, setSelectedLocation] = useState<string>('');
	const { loading, openLoading, closeLoading } = useLoading();

	const handleDelete = async (locationId: string) => {
		if (loading) return;
		if (!selectedLocation) return;
		setIsOpen(false);
		openLoading();
		setAlert(null);
		try {
			await deleteLocation(locationId);
			setAlert({
				type: 'success',
				message: 'Sitio eliminado correctamente',
			});
		} catch (err: unknown) {
			const msg =
				err instanceof Error
					? err.message
					: 'Error eliminando el sitio';
			setAlert({ type: 'error', message: msg });
		} finally {
			closeLoading();
		}
	};

	if (locations.length === 0) {
		return (
			<>
				<div className="block ml-auto mr-auto">
					<Image
						alt="Add location"
						src={addLocation}
						height={219}
						width={281}
					/>
				</div>
				<PropertiesContentEmpty
					url={`/app/location/${propertySlug}/${propertyId}/${categoryId}/${subCategoryId}`}
				/>
				<div className="relative w-fit ml-auto mr-auto">
					<span className="absolute top-[-2px] left-[-2px] w-[calc(100%+4px)] h-[calc(100%+4px)] bg-gradient-to-tr from-[#FF6B06] to-[#31C48D] rounded-full shadow-xl opacity-60"></span>
					<ButtonLink
						className="w-fit ml-auto mr-auto relative bg-white hover:bg-white/70 focus:bg-white/70"
						label={t('Buscador mágico')}
						color="secondary"
						iconLeft={<IconMap />}
						href={`/app/magic-finder/${propertySlug}/${propertyId}/${lat}/${lng}/${categoryId}/${subCategoryId}`}
					/>
				</div>
			</>
		);
	}

	return (
		<>
			{alert && (
				<Alert
					open
					type={alert.type}
					title={alert.type === 'error' ? t('Error') : t('Eliminado')}
					message={t(alert.message)}
					dismissible
					hideTime={2000}
				/>
			)}
			<Modal
				title={t('Eliminar propiedad')}
				description={t('Estás a punto de eliminar uno de tus sitios')}
				message={t('¿Estás seguro que deseas continuar?')}
				open={isOpen}
				onClose={() => {
					setIsOpen(false);
					setSelectedLocation('');
				}}
				destructiveButtonAction={() => handleDelete(selectedLocation)}
				destructiveButtonLabel="Eliminar"
				primaryButtonAction={() => setIsOpen(false)}
				primaryButtonLabel="Cancel"
				icon={<IconDelete color="error" />}
			/>
			<div className="flex flex-col lg:flex-row gap-2">
				<div className="relative w-full ml-auto mr-auto">
					<span className="absolute top-[-2px] left-[-2px] w-[calc(100%+4px)] h-[calc(100%+4px)] bg-gradient-to-tr from-[#FF6B06] to-[#31C48D] rounded-full shadow-xl opacity-60"></span>
					<ButtonLink
						className="w-full relative bg-white hover:bg-white/70 focus:bg-white/70"
						label={t('Buscador mágico')}
						color="secondary"
						iconLeft={<IconMap />}
						href={`/app/magic-finder/${propertySlug}/${propertyId}/${lat}/${lng}/${categoryId}/${subCategoryId}`}
					/>
				</div>
				<ButtonLink
					label={t('Nuevo sitio')}
					color="primary"
					href={`/app/location/${propertySlug}/${propertyId}/${categoryId}/${subCategoryId}`}
					iconLeft={<IconAdd />}
					className="w-full"
				/>
			</div>
			{locations.map((location) => (
				<Place
					key={location.id}
					name={location.name}
					address={location.address}
					image={location.image_url}
					handleDelete={() => {
						setIsOpen(true);
						setSelectedLocation(location?.id);
					}}
				/>
			))}
		</>
	);
}
