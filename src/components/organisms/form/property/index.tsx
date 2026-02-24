// AddPropertyForm.tsx
'use client';
/// <reference types="google.maps" />

import { useTranslations, useLocale } from 'next-intl';
import { useForm, SubmitHandler } from 'react-hook-form';
import { usePaywall } from '@/lib/context/PaywallContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useLoading } from '@/lib/context/LoadingContext';
import { useGlobal } from '@/lib/context/GlobalContext';

import { createProperty } from '@/app/actions/properties/add-property';
import { updateProperty } from '@/app/actions/properties/update-property';

import {
	MAX_IMAGE_SIZE,
	CATEGORIES_SUB_CATEGORIES,
	TIPS,
} from '@/config/config-constants';

import TextField from '@/components/molecules/text-field';
import InputFile from '@/components/molecules/input-file';
import Button from '@/components/molecules/button';
import ButtonLink from '@/components/molecules/button-link';
import Alert from '@/components/molecules/alert';
import BadgeCheck from '@/components/atoms/BadgeCheck';
import Typography from '@/components/atoms/typography';
import IconAdd from '@/components/atoms/icon/add';
import FancyIcon from '@/components/atoms/icon/fancy-icon';
import Modal from '../../modal';

// ✅ New Places widget field
import PlaceAutocompleteField from '@/components/molecules/place-autocomplete';
import { SelectedPlace } from '@/components/molecules/place-autocomplete';

import { trackClientEvent } from '@/lib/analytics/trackClient';
import IconHelp from '@/components/atoms/icon/help';
import ButtonIcon from '@/components/atoms/button-icon';
import IconInfo from '@/components/atoms/icon/info';
import Image from 'next/image';

type FormValues = {
	name: string;
	address: string;
	latitude: string;
	longitude: string;
	image?: FileList;
	checkInDate: string; // YYYY-MM-DD o ''
	checkInTime: string; // HH:mm o ''
	checkOutDate: string;
	checkOutTime: string;
};

export type EditInitialValues = {
	name: string;
	address: string;
	latitude: number | null;
	longitude: number | null;
	image_url: string | null;

	check_in_date: string | null; // YYYY-MM-DD
	check_in_time: string | null; // HH:mm:ss o HH:mm
	check_out_date: string | null;
	check_out_time: string | null;
};

// ✅ NEW: props simples (sin union complicada)
type Props = {
	// si vienen ambos => modo edición
	propertyId?: string;
	initialValues?: EditInitialValues;
};

const AddPropertyForm = ({ propertyId, initialValues }: Props) => {
	const t = useTranslations();
	const locale = useLocale();
	const router = useRouter();

	const { incrementPropertyCount } = usePaywall();

	const { user } = useGlobal();
	const distinctId = user?.id;

	const isEdit = Boolean(propertyId && initialValues);

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

	const [isOpen, setIsOpen] = useState(false);

	const toggleSeed = (id: string) => {
		setSelectedSeedInfoIds((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
		);
	};

	const { openLoading, closeLoading } = useLoading();

	const defaultValues = useMemo<FormValues>(() => {
		if (!isEdit || !initialValues) {
			return {
				name: '',
				address: '',
				latitude: '',
				longitude: '',
				checkInDate: '',
				checkInTime: '',
				checkOutDate: '',
				checkOutTime: '',
			};
		}

		return {
			name: initialValues.name ?? '',
			address: initialValues.address ?? '',
			latitude:
				initialValues.latitude !== null &&
				initialValues.latitude !== undefined
					? String(initialValues.latitude)
					: '',
			longitude:
				initialValues.longitude !== null &&
				initialValues.longitude !== undefined
					? String(initialValues.longitude)
					: '',
			checkInDate: initialValues.check_in_date ?? '',
			checkInTime: (initialValues.check_in_time ?? '').slice(0, 5), // HH:mm:ss -> HH:mm
			checkOutDate: initialValues.check_out_date ?? '',
			checkOutTime: (initialValues.check_out_time ?? '').slice(0, 5),
		};
	}, [isEdit, initialValues]);

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
		defaultValues,
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

		if (distinctId) {
			trackClientEvent({
				event: 'create_property_address_selected',
				distinctId,
			});
		}
	};

	const clearSelection = () => {
		setCoords(null);
		setValue('address', '', { shouldDirty: true, shouldValidate: true });
		setValue('latitude', '', { shouldDirty: true });
		setValue('longitude', '', { shouldDirty: true });
	};

	const onSubmit: SubmitHandler<FormValues> = async (data) => {
		if (!isEdit && distinctId) {
			trackClientEvent({
				event: 'create_property_submit_clicked',
				distinctId,
				props: {
					has_name: Boolean(data.name?.trim()),
					has_selected_address: Boolean(coords),
				},
			});
		}

		if (!isEdit && !coords) {
			if (distinctId) {
				trackClientEvent({
					event: 'create_property_blocked_no_address_selection',
					distinctId,
					props: {
						has_name: Boolean(data.name?.trim()),
					},
				});
			}

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
		if (!isEdit) {
			fd.append('address', data.address);
			fd.append('latitude', data.latitude);
			fd.append('longitude', data.longitude);
			fd.append('locale', locale);
			fd.append('seedInfoIds', JSON.stringify(selectedSeedInfoIds));
		}
		fd.append('check_in_date', data.checkInDate ?? '');
		fd.append('check_in_time', data.checkInTime ?? '');
		fd.append('check_out_date', data.checkOutDate ?? '');
		fd.append('check_out_time', data.checkOutTime ?? '');
		if (file) fd.append('image', file);

		openLoading();

		const result = isEdit
			? await updateProperty(propertyId as string, fd)
			: await createProperty(fd);

		// const result = await createProperty(fd);

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
			if (!isEdit && result.errors.address)
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

		if (!isEdit) incrementPropertyCount();

		setAlert({
			type: 'success',
			message: 'Propiedad creada correctamente',
		});

		if (result.redirectTo) {
			router.push(result.redirectTo);
		}

		if (!isEdit) {
			reset();
			setCoords(null);
		}
	};

	useEffect(() => {
		if (isEdit) return;
		if (coords) {
			setValue('latitude', String(coords.lat), { shouldDirty: true });
			setValue('longitude', String(coords.lng), { shouldDirty: true });
		}
	}, [coords, setValue, isEdit]);

	useEffect(() => {
		if (isEdit) return;

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
	}, [distinctId, getValues, coords, isEdit]);

	return (
		<div className="bg-white p-2 rounded-xl w-full max-w-[400px] shadow-xs">
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

			{!isEdit && (
				<Modal
					title={t('createPropertyTipsModal.title')}
					open={isOpen}
					onClose={() => {
						setIsOpen(false);
					}}
					primaryButtonAction={() => {
						setIsOpen(false);
					}}
					primaryButtonLabel="Cancel"
					size="max-w-3xl"
				>
					<div className="flex flex-wrap max-w-[1000px]">
						{TIPS.map((tip) => (
							<div
								key={tip.id}
								className="flex flex-col w-full md:w-full lg:w-1/2 xl:w-1/3 gap-1 p-4 items-center text-center"
							>
								<div className="flex justify-center items-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#FF6B06]/10 to-[#31C48D]/10">
									<span className="flex justify-center items-center w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF6B06] to-[#31C48D] font-bold text-white text-base">
										{tip.id}
									</span>
								</div>
								<Typography component="h3" size="base">
									{t(tip.title)}
								</Typography>
								<Typography size="sm">
									{t(tip.subtitle)}
								</Typography>
							</div>
						))}
					</div>
				</Modal>
			)}

			<div className="rounded-lg p-3 pt-0 flex flex-col gap-2 items-center text-center">
				<FancyIcon icon={<IconAdd color="white" />} color="gradient" />
				<Typography
					component="h2"
					size="lg"
					className="flex items-center gap-1"
				>
					{t('Nuevo Alojamiento')}
					<ButtonIcon
						size="small"
						icon={<IconInfo />}
						onClick={() => setIsOpen(true)}
					/>
				</Typography>
			</div>

			{!isEdit && (
				<fieldset className="w-full p-2">
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
				</fieldset>
			)}

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-4 w-full p-2"
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
				{isEdit ? (
					<>
						<TextField
							label={t('Dirección *')}
							id="address_display"
							value={getValues('address')}
							disabled
						/>
						<input type="hidden" {...register('address')} />
						<input type="hidden" {...register('latitude')} />
						<input type="hidden" {...register('longitude')} />
					</>
				) : (
					<>
						<PlaceAutocompleteField
							label={t('Dirección *')}
							placeholder={t('Dirección ejemplo')}
							locale={locale}
							error={Boolean(errors.address)}
							helperTextIdle={t('addressHelperIdle')}
							helperTextSelected={t('addressHelperSelected')}
							helperTextError={t('addressHelperError')}
							onSelect={handleSelectAddress}
							onClearSelection={clearSelection}
						/>

						<input
							type="hidden"
							{...register('address', {
								required: t('La dirección es obligatoria'),
							})}
						/>
						<input type="hidden" {...register('latitude')} />
						<input type="hidden" {...register('longitude')} />
					</>
				)}

				<fieldset className="flex flex-col gap-1">
					<Typography size="base" component="h3" fontFamily="base">
						{t('propertyForm.checkIn')}{' '}
						<span className="opacity-70 text-primary-500 text-sm">
							({t('propertyForm.optional')})
						</span>
					</Typography>

					<div className="flex gap-2 flex-col sm:flex-row">
						<div className="w-full">
							<TextField
								label={t('propertyForm.date')}
								id="checkInDate"
								type="date"
								{...register('checkInDate')}
								error={Boolean(errors.checkInDate)}
								helperText={
									errors.checkInDate?.message as string
								}
							/>
						</div>

						<div className="w-full">
							<TextField
								label={t('propertyForm.time')}
								id="checkInTime"
								type="time"
								step={60}
								{...register('checkInTime')}
								error={Boolean(errors.checkInTime)}
								helperText={
									errors.checkInTime?.message as string
								}
							/>
						</div>
					</div>
				</fieldset>

				<fieldset className="flex flex-col gap-1">
					<Typography size="base" component="h3" fontFamily="base">
						{t('propertyForm.checkOut')}{' '}
						<span className="opacity-70 text-primary-500 text-sm">
							({t('propertyForm.optional')})
						</span>
					</Typography>

					<div className="flex gap-2 flex-col sm:flex-row">
						<div className="flex-1">
							<TextField
								label={t('propertyForm.date')}
								id="checkOutDate"
								type="date"
								{...register('checkOutDate')}
								error={Boolean(errors.checkOutDate)}
								helperText={
									errors.checkOutDate?.message as string
								}
							/>
						</div>

						<div className="flex-1">
							<TextField
								label={t('propertyForm.time')}
								id="checkOutTime"
								type="time"
								step={60}
								{...register('checkOutTime')}
								error={Boolean(errors.checkOutTime)}
								helperText={
									errors.checkOutTime?.message as string
								}
							/>
						</div>
					</div>
				</fieldset>

				{isEdit && initialValues?.image_url && (
					<div className="flex flex-col gap-2">
						<label className="font-medium text-sm">
							{t('propertyForm.currentImage')}
						</label>

						<div className="w-full overflow-hidden rounded-lg relative h-[200px]">
							<Image
								src={initialValues.image_url}
								fill
								priority
								alt={t('propertyForm.currentImageAlt')}
								className="w-full h-40 object-cover"
							/>
						</div>

						<Typography size="sm" className="opacity-70">
							{t('propertyForm.changeImageHelper')}
						</Typography>
					</div>
				)}

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

				<div className="flex flex-col gap-2">
					<Button
						type="submit"
						label={
							isEdit
								? t('Guardar cambios')
								: t('Añadir propiedad')
						}
						className="w-full"
						disabled={isSubmitting}
					/>
					<Button
						label={t('Cancelar')}
						className="w-full"
						color="secondary"
						onClick={() => router.back()}
					/>

					{/* feedback link: solo create (si quieres también en edit lo habilitamos) */}
					{!isEdit && (
						<ButtonLink
							label={t('feedback.cta')}
							href="/app/feedback/create_property?returnTo=/app/properties/new"
							color="white"
							className="w-full"
							iconLeft={<IconHelp />}
						/>
					)}
				</div>
			</form>
		</div>
	);
};

export default AddPropertyForm;
