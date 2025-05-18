'use client';

import { useTranslations } from 'next-intl';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useLoading } from '@/lib/context/LoadingContext';

import { discoverNearbyPlaces } from '@/app/actions/magic-search/magic-search';

import {
	MAGIC_FINDER_SELECT,
	MAX_MAGIC_FINDER_LOCATIONS,
} from '@/config/config-constants';

import Alert from '@/components/molecules/alert';
import { Select, SelectOption } from '@/components/molecules/select';
import Button from '@/components/molecules/button';

type FormValues = {
	type: string;
	quantity: string;
};

const quantityOptions: SelectOption[] = Array.from(
	{ length: MAX_MAGIC_FINDER_LOCATIONS },
	(_, i) => ({
		value: (i + 1).toString(),
		label: `${i + 1}`,
	})
);

const MagicFinderForm = ({
	propertySlug,
	propertyId,
	lat,
	lng,
	categoryId,
	subCategoryId,
}: {
	propertyId: string;
	propertySlug: string;
	categoryId: string;
	subCategoryId: string;
	lat: string;
	lng: string;
}) => {
	const t = useTranslations();

	const router = useRouter();

	const options = useMemo(() => {
		return MAGIC_FINDER_SELECT.map((option) => {
			return {
				...option,
				label: t(option.label),
			};
		});
	}, [t]);

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
		defaultValues: {
			type: '',
			quantity: '',
		},
	});
	const onSubmit: SubmitHandler<FormValues> = async ({ type, quantity }) => {
		const fd = new FormData();
		fd.append('property_id', propertyId);
		fd.append('group_id', subCategoryId);
		fd.append('lat', lat);
		fd.append('lng', lng);
		fd.append('type', type);
		fd.append('max', quantity);

		openLoading();
		const result = await discoverNearbyPlaces(fd);
		closeLoading();

		if (result.errors) {
			if (result.errors) {
				if (result.errors.type) {
					setError('type', {
						type: 'manual',
						message: result.errors.type[0],
					});
				}

				if (result.errors.max) {
					setError('quantity', {
						type: 'manual',
						message: result.errors.max[0],
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
				`${result.redirectTo}/${propertySlug}/${categoryId}/${subCategoryId}`
			);
			return;
		}
	};

	return (
		<div className="w-full max-w-[400px] flex flex-col gap-4">
			<h1 className="font-heading font-bold w-full">
				<span className="text-3xl text-primary-500">
					{t('Buscador mágico')}:
				</span>
				<br />
				<span className="text-lg">
					{t('Descubre lo mejor cerca de tu propiedad')}
				</span>
			</h1>
			<p className="w-full font-medium text-gray-500">
				{t(
					'Con un solo clic, añade automáticamente los lugares más valorados en la zona: restaurantes, farmacias, parques, museos y mucho más'
				)}
			</p>

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
				className="flex flex-col gap-6 max-w-md"
			>
				<Controller
					name="type"
					control={control}
					rules={{ required: t('El tipo de lugar es obligatorio') }}
					render={({ field }) => (
						<Select
							label={t('Categoría')}
							options={options}
							className="w-full"
							value={field.value}
							onChange={field.onChange}
							name="type"
							error={!!errors.type}
							helperText={errors.type?.message}
							placeholder={t('Selecciona un tipo de lugar')}
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

				<div className="flex flex-col sm:flex-row gap-2 mt-4">
					<Button
						type="button"
						label={t('Cancelar')}
						color="secondary"
						onClick={() => router.back()}
						className="w-full"
					/>
					<Button
						type="submit"
						label={t('Añadir')}
						disabled={isSubmitting}
						className="w-full"
					/>
				</div>
			</form>
		</div>
	);
};

export default MagicFinderForm;
