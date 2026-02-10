'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useLoading } from '@/lib/context/LoadingContext';

import { discoverNearbyPlaces } from '@/app/actions/magic-search/magic-search';

import {
	MAX_MAGIC_FINDER_LOCATIONS,
	RADIUS_OPTIONS,
} from '@/config/config-constants';

import Alert from '@/components/molecules/alert';
import { Select, SelectOption } from '@/components/molecules/select';
import Button from '@/components/molecules/button';
import ButtonLink from '@/components/molecules/button-link';
import IconHelp from '@/components/atoms/icon/help';
import Typography from '@/components/atoms/typography';
import FancyIcon from '@/components/atoms/icon/fancy-icon';
import IconSearch from '@/components/atoms/icon/search';

type FormValues = {
	quantity: string;
	radius: string;
};

const quantityOptions: SelectOption[] = Array.from(
	{ length: MAX_MAGIC_FINDER_LOCATIONS },
	(_, i) => ({
		value: (i + 1).toString(),
		label: `${i + 1}`,
	}),
);

const MagicFinderForm = ({
	propertyId,
	lat,
	lng,
	categoryId,
	subCategoryId,
}: {
	propertyId: string;
	categoryId: string;
	subCategoryId: string;
	lat: string;
	lng: string;
}) => {
	const t = useTranslations();
	const locale = useLocale();

	const router = useRouter();

	const [alert, setAlert] = useState<{
		type: 'error' | 'success';
		message: string;
	} | null>(null);

	const { openLoading, closeLoading } = useLoading();

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
		setError,
	} = useForm<FormValues>({
		defaultValues: { quantity: '', radius: '' },
	});
	const onSubmit: SubmitHandler<FormValues> = async ({
		quantity,
		radius,
	}) => {
		const fd = new FormData();
		fd.append('property_id', propertyId);
		fd.append('sub_category_id', subCategoryId);
		fd.append('category_id', categoryId);
		fd.append('lat', lat);
		fd.append('lng', lng);
		fd.append('max', quantity);
		fd.append('radius', radius);
		fd.append('locale', locale);

		openLoading();
		const result = await discoverNearbyPlaces(fd);
		closeLoading();

		if (result.errors) {
			if (result.errors) {
				if (result.errors.max) {
					setError('quantity', {
						type: 'manual',
						message: result.errors.max[0],
					});
				}

				if (result.errors.radius) {
					setError('radius', {
						type: 'manual',
						message: result.errors.radius[0],
					});
				}

				if (result.errors.server) {
					setAlert({
						type: 'error',
						message: result.errors.server[0],
					});
				}

				return;
			}

			return;
		}

		setAlert({
			type: 'success',
			message: result.message || t('Lugares añadidos correctamente'),
		});

		if (result.redirectTo) {
			router.push(
				`${result.redirectTo}/${propertyId}/${categoryId}/${subCategoryId}`,
			);
			return;
		}
	};

	return (
		<div className="bg-white p-2 rounded-xl max-w-[400px] w-full shadow-xs gap-4">
			<div className="rounded-lg p-3 pt-0 flex flex-col gap-2 items-center">
				<FancyIcon
					icon={<IconSearch color="white" />}
					color="gradient"
				/>
				<Typography component="h2" size="lg">
					{t('Buscador mágico')}:
				</Typography>
			</div>

			<div className="p-2">
				<div className="p-4 bg-sky-100 rounded-md">
					<Typography component="p" size="sm" color="text-sky-900">
						{t(
							'Con un solo clic, añade automáticamente los lugares más valorados en la zona: restaurantes, farmacias, parques, museos y mucho más',
						)}
					</Typography>
				</div>
			</div>

			{alert && (
				<Alert
					type={alert.type}
					title={alert.type === 'error' ? t('Error') : t('Validado')}
					message={alert.message}
					open={!!alert}
					hideTime={2000}
				/>
			)}

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-6 max-w-md p-2"
			>
				<Controller
					name="radius"
					control={control}
					rules={{ required: 'El radio es obligatorio' }}
					render={({ field }) => (
						<Select
							label={t('Radio de búsqueda')}
							options={RADIUS_OPTIONS}
							value={field.value}
							onChange={field.onChange}
							name="radius"
							error={!!errors.radius}
							helperText={errors.radius?.message}
							placeholder={t('Selecciona el radio (metros)')}
						/>
					)}
				/>

				<Controller
					name="quantity"
					control={control}
					rules={{
						required: t('La cantidad es obligatoria'),
						validate: (v) =>
							parseInt(v, 10) > 0 || t('Debe ser mayor que 0'),
					}}
					render={({ field }) => (
						<Select
							label={t('Cantidad')}
							options={quantityOptions}
							className="w-full"
							value={field.value}
							onChange={field.onChange}
							name="quantity"
							error={!!errors.quantity}
							helperText={errors.quantity?.message}
							placeholder={t('Selecciona cantidad')}
						/>
					)}
				/>

				<div className="flex flex-col gap-2 mt-4">
					<Button
						type="submit"
						label={t('Añadir')}
						disabled={isSubmitting}
						className="w-full"
					/>
					<Button
						type="button"
						label={t('Cancelar')}
						color="secondary"
						onClick={() => router.back()}
						className="w-full"
					/>
					<ButtonLink
						label={t('feedback.cta')}
						href={`/app/feedback/create_location/property/${propertyId}?returnTo=/app/properties/${propertyId}/${categoryId}/${subCategoryId}`}
						color="white"
						className="w-full"
						iconLeft={<IconHelp />}
					/>
				</div>
			</form>
		</div>
	);
};

export default MagicFinderForm;
