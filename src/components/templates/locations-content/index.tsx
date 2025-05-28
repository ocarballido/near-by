'use client';

import { useState } from 'react';
import { useLoading } from '@/lib/context/LoadingContext';
import { useTranslations } from 'next-intl';

import { deleteLocation } from '@/app/actions/locations/delete-location';
import { deleteAllLocations } from '@/app/actions/locations/delete-all-locations';
import { toggleFeatured } from '@/app/actions/properties/toggle-featured';

import Place from '@/components/molecules/card/place';
import ButtonLink from '@/components/molecules/button-link';
import Modal from '@/components/organisms/modal';
import Alert from '@/components/molecules/alert';
import IconDelete from '@/components/atoms/icon/delete';
import IconAdd from '@/components/atoms/icon/add';
import Button from '@/components/molecules/button';
import ButtonLinkMagic from '@/components/molecules/button-link-magic';

export interface Location {
	id: string;
	name: string;
	address: string;
	description?: string;
	image_url: string;
	latitude?: number;
	longitude?: number;
	type?: 'info' | 'location';
	featured?: boolean;
}

type AlertState = {
	type: 'error' | 'success';
	message: string;
};

interface LocationsProps {
	locations: Location[];
	propertyId: string;
	categoryId: string | null;
	subCategoryId: string;
	lat?: number;
	lng?: number;
	setLocations: (items: Location[]) => void;
}

type DeleteTarget = 'LOCATION' | 'ALL_LOCATIONS' | null;

export function LocationsContent({
	locations,
	propertyId,
	categoryId,
	subCategoryId,
	lat,
	lng,
	setLocations,
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
				const updatedLocations = locations.filter(
					(loc) => loc.id !== locationId
				);
				setLocations(updatedLocations);

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
				fd.append('sub_category_id', subCategoryId);

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

				setLocations([]);
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

	const handleFeatured = async (
		locationId: string,
		currentFeatured: boolean
	) => {
		if (loading) return;
		openLoading();
		setAlert(null);

		const newValue = !currentFeatured;
		const result = await toggleFeatured(locationId, newValue);

		if (result.success) {
			// Optimistic update
			const updated = locations.map((loc) =>
				loc.id === locationId ? { ...loc, featured: newValue } : loc
			);
			setLocations(updated);

			setAlert({
				type: 'success',
				message: newValue
					? 'Marcado como destacado correctamente'
					: 'Destacado eliminado correctamente',
			});
		} else {
			setAlert({
				type: 'error',
				message: 'Error al actualizar destacado',
			});
		}

		closeLoading();
	};

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
				<ButtonLinkMagic
					label={t('Buscador mágico')}
					url={`/app/magic-finder/${propertyId}/${lat}/${lng}/${categoryId}/${subCategoryId}`}
					className="w-full lg:w-full ml-auto mr-auto"
				/>
				<ButtonLink
					label={t('Nuevo sitio')}
					color="primary"
					href={`/app/location/${propertyId}/${categoryId}/${subCategoryId}`}
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
					featured={location.featured}
					handleDelete={() => {
						setIsOpen(true);
						setDeleteTarget('LOCATION');
						setSelectedLocation(location?.id);
					}}
					handleFeatured={() =>
						handleFeatured(location.id, location.featured ?? false)
					}
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
