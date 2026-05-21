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
import Alert from '@/components/molecules/alert';
import SeedOptions from './seed-options';
import PropertyFormHeader from './form-header';
import ImageSection from './image-section';
import FormActions from './form-actions';
import AddressSection from './address-section';
import { SelectedPlace } from '@/components/molecules/place-autocomplete';

import { trackClientEvent } from '@/lib/analytics/trackClient';
import { getPropertyFormDefaultValues } from './getPropertyFormDefaultValues';
import { buildPropertyFormData } from './buildPropertyFormData';
import Button from '@/components/molecules/button';
import TextArea from '@/components/molecules/text-area';

type FormValues = {
	name: string;
	address: string;
	latitude: string;
	longitude: string;
	image?: FileList;
	checkInDate: string;
	checkInTime: string;
	checkOutDate: string;
	checkOutTime: string;
	accessInstructions: string;
};

export type EditInitialValues = {
	name: string;
	address: string;
	latitude: number | null;
	longitude: number | null;
	image_url: string | null;
	check_in_date: string | null;
	check_in_time: string | null;
	check_out_date: string | null;
	check_out_time: string | null;
	access_instructions: string | null;
};

export type DateTimeMode = 'isDateAndTime' | 'isOnlyTime';

// ✅ NEW: props simples (sin union complicada)
type Props = {
	// si vienen ambos => modo edición
	propertyId?: string;
	initialValues?: EditInitialValues;
};

const DEFAULT_SEED_INFO_IDS = [
	CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.MANUAL.id,
	CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.RULES.id,
	CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.SCHEDULE.id,
	CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.RECYCLE.id,
	CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.WIFI.id,
] as const;

const AddPropertyForm = ({ propertyId, initialValues }: Props) => {
	const t = useTranslations();
	const locale = useLocale();
	const router = useRouter();

	const { incrementPropertyCount } = usePaywall();

	const { user } = useGlobal();
	const distinctId = user?.id;

	const isEdit = Boolean(propertyId && initialValues);

	const didCompleteRef = useRef(false);

	const formOpenedAtRef = useRef<number>(Date.now());

	const INFO_SEED_OPTIONS = useMemo(
		() =>
			[
				{
					id: CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.MANUAL
						.id,
					labelKey: t(
						CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.MANUAL
							.name,
					),
					tKey: 'manual',
				},
				{
					id: CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.RULES
						.id,
					labelKey: t(
						CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.RULES
							.name,
					),
					tKey: 'rules',
				},
				{
					id: CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES
						.SCHEDULE.id,
					labelKey: t(
						CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES
							.SCHEDULE.name,
					),
					tKey: 'schedule',
				},
				{
					id: CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.RECYCLE
						.id,
					labelKey: t(
						CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.RECYCLE
							.name,
					),
					tKey: 'recycling',
				},
				{
					id: CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.WIFI
						.id,
					labelKey: t(
						CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.WIFI
							.name,
					),
					tKey: 'wifi',
				},
			] as const,
		[t],
	);

	const seedOptions = useMemo(
		() =>
			INFO_SEED_OPTIONS.map((opt) => ({
				id: opt.id,
				label: opt.labelKey,
			})),
		[INFO_SEED_OPTIONS],
	);

	const [alert, setAlert] = useState<{
		type: 'error' | 'success';
		message: string;
	} | null>(null);

	const [dateTimeMode, setDateTimeMode] = useState<DateTimeMode>(
		initialValues?.check_in_date && initialValues?.check_in_time
			? 'isDateAndTime'
			: 'isOnlyTime',
	);

	const [selectedSeedInfoIds, setSelectedSeedInfoIds] = useState<string[]>(
		() => [...DEFAULT_SEED_INFO_IDS],
	);

	const [isOpen, setIsOpen] = useState(false);

	const toggleSeed = (id: string) => {
		setSelectedSeedInfoIds((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
		);
	};

	const { openLoading, closeLoading } = useLoading();

	const defaultValues = useMemo(
		() => getPropertyFormDefaultValues(isEdit, initialValues),
		[isEdit, initialValues],
	);

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
		shouldUnregister: false,
	});

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

		const fd = buildPropertyFormData({
			isEdit,
			locale,
			selectedSeedInfoIds,
			dateTimeMode,
			data,
		});

		openLoading();

		const result = isEdit
			? await updateProperty(propertyId as string, fd)
			: await createProperty(fd);

		if (result.errors) {
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

			<PropertyFormHeader
				isEdit={isEdit}
				title={
					isEdit
						? t('propertyForm.formEditTitle')
						: t('Nuevo Alojamiento')
				}
				modalTitle={t('createPropertyTipsModal.title')}
				primaryButtonLabel="Cancel"
				isOpen={isOpen}
				onOpen={() => setIsOpen(true)}
				onClose={() => setIsOpen(false)}
				tips={TIPS}
				t={t}
			/>

			{!isEdit && (
				<SeedOptions
					title={t('Contenido generado automáticamente')}
					options={seedOptions}
					selectedIds={selectedSeedInfoIds}
					onToggle={toggleSeed}
				/>
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

				<AddressSection
					t={t}
					locale={locale}
					isEdit={isEdit}
					error={Boolean(errors.address)}
					helperTextIdle={t('addressHelperIdle')}
					helperTextError={t('addressHelperError')}
					onSelect={handleSelectAddress}
					onClearSelection={clearSelection}
					addressValue={getValues('address')}
					addressRegisterProps={
						isEdit
							? register('address')
							: register('address', {
									required: t('La dirección es obligatoria'),
								})
					}
					latRegisterProps={register('latitude')}
					lngRegisterProps={register('longitude')}
				/>

				<div className="rounded-lg bg-primary-100 p-4 text-sm text-primary-800 font-medium">
					{t('address_hint')}
				</div>

				<div className="flex gap-1 p-1 rounded-full bg-gray-200 -mb-1">
					<Button
						label={t('propertyForm.dateAndTime')}
						className="w-full"
						color={
							dateTimeMode === 'isDateAndTime'
								? 'white'
								: 'secondary'
						}
						onClick={() => {
							if (dateTimeMode === 'isDateAndTime') return;
							setDateTimeMode('isDateAndTime');
						}}
					/>
					<Button
						label={t('propertyForm.onlyTime')}
						className="w-full"
						color={
							dateTimeMode === 'isOnlyTime'
								? 'white'
								: 'secondary'
						}
						onClick={() => {
							if (dateTimeMode === 'isOnlyTime') return;
							setDateTimeMode('isOnlyTime');

							// opcional: limpiar errores para que no aparezcan si el campo está oculto
							clearErrors(['checkInDate', 'checkOutDate']);
						}}
					/>
				</div>

				<fieldset className="flex flex-col gap-1">
					<div className="flex gap-2 flex-col sm:flex-row">
						{dateTimeMode === 'isDateAndTime' && (
							<div className="w-full">
								<TextField
									label={`${t('propertyForm.checkIn')}/${t('propertyForm.date')}`}
									id="checkInDate"
									type="date"
									{...register('checkInDate')}
									error={Boolean(errors.checkInDate)}
									helperText={
										errors.checkInDate?.message as string
									}
								/>
							</div>
						)}

						<div className="w-full">
							<TextField
								label={`${t('propertyForm.checkIn')}/${t('propertyForm.time')}`}
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
					<div className="flex gap-2 flex-col sm:flex-row">
						{dateTimeMode === 'isDateAndTime' && (
							<div className="flex-1">
								<TextField
									label={`${t('propertyForm.checkOut')}/${t('propertyForm.date')}`}
									id="checkOutDate"
									type="date"
									{...register('checkOutDate')}
									error={Boolean(errors.checkOutDate)}
									helperText={
										errors.checkOutDate?.message as string
									}
								/>
							</div>
						)}

						<div className="flex-1">
							<TextField
								label={`${t('propertyForm.checkOut')}/${t('propertyForm.time')}`}
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

				<fieldset className="flex flex-col gap-1">
					<TextArea
						id="accessInstructions"
						label={t('propertyForm.accessInstructions')}
						placeholder={t(
							'propertyForm.accessInstructionsPlaceholder',
						)}
						rows={4}
						{...register('accessInstructions')}
					/>
				</fieldset>

				<ImageSection
					t={t}
					isEdit={isEdit}
					imageUrl={initialValues?.image_url ?? null}
					label={t('Imagen')}
					error={errors.image}
					registerProps={register('image', {
						validate: (files) => {
							const file = files?.[0];
							if (!file) return true;
							if (file.size <= MAX_IMAGE_SIZE) return true;
							return `La imagen no debe superar ${(
								MAX_IMAGE_SIZE / 1024
							).toFixed(
								0,
							)} KB (tienes ${(file.size / 1024).toFixed(0)} KB)`;
						},
					})}
				/>

				<FormActions
					isEdit={isEdit}
					isSubmitting={isSubmitting}
					onCancel={() => router.back()}
					submitLabel={
						isEdit ? t('Guardar cambios') : t('Añadir propiedad')
					}
					cancelLabel={t('Cancelar')}
					showFeedback={!isEdit}
					feedbackLabel={t('feedback.cta')}
					feedbackHref="/app/feedback/create_property?returnTo=/app/properties/new"
				/>
			</form>
		</div>
	);
};

export default AddPropertyForm;
