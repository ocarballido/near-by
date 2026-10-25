// AddPlaceForm.tsx
'use client';
/// <reference types="google.maps" />

import { useTranslations, useLocale } from 'next-intl';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useLoading } from '@/lib/context/LoadingContext';

import { createLocation } from '@/app/actions/locations/add-location';
import { updateLocation } from '@/app/actions/locations/update-location';
import { type PlaceRecommendation } from '@/app/actions/locations/get-recommendations';

import {
	MAX_IMAGE_SIZE,
	MAX_LOCATION_DESCRIPTION_LENGTH,
	MAX_LOCATION_NAME_LENGTH,
} from '@/config/config-constants';

import TextField from '@/components/molecules/text-field';
import InputFile from '@/components/molecules/input-file';
import Button from '@/components/molecules/button';
import Alert from '@/components/molecules/alert';
import TextArea from '@/components/molecules/text-area';
import BadgeCheck from '@/components/atoms/BadgeCheck';
import IconModeHeat from '@/components/atoms/icon/mode-heat';
import IconFavorite from '@/components/atoms/icon/favorite';
import ButtonLink from '@/components/molecules/button-link';
import IconHelp from '@/components/atoms/icon/help';
import FancyIcon from '@/components/atoms/icon/fancy-icon';
import Typography from '@/components/atoms/typography';
import IconApartment from '@/components/atoms/icon/apartment';
import Modal from '@/components/organisms/modal';
import RecomendationCard from '../../recomendation-card';

import PlaceAutocompleteField from '@/components/molecules/place-autocomplete';
import { SelectedPlace } from '@/components/molecules/place-autocomplete';
import IconLocationOn from '@/components/atoms/icon/location-on';
import IconOpenInNew from '@/components/atoms/icon/open-in-new';
import DashboardData from '../../dashboard-card/dashboard-data';

type FormValues = {
	property_id: string;
	sub_category_id: string;
	category_id: string;
	name: string;
	address: string;
	latitude: string;
	longitude: string;
	description?: string;
	website?: string;
	phone?: string;
	image?: FileList;
	featured: boolean;
	must_visit: boolean;
};

export type EditLocationInitialValues = {
	name: string;
	address: string;
	description: string;
	image_url: string | null;
	featured: boolean;
	must_visit: boolean;
};

type Props = {
	propertyId: string;
	subCategoryId: string;
	categoryId: string;
	initialRecos?: PlaceRecommendation[];
	// si vienen ambos => modo edición
	locationId?: string;
	initialValues?: EditLocationInitialValues;
};

const AddPlaceForm = ({
	propertyId,
	subCategoryId,
	categoryId,
	initialRecos = [],
	locationId,
	initialValues,
}: Props) => {
	const t = useTranslations();
	const locale = useLocale();
	const router = useRouter();

	const isEdit = Boolean(locationId && initialValues);

	const [removeImage, setRemoveImage] = useState(false);

	const [alert, setAlert] = useState<{
		type: 'error' | 'success';
		message: string;
	} | null>(null);

	const { openLoading, closeLoading } = useLoading();

	const {
		register,
		handleSubmit,
		setValue,
		setError,
		clearErrors,
		reset,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({
		defaultValues: {
			property_id: propertyId,
			sub_category_id: subCategoryId,
			category_id: categoryId,
			name: initialValues?.name ?? '',
			address: initialValues?.address ?? '',
			latitude: '',
			longitude: '',
			description: initialValues?.description ?? '',
			website: '',
			phone: '',
			featured: initialValues?.featured ?? false,
			must_visit: initialValues?.must_visit ?? false,
		},
	});

	const RECO_UI_ENABLED =
		process.env.NEXT_PUBLIC_RECOMMENDATIONS_ENABLED === 'true';

	const [recos] = useState<PlaceRecommendation[]>(initialRecos);
	const [selectedRecoId, setSelectedRecoId] = useState<string | null>(null);
	const [modalOpen, setModalOpen] = useState(false);

	const featuredValue = watch('featured');
	const mustVisitValue = watch('must_visit');

	const [coords, setCoords] = useState<SelectedPlace | null>(null);

	const handleSelectAddress = (p: SelectedPlace) => {
		setCoords(p);

		setValue('address', p.formattedAddress, {
			shouldDirty: true,
			shouldTouch: true,
			shouldValidate: true,
		});

		clearErrors('address');
	};

	const clearSelection = () => {
		setCoords(null);
		setSelectedRecoId(null);

		setValue('address', '', { shouldDirty: true, shouldValidate: true });
		setValue('latitude', '', { shouldDirty: true, shouldValidate: true });
		setValue('longitude', '', { shouldDirty: true, shouldValidate: true });
	};

	useEffect(() => {
		if (coords) {
			setValue('latitude', String(coords.lat), { shouldValidate: true });
			setValue('longitude', String(coords.lng), { shouldValidate: true });
		}
	}, [coords, setValue]);

	const onSubmit: SubmitHandler<FormValues> = async (data) => {
		if (!isEdit && !coords) {
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
		fd.append('featured', String(featuredValue));
		fd.append('must_visit', String(mustVisitValue));

		if (isEdit) {
			// La descripción va siempre: vacía significa que se ha borrado.
			// La dirección no es editable y no se envía.
			fd.append('description', data.description ?? '');
			if (file) fd.append('image', file);
			else if (removeImage) fd.append('image_action', 'remove');
		} else {
			fd.append('property_id', propertyId);
			fd.append('category_id', categoryId);
			fd.append('sub_category_id', subCategoryId);
			fd.append('address', data.address);
			fd.append('latitude', data.latitude);
			fd.append('longitude', data.longitude);
			fd.append('type', 'location');

			if (data.description) fd.append('description', data.description);
			if (data.website) fd.append('website', data.website);
			if (data.phone) fd.append('phone', data.phone);
			if (file) fd.append('image', file);
		}

		openLoading();
		const result =
			isEdit && locationId
				? await updateLocation(locationId, fd)
				: await createLocation(fd);
		closeLoading();

		// Los errores del servidor son claves de messages/*.json; los límites
		// se rellenan aquí con las mismas constantes que valida el servidor
		if (result.errors) {
			if (result.errors.name)
				setError('name', {
					type: 'manual',
					message: t(result.errors.name[0], {
						n: MAX_LOCATION_NAME_LENGTH,
					}),
				});
			if (result.errors.address)
				setError('address', {
					type: 'manual',
					message: t(result.errors.address[0]),
				});
			if (result.errors.sub_category_id)
				setAlert({
					type: 'error',
					message: t(result.errors.sub_category_id[0]),
				});
			if (result.errors.property_id)
				setAlert({
					type: 'error',
					message: t(result.errors.property_id[0]),
				});
			if (result.errors.image)
				setAlert({
					type: 'error',
					message: t(result.errors.image[0], {
						kb: (MAX_IMAGE_SIZE / 1024).toFixed(0),
					}),
				});
			if (result.errors.server)
				setAlert({
					type: 'error',
					message: t(result.errors.server[0]),
				});
			if (result.errors.description)
				setError('description', {
					type: 'manual',
					message: t(result.errors.description[0], {
						n: MAX_LOCATION_DESCRIPTION_LENGTH,
					}),
				});
			return;
		}

		if (result.redirectTo) {
			router.push(
				`${result.redirectTo}/${propertyId}/${categoryId}/${subCategoryId}`,
			);
			return;
		}

		reset();
		setCoords(null);
	};

	const applyRecommendation = (r: PlaceRecommendation) => {
		setSelectedRecoId(r.id);

		setValue('name', r.name, {
			shouldDirty: true,
			shouldTouch: true,
			shouldValidate: true,
		});

		handleSelectAddress({
			formattedAddress: r.address,
			lat: r.latitude,
			lng: r.longitude,
		} as SelectedPlace);
	};

	const teaserReco =
		(selectedRecoId ? recos.find((r) => r.id === selectedRecoId) : null) ??
		recos[0];

	return (
		<div className="bg-white rounded-xl max-w-[460px] w-full shadow-xs">
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

			<div className="rounded-lg p-3 pt-0 flex flex-col gap-2 items-center">
				<FancyIcon
					icon={<IconApartment color="white" />}
					color="gradient"
				/>
				<Typography component="h2" size="lg">
					{isEdit ? t('editLocationTitle') : t('Nuevo Sitio')}
				</Typography>
			</div>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-4 w-full"
			>
				<div className="flex flex-col gap-4 p-4 pt-0 border-b border-gray-200">
					<DashboardData
						label={
							<Typography
								size="sm"
								weight="medium"
								className="flex gap-2 items-center"
							>
								<span className="w-9 h-9 flex justify-center items-center rounded-full bg-primary-100 font-bold text-primary-800 text-base">
									1
								</span>
								{t('escencial')}
							</Typography>
						}
						action={
							<Typography
								weight="medium"
								className="flex gap-2 items-center text-xs!"
							>
								{t('Requerido')}
							</Typography>
						}
					/>

					{!isEdit && RECO_UI_ENABLED && recos.length > 0 && (
						<>
							<Modal
								title={t('recommendations.title')}
								open={modalOpen}
								onClose={() => {
									setModalOpen(false);
								}}
								secondaryButtonAction={() =>
									setModalOpen(false)
								}
								secondaryButtonLabel={t('Cancelar')}
								size="max-w-md"
							>
								<div className="flex flex-col gap-3 items-center">
									<FancyIcon
										color="gradient"
										icon={<IconLocationOn color="white" />}
									/>
									<Typography>
										{t('recommendations.subtitle')}
									</Typography>
									<div className="flex flex-col gap-1 w-full">
										{recos.map((r) => {
											const selected =
												selectedRecoId === r.id;
											return (
												<RecomendationCard
													key={r.id}
													id={r.id}
													name={r.name}
													address={r.address}
													rating={r.rating}
													selected={selected}
													applyRecommendation={() => {
														applyRecommendation(r);
														setModalOpen(false);
													}}
												/>
											);
										})}
									</div>
								</div>
							</Modal>
							<fieldset className="flex flex-col gap-2 text-center">
								<Typography
									size="base"
									component="h3"
									className="flex items-center justify-center gap-1"
								>
									<IconLocationOn color="primary" />
									{t('recommendations.title')}
								</Typography>
								<div className="bg-gray-200 p-1 rounded-b-3xl rounded-t-2xl flex flex-col gap-1">
									{teaserReco && (
										<RecomendationCard
											id={teaserReco.id}
											name={teaserReco.name}
											address={teaserReco.address}
											rating={teaserReco.rating}
											selected={
												selectedRecoId === teaserReco.id
											}
											applyRecommendation={() =>
												applyRecommendation(teaserReco)
											}
										/>
									)}

									<Button
										color="secondary"
										onClick={() => setModalOpen(true)}
										label={t('recommendations.cta')}
										iconLeft={<IconOpenInNew />}
									/>
								</div>
							</fieldset>
						</>
					)}
					<TextField
						label={t('Nombre del sitio *')}
						placeholder={t('Sitio nombre ejemplo')}
						id="name"
						maxLength={MAX_LOCATION_NAME_LENGTH}
						{...register('name', {
							setValueAs: (v) =>
								typeof v === 'string' ? v.trim() : v,
							required: t('El nombre es obligatorio'),
						})}
						error={Boolean(errors.name)}
						helperText={errors.name?.message}
					/>

					{isEdit ? (
						// La dirección no es editable: para otra dirección, el
						// anfitrión elimina el sitio y crea uno nuevo
						<TextField
							label={t('Dirección *')}
							id="address"
							defaultValue={initialValues?.address}
							disabled
						/>
					) : (
						<>
							<PlaceAutocompleteField
								label={t('Dirección *')}
								placeholder={t('Sitio dirección ejemplo')}
								locale={locale}
								countryCodes={['es']}
								error={Boolean(errors.address)}
								helperTextIdle={t('addressHelperIdle')}
								helperTextError={t('addressHelperError')}
								onSelect={handleSelectAddress}
								onClearSelection={clearSelection}
								isSelected={!!coords}
								selectedValue={watch('address')}
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

					<TextArea
						label={t('Descripción')}
						placeholder={t('description-placeholder')}
						rows={3}
						{...register('description', {
							setValueAs: (v) =>
								typeof v === 'string' ? v.trim() : v,
							maxLength: {
								value: MAX_LOCATION_DESCRIPTION_LENGTH,
								message: t('description-characters', {
									n: MAX_LOCATION_DESCRIPTION_LENGTH,
								}),
							},
						})}
						error={!!errors.description}
						helperText={errors.description?.message}
					/>
				</div>

				<div className="flex flex-col gap-4 p-4 pt-0 border-b border-gray-200">
					<DashboardData
						label={
							<Typography
								size="sm"
								weight="medium"
								className="flex gap-2 items-center"
							>
								<span className="w-9 h-9 flex justify-center items-center rounded-full bg-primary-100 font-bold text-primary-800 text-base">
									2
								</span>
								{t('markLocation')}
							</Typography>
						}
						action={
							<Typography
								weight="medium"
								className="flex gap-2 items-center text-xs!"
							>
								{t('Opcional')}
							</Typography>
						}
					/>
					<fieldset className="flex flex-col gap-2">
						<div className="flex items-center gap-2">
							<div className="flex gap-0.5 items-center w-full">
								<div className="shrink-0">
									<IconFavorite color="primary" size={20} />
								</div>
								<BadgeCheck
									label={t('markFavoriteCheck')}
									checked={!!featuredValue}
									className="w-full"
									onToggle={() => {
										setValue('featured', !featuredValue, {
											shouldDirty: true,
											shouldTouch: true,
											shouldValidate: true,
										});
									}}
								/>
							</div>
							<div className="flex gap-0.5 items-center w-full">
								<div className="shrink-0">
									<IconModeHeat color="error" size={20} />
								</div>
								<BadgeCheck
									label={t('markMustSeeCheck')}
									checked={!!mustVisitValue}
									className="w-full"
									checkedColor="error"
									onToggle={() => {
										setValue(
											'must_visit',
											!mustVisitValue,
											{
												shouldDirty: true,
												shouldTouch: true,
												shouldValidate: true,
											},
										);
									}}
								/>
							</div>
						</div>
					</fieldset>
				</div>

				<div className="flex flex-col gap-4 p-4 pt-0 justify-center">
					<DashboardData
						label={
							<Typography
								size="sm"
								weight="medium"
								className="flex gap-2 items-center"
							>
								<span className="w-9 h-9 flex justify-center items-center rounded-full bg-primary-100 font-bold text-primary-800 text-base">
									3
								</span>
								{t('image')}
							</Typography>
						}
						action={
							<Typography
								weight="medium"
								className="flex gap-2 items-center text-xs!"
							>
								{t('Opcional')}
							</Typography>
						}
					/>
					<InputFile
						className="w-full mx-auto"
						label={t('Imagen')}
						error={Boolean(errors.image)}
						helperText={errors.image?.message as string}
						initialPreviewUrl={initialValues?.image_url ?? null}
						onRemove={() => setRemoveImage(true)}
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
				</div>

				{/* sticky: se queda al pie del área de scroll (el <main> del
				    layout) sin salir de la tarjeta, y vuelve a su sitio al
				    llegar al final del formulario */}
				<div className="sticky bottom-0 z-10 flex flex-col gap-2 p-4 bg-white border-t border-gray-200 last:rounded-b-xl">
					<Button
						type="submit"
						label={isEdit ? t('Guardar cambios') : t('Añadir')}
						className="w-full"
						disabled={isSubmitting}
					/>
					<Button
						label={t('Cancelar')}
						className="w-full"
						color="secondary"
						onClick={() => router.back()}
					/>
				</div>

				{!isEdit && (
					<div className="px-4 pb-4">
						<ButtonLink
							label={t('feedback.cta')}
							href={`/app/feedback/create_location/property/${propertyId}?returnTo=/app/properties/${propertyId}/${categoryId}/${subCategoryId}`}
							color="white"
							className="w-full"
							iconLeft={<IconHelp />}
						/>
					</div>
				)}
			</form>
		</div>
	);
};

export default AddPlaceForm;
