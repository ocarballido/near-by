'use client';

import { useState } from 'react';
import { useLoading } from '@/lib/context/LoadingContext';
import { useTranslations } from 'next-intl';

import { deleteLocation } from '@/app/actions/locations/delete-location';

import Place from '@/components/molecules/card/place';
import PropertiesContentEmpty from '../properties-content-empty';
import ButtonLink from '@/components/molecules/button-link';
import Modal from '@/components/organisms/modal';
import Alert from '@/components/molecules/alert';
import IconDelete from '@/components/atoms/icon/delete';

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
	propertyId,
	categoryId,
	subCategoryId,
}: LocationsProps) {
	const t = useTranslations();

	const [isOpen, setIsOpen] = useState(false);
	const [alert, setAlert] = useState<AlertState | null>(null);
	const [selectedLocation, setSelectedLocation] = useState<string>('');
	const { loading, openLoading, closeLoading } = useLoading();
	console.log(propertyId);
	console.log(categoryId);
	console.log(subCategoryId);
	console.log(locations);

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
		return <PropertiesContentEmpty url={emptyUrl} />;
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
			<ButtonLink label="Nuevo sitio" color="secondary" href={emptyUrl} />
		</>
	);
}
