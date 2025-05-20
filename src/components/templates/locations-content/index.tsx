'use client';

import { useState } from 'react';
import { useLoading } from '@/lib/context/LoadingContext';
import { useTranslations } from 'next-intl';

import { deleteLocation } from '@/app/actions/locations/delete-location';
import { deleteAllLocations } from '@/app/actions/locations/delete-all-locations';

import Image from 'next/image';

import addLocation from '../../../../public/static/img/add-location.webp';

import Link from 'next/link';
import Place from '@/components/molecules/card/place';
import PropertiesContentEmpty from '../properties-content-empty';
import ButtonLink from '@/components/molecules/button-link';
import Modal from '@/components/organisms/modal';
import Alert from '@/components/molecules/alert';
import IconDelete from '@/components/atoms/icon/delete';
import IconAdd from '@/components/atoms/icon/add';
import IconStarShine from '@/components/atoms/icon/star-shine';
import Button from '@/components/molecules/button';

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

type DeleteTarget = 'LOCATION' | 'ALL_LOCATIONS' | null;

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
	const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
	const { loading, openLoading, closeLoading } = useLoading();

	const handleDelete = async (locationId: string) => {
		if (loading) return;

		setIsOpen(false);
		openLoading();
		setAlert(null);

		if (deleteTarget === 'LOCATION' && locationId) {
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
		}

		if (deleteTarget === 'ALL_LOCATIONS') {
			try {
				const fd = new FormData();
				fd.append('property_id', propertyId);
				fd.append('group_id', subCategoryId);

				const result = await deleteAllLocations(fd);

				if (result.errors) {
					setAlert({
						type: 'error',
						message:
							result.errors.server?.[0] ??
							'Error inesperado al eliminar las localizaciones',
					});
					return;
				}

				setAlert({
					type: 'success',
					message:
						result.message ??
						'Todas las localizaciones han sido eliminadas',
				});
			} catch (err: unknown) {
				const msg =
					err instanceof Error
						? err.message
						: 'Error inesperado al eliminar las localizaciones';
				setAlert({ type: 'error', message: msg });
			} finally {
				closeLoading();
			}
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
					<Link
						className="w-fit pl-0.5 pr-4 py-0.5 rounded-full flex justify-center items-center ml-auto mr-auto relative bg-white  gap-2 font-medium *:bg-gradient-to-tr *:from-[#FF6B06] *:to-[#31C48D] hover:*:animate-spin"
						href={`/app/magic-finder/${propertySlug}/${propertyId}/${lat}/${lng}/${categoryId}/${subCategoryId}`}
					>
						<div className="p-2 rounded-full">
							<IconStarShine color="white" size={20} />
						</div>
						{t('Buscador mágico')}
					</Link>
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
				title={
					deleteTarget === 'LOCATION'
						? t('Eliminar propiedad')
						: t('Eliminar todas las localizaciones')
				}
				description={
					deleteTarget === 'LOCATION'
						? t('Estás a punto de eliminar uno de tus sitios')
						: t(
								'Estás a punto de eliminar todas tus localizaciones'
						  )
				}
				message={t('¿Estás seguro que deseas continuar?')}
				open={isOpen}
				onClose={() => {
					setIsOpen(false);
					setSelectedLocation('');
					setDeleteTarget(null);
				}}
				destructiveButtonAction={() => handleDelete(selectedLocation)}
				destructiveButtonLabel="Eliminar"
				primaryButtonAction={() => {
					setIsOpen(false);
				}}
				primaryButtonLabel="Cancel"
				icon={<IconDelete color="error" />}
			/>
			<div className="flex flex-col lg:flex-row gap-2">
				<div className="relative w-full lg:w-auto ml-auto mr-auto">
					<span className="absolute top-[-2px] left-[-2px] w-[calc(100%+4px)] h-[calc(100%+4px)] bg-gradient-to-tr from-[#FF6B06] to-[#31C48D] rounded-full shadow-xl opacity-60"></span>
					<Link
						className="w-full lg:w-max pl-0.5 pr-4 py-0.5 rounded-full flex justify-start items-center ml-auto mr-auto relative bg-white  gap-2 font-medium *:bg-gradient-to-tr *:from-[#FF6B06] *:to-[#31C48D] hover:*:animate-spin"
						href={`/app/magic-finder/${propertySlug}/${propertyId}/${lat}/${lng}/${categoryId}/${subCategoryId}`}
					>
						<div className="p-2 rounded-full">
							<IconStarShine color="white" size={20} />
						</div>
						{t('Buscador mágico')}
					</Link>
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
						setDeleteTarget('LOCATION');
						setSelectedLocation(location?.id);
					}}
				/>
			))}
			{locations.length > 1 && (
				<Button
					className="w-full lg:w-max ml-auto"
					label="Eliminar todos"
					color="error"
					iconLeft={<IconDelete color="error" />}
					onClick={() => {
						setIsOpen(true);
						setDeleteTarget('ALL_LOCATIONS');
					}}
				/>
			)}
		</>
	);
}
