// AddPropertyForm.tsx
'use client';
/// <reference types="google.maps" />

import { useTranslations, useLocale } from 'next-intl';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useLoading } from '@/lib/context/LoadingContext';
import { useGlobal } from '@/lib/context/GlobalContext';

import { createProperty } from '@/app/actions/properties/add-property';

import {
	MAX_IMAGE_SIZE,
	CATEGORIES_SUB_CATEGORIES,
} from '@/config/config-constants';

import TextField from '@/components/molecules/text-field';
import InputFile from '@/components/molecules/input-file';
import Button from '@/components/molecules/button';
import ButtonLink from '@/components/molecules/button-link';
import Alert from '@/components/molecules/alert';
import BadgeCheck from '@/components/atoms/BadgeCheck';

// ✅ New Places widget field
import PlaceAutocompleteField from '@/components/molecules/place-autocomplete';
import { SelectedPlace } from '@/components/molecules/place-autocomplete';

import { trackClientEvent } from '@/lib/analytics/trackClient';
import IconHelp from '@/components/atoms/icon/help';

type FormValues = {
	name: string;
	address: string;
	latitude: string;
	longitude: string;
	image?: FileList;
};

const AddPropertyForm = () => {
	const t = useTranslations();
	const locale = useLocale();

	const router = useRouter();

	const { user } = useGlobal();
	const distinctId = user?.id;

	// Para saber si completó y evitar “abandoned” tras success
	const didCompleteRef = useRef(false);

	// Para medir abandono con algo útil
	const formOpenedAtRef = useRef<number>(Date.now());

	const INFO_SEED_OPTIONS = [
		{
			id: CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.MANUAL.id,
			labelKey: t(
				CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.MANUAL.name,
			),
			tKey: 'manual',
		},
		{
			id: CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.RULES.id,
			labelKey: t(
				CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.RULES.name,
			),
			tKey: 'rules',
		},
		{
			id: CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.SCHEDULE.id,
			labelKey: t(
				CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.SCHEDULE.name,
			),
			tKey: 'schedule',
		},
		{
			id: CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.RECYCLE.id,
			labelKey: t(
				CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.RECYCLE.name,
			),
			tKey: 'recycling',
		},
		{
			id: CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.WIFI.id,
			labelKey: t(
				CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.WIFI.name,
			),
			tKey: 'wifi',
		},
	] as const;

	const [alert, setAlert] = useState<{
		type: 'error' | 'success';
		message: string;
	} | null>(null);

	const [selectedSeedInfoIds, setSelectedSeedInfoIds] = useState<string[]>(
		() => INFO_SEED_OPTIONS.map((x) => x.id),
	);

	const toggleSeed = (id: string) => {
		setSelectedSeedInfoIds((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
		);
	};

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
		defaultValues: { name: '', address: '', latitude: '', longitude: '' },
	});

	// ✅ coords now come from PlaceAutocompleteElement selection
	const [coords, setCoords] = useState<SelectedPlace | null>(null);

	const handleSelectAddress = (p: SelectedPlace) => {
		setCoords(p);

		setValue('address', p.formattedAddress, {
			shouldDirty: true,
			shouldValidate: true,
		});

		clearErrors('address');
	};

	const clearSelection = () => {
		setCoords(null);
		setValue('latitude', '', { shouldDirty: true });
		setValue('longitude', '', { shouldDirty: true });
	};

	const onSubmit: SubmitHandler<FormValues> = async (data) => {
		if (!coords) {
			setError('address', {
				type: 'manual',
				message: t('Selecciona una dirección sugerida para continuar'),
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
					},
				),
			});
			return;
		}

		const fd = new FormData();
		fd.append('name', data.name);
		fd.append('address', data.address);
		fd.append('latitude', data.latitude);
		fd.append('longitude', data.longitude);
		fd.append('locale', locale);
		fd.append('seedInfoIds', JSON.stringify(selectedSeedInfoIds));
		if (file) fd.append('image', file);

		openLoading();

		const result = await createProperty(fd);

		if (result.errors) {
			// Track: create_property_failed
			if (distinctId) {
				const errorFields = Object.keys(result.errors);
				trackClientEvent({
					event: 'create_property_failed',
					distinctId,
					props: {
						error_fields: errorFields,
					},
				});
			}

			closeLoading();

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
			if (result.errors.image)
				setAlert({ type: 'error', message: result.errors.image[0] });
			if (result.errors.server)
				setAlert({
					type: 'error',
					message: result.errors.server.join(', '),
				});
			return;
		}

		didCompleteRef.current = true;

		closeLoading();

		setAlert({
			type: 'success',
			message: 'Propiedad creada correctamente',
		});

		if (result.redirectTo) {
			router.push(result.redirectTo);
		}

		reset();
		setCoords(null);
	};

	useEffect(() => {
		if (coords) {
			setValue('latitude', String(coords.lat), { shouldDirty: true });
			setValue('longitude', String(coords.lng), { shouldDirty: true });
		}
	}, [coords, setValue]);

	useEffect(() => {
		const openedAt = formOpenedAtRef.current;

		return () => {
			if (didCompleteRef.current) return;
			if (!distinctId) return;

			const timeOnFormMs = Date.now() - openedAt;

			const hasName = Boolean(getValues('name')?.trim());
			const hasSelectedAddress = Boolean(coords);

			trackClientEvent({
				event: 'create_property_abandoned',
				distinctId,
				props: {
					time_on_form_ms: timeOnFormMs,
					has_name: hasName,
					has_selected_address: hasSelectedAddress,
				},
			});
		};
	}, [distinctId, getValues, coords]);

	return (
		<>
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

			<fieldset className="w-full max-w-[360px]">
				<label className="font-bold text-sm mb-2 block">
					{t('Contenido generado automáticamente')}
				</label>
				<div className="flex gap-1 flex-wrap mb-2">
					{INFO_SEED_OPTIONS.map((opt) => (
						<BadgeCheck
							key={opt.id}
							label={opt.labelKey}
							checked={selectedSeedInfoIds.includes(opt.id)}
							onToggle={() => toggleSeed(opt.id)}
						/>
					))}
				</div>

				<div className="p-4 bg-sky-100 rounded-md">
					<p className="text-xs font-normal text-sky-900">
						{t.rich('auto-content-helper-text', {
							bold: (chunks) => (
								<span className="font-bold">{chunks}</span>
							),
						})}
					</p>
				</div>
			</fieldset>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-4 w-full max-w-[360px]"
			>
				<TextField
					label={t('Nombre de la propiedad *')}
					placeholder={t('Nombre ejemplo')}
					id="name"
					{...register('name', {
						required: t('El nombre es obligatorio'),
					})}
					error={Boolean(errors.name)}
					helperText={errors.name?.message}
				/>

				{/* ✅ New widget-based address input */}
				<PlaceAutocompleteField
					label={t('Dirección *')}
					placeholder={t('Dirección ejemplo')}
					locale={locale}
					countryCodes={['es']}
					error={Boolean(errors.address)}
					helperTextIdle={t('addressHelperIdle')}
					helperTextSelected={t('addressHelperSelected')}
					helperTextError={t('addressHelperError')}
					onSelect={handleSelectAddress}
					onClearSelection={clearSelection}
				/>

				{/* ✅ RHF needs the fields registered; the visible input is managed by Google */}
				<input
					type="hidden"
					{...register('address', {
						required: t('La dirección es obligatoria'),
					})}
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

				<div className="flex flex-col sm:flex-row gap-2">
					<ButtonLink
						label={t('Cancelar')}
						color="secondary"
						href="/app/properties"
						className="w-full"
					/>

					<Button
						type="submit"
						label={t('Añadir propiedad')}
						className="w-full"
						disabled={isSubmitting}
					/>
				</div>
			</form>

			<div className="w-full max-w-[360px] mb-4">
				<ButtonLink
					label={t('feedback.cta')}
					href="/app/feedback/create_property?returnTo=/app/properties/new"
					color="white"
					className="w-full"
					iconLeft={<IconHelp />}
				/>
			</div>
		</>
	);
};

export default AddPropertyForm;
