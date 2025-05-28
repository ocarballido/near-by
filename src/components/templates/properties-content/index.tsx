'use client';

import { useState } from 'react';
import { useLoading } from '@/lib/context/LoadingContext';
import { useTranslations } from 'use-intl';

import { deleteProperty } from '@/app/actions/properties/delete-property';

import {
	FIRST_CATEGORY_ID,
	FIRST_CATEGORY_SUBCATEGORY_ID,
} from '@/config/config-constants';

import House from '@/components/molecules/card/house';
import Modal from '@/components/organisms/modal';
import IconDelete from '@/components/atoms/icon/delete';
import Alert from '@/components/molecules/alert';
import NewPropertyCard from '@/components/molecules/new-property-card';

type Category = {
	icon: string;
	name: string;
	id: string;
};

type InfoGeneral = {
	property_id: string;
	category_id: string;
	id: string;
};

type Property = {
	address: string;
	slug: string;
	image_url?: string;
	name: string;
	id: string;
	infoGeneral: InfoGeneral;
};

type PropertiesContentProps = {
	firstCategory: Category | null;
	properties: Property[];
};

type AlertState = {
	type: 'error' | 'success';
	message: string;
};

const PropertiesContent = ({ properties }: PropertiesContentProps) => {
	const t = useTranslations();

	const [isOpen, setIsOpen] = useState(false);
	const [alert, setAlert] = useState<AlertState | null>(null);
	const [selectedProperty, setSelectedProperty] = useState<string>('');
	const { loading, openLoading, closeLoading } = useLoading();

	const handleDelete = async (propertyId: string) => {
		if (loading) return;

		setIsOpen(false);

		openLoading();

		setAlert(null);

		try {
			await deleteProperty(propertyId);

			setAlert({
				type: 'success',
				message: 'Propiedad eliminada correctamente',
			});
		} catch (err: unknown) {
			const msg =
				err instanceof Error
					? err.message
					: 'Error eliminando la propiedad';
			setAlert({ type: 'error', message: msg });
		} finally {
			closeLoading();
		}
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
				title={t('Eliminar propiedad')}
				description={t(
					'Estás a punto de eliminar una de tus propiedades'
				)}
				message={t('¿Estás seguro que deseas continuar?')}
				open={isOpen}
				onClose={() => {
					setIsOpen(false);
					setSelectedProperty('');
				}}
				destructiveButtonAction={() => handleDelete(selectedProperty)}
				destructiveButtonLabel="Eliminar"
				primaryButtonAction={() => setIsOpen(false)}
				primaryButtonLabel="Cancel"
				icon={<IconDelete color="error" />}
			/>
			{properties.map((property) => (
				<House
					key={property?.id}
					name={property?.name}
					image={property?.image_url || null}
					href={`/app/properties/${property?.id}/${FIRST_CATEGORY_ID}/${FIRST_CATEGORY_SUBCATEGORY_ID}`}
					address={property?.address}
					handleDelete={() => {
						setIsOpen(true);
						setSelectedProperty(property?.id);
					}}
				/>
			))}
			<NewPropertyCard />
		</>
	);
};

export default PropertiesContent;
