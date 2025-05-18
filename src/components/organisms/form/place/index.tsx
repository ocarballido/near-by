// AddPlaceForm.tsx
'use client';
/// <reference types="google.maps" />

import { useTranslations } from 'next-intl';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAddressValidation } from '@/hooks/useAddressValidation';
import { useLoading } from '@/lib/context/LoadingContext';

import { createLocation } from '@/app/actions/locations/add-location';

import { MAX_IMAGE_SIZE } from '@/config/config-constants';

import TextField from '@/components/molecules/text-field';
import InputFile from '@/components/molecules/input-file';
import Button from '@/components/molecules/button';
import Alert from '@/components/molecules/alert';
import AddressField from '@/components/molecules/google-text-field';

type FormValues = {
	property_id: string;
	group_id: string;
	name: string;
	address: string;
	latitude: string;
	longitude: string;
	description?: string;
	website?: string;
	phone?: string;
	image?: FileList;
};

const AddPlaceForm = ({
	propertyId,
	categoryId,
	propertySlug,
	subCategoryId,
}: {
	propertyId: string;
	propertySlug: string;
	categoryId: string;
	subCategoryId: string;
}) => {
	const t = useTranslations();

	const router = useRouter();

	const [alert, setAlert] = useState<{
		type: 'error' | 'success';
		message: string;
	} | null>(null);

	const { openLoading, closeLoading } = useLoading();

	const {
		register,
		handleSubmit,
		getValues,
		setValue,
		setError,
		clearErrors,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({
		defaultValues: {
			property_id: propertyId,
			group_id: subCategoryId,
			name: '',
			address: '',
			latitude: '',
			longitude: '',
			description: '',
			website: '',
			phone: '',
		},
	});

	const {
		validate: validateAddress,
		loading: loadingGeo,
		error: geoError,
		coords,
		clear: clearValidation,
	} = useAddressValidation({
		getRawAddress: () => getValues('address'),
		setFormattedAddress: (val) =>
			setValue('address', val, { shouldValidate: true }),
		setFieldError: (msg) =>
			setError('address', { type: 'manual', message: msg }),
		clearFieldError: () => clearErrors('address'),
	});

	const onSubmit: SubmitHandler<FormValues> = async (data) => {
		if (!coords) {
			setError('address', {
				type: 'manual',
				message: t('Debes validar la dirección primero'),
			});
			return;
		}

		const file = data.image?.[0];
		if (file && file.size > MAX_IMAGE_SIZE) {
			setAlert({
				type: 'error',
				message: t(
					'La imagen no debe superar {kb} KB (tienes {got} KB)',
					{
						kb: (MAX_IMAGE_SIZE / 1024).toFixed(0),
						got: (file.size / 1024).toFixed(0),
					}
				),
			});
			return;
		}

		const fd = new FormData();
		fd.append('property_id', propertyId);
		fd.append('group_id', subCategoryId);
		fd.append('name', data.name);
		fd.append('address', data.address);
		fd.append('latitude', data.latitude);
		fd.append('longitude', data.longitude);

		// Campos opcionales
		if (data.description) {
			fd.append('description', data.description);
		}
		if (data.website) {
			fd.append('website', data.website);
		}
		if (data.phone) {
			fd.append('phone', data.phone);
		}

		if (file) {
			fd.append('image', file);
		}

		openLoading();

		const result = await createLocation(fd);

		closeLoading();

		if (result.errors) {
			if (result.errors.name)
				setError('name', {
					type: 'manual',
					message: result.errors.name[0],
				});
			if (result.errors.address)
				setError('address', {
					type: 'manual',
					message: result.errors.address[0],
				});
			if (result.errors.group_id)
				setAlert({ type: 'error', message: result.errors.group_id[0] });
			if (result.errors.property_id)
				setAlert({
					type: 'error',
					message: result.errors.property_id[0],
				});
			if (result.errors.server)
				setAlert({ type: 'error', message: result.errors.server[0] });
			return;
		}

		if (result.redirectTo) {
			router.push(
				`${result.redirectTo}/${propertySlug}/${categoryId}/${subCategoryId}`
			);
			return;
		}

		reset();
		clearValidation();
	};

	useEffect(() => {
		if (coords) {
			setValue('latitude', String(coords.lat), { shouldValidate: true });
			setValue('longitude', String(coords.lng), { shouldValidate: true });
		}
	}, [coords, setValue]);

	return (
		<>
			<Alert
				hideTime={3000}
				open={coords !== null}
				title={t('Validado')}
				dismissible
				type="success"
				message={'La dirección se ha validado correctamente'}
			/>

			{alert && (
				<Alert
					hideTime={3000}
					open={alert !== null}
					title={alert.type === 'error' ? t('Error') : t('Validado')}
					dismissible
					type={alert.type}
					message={alert.message}
				/>
			)}

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-4 w-full max-w-[360px]"
			>
				<h1 className="font-heading font-bold text-lg text-primary-500">
					{t('Nuevo Sitio')}
				</h1>

				<TextField
					label={t('Nombre del sitio *')}
					placeholder={t('Sitio nombre ejemplo')}
					id="name"
					{...register('name', {
						required: t('El nombre es obligatorio'),
					})}
					error={Boolean(errors.name)}
					helperText={errors.name?.message}
				/>

				<AddressField
					registerReturn={register('address', {
						required: t('La dirección es obligatoria'),
					})}
					loading={loadingGeo}
					error={Boolean(errors.address)}
					helperText={errors.address?.message || geoError || ''}
					coords={coords ?? undefined}
					onValidate={validateAddress}
					label={t('Dirección *')}
					placeholder={t('Sitio dirección ejemplo')}
				/>

				<input type="hidden" {...register('latitude')} />
				<input type="hidden" {...register('longitude')} />

				<InputFile
					label={t('Imagen')}
					error={Boolean(errors.image)}
					helperText={errors.image?.message as string}
					{...register('image', {
						validate: (files) => {
							const file = files?.[0];
							if (!file) return true;
							if (file.size <= MAX_IMAGE_SIZE) return true;
							return `La imagen no debe superar ${(
								MAX_IMAGE_SIZE / 1024
							).toFixed(0)} KB (tienes ${(
								file.size / 1024
							).toFixed(0)} KB)`;
						},
					})}
				/>

				<div className="p-4 bg-sky-100 rounded-md">
					<p className="text-xs text-sky-900">
						{t('Disclaimer de imagen')}
					</p>
				</div>

				<div className="flex flex-col sm:flex-row gap-2">
					<Button
						label={t('Cancelar')}
						className="w-full"
						color="secondary"
						onClick={() => router.back()}
					/>
					<Button
						type="submit"
						label={t('Añadir')}
						className="w-full"
						disabled={isSubmitting}
					/>
				</div>
			</form>
		</>
	);
};

export default AddPlaceForm;
