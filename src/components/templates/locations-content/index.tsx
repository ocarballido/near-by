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
import Button from '@/components/molecules/button';
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
	emptyUrl: string;
	propertyId: string;
	categoryId: string;
	subCategoryId: string;
}

export function LocationsContent({
	locations,
	emptyUrl,
}: // propertyId,
// categoryId,
// subCategoryId,
LocationsProps) {
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
				<PropertiesContentEmpty url={emptyUrl} />
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
				<Button
					className="w-full"
					label={t('Buscador mágico')}
					color="secondary"
					iconLeft={<IconMap />}
				/>
				<ButtonLink
					label={t('Nuevo sitio')}
					color="primary"
					href={emptyUrl}
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
