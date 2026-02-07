// AddPlaceForm.tsx
'use client';
/// <reference types="google.maps" />

import { useTranslations, useLocale } from 'next-intl';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useLoading } from '@/lib/context/LoadingContext';

import { createLocation } from '@/app/actions/locations/add-location';
import { type PlaceRecommendation } from '@/app/actions/locations/get-recommendations';

import { MAX_IMAGE_SIZE } from '@/config/config-constants';

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

import PlaceAutocompleteField from '@/components/molecules/place-autocomplete';
import { SelectedPlace } from '@/components/molecules/place-autocomplete';

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

const AddPlaceForm = ({
	propertyId,
	subCategoryId,
	categoryId,
	initialRecos = [],
}: {
	propertyId: string;
	subCategoryId: string;
	categoryId: string;
	initialRecos?: PlaceRecommendation[];
}) => {
	const t = useTranslations();
	const locale = useLocale();
	const router = useRouter();

	const formTopRef = useRef<HTMLDivElement | null>(null);

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
			name: '',
			address: '',
			latitude: '',
			longitude: '',
			description: '',
			website: '',
			phone: '',
			featured: false,
			must_visit: false,
		},
	});

	const RECO_UI_ENABLED =
		process.env.NEXT_PUBLIC_RECOMMENDATIONS_ENABLED === 'true';

	const [recos] = useState<PlaceRecommendation[]>(initialRecos);
	const [selectedRecoId, setSelectedRecoId] = useState<string | null>(null);

	const featuredValue = watch('featured');
	const mustVisitValue = watch('must_visit');

	// ✅ coords now come from PlaceAutocomplete selection
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
		fd.append('property_id', propertyId);
		fd.append('category_id', categoryId);
		fd.append('sub_category_id', subCategoryId);
		fd.append('name', data.name);
		fd.append('address', data.address);
		fd.append('latitude', data.latitude);
		fd.append('longitude', data.longitude);
		fd.append('featured', String(featuredValue));
		fd.append('must_visit', String(mustVisitValue));
		fd.append('type', 'location');

		if (data.description) fd.append('description', data.description);
		if (data.website) fd.append('website', data.website);
		if (data.phone) fd.append('phone', data.phone);
		if (file) fd.append('image', file);

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
			if (result.errors.sub_category_id)
				setAlert({
					type: 'error',
					message: result.errors.sub_category_id[0],
				});
			if (result.errors.property_id)
				setAlert({
					type: 'error',
					message: result.errors.property_id[0],
				});
			if (result.errors.server)
				setAlert({ type: 'error', message: result.errors.server[0] });
			if (result.errors.description)
				setError('description', {
					type: 'manual',
					message: result.errors.description[0],
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

		formTopRef.current?.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	};

	return (
		<div
			ref={formTopRef}
			className="bg-white p-2 rounded-xl max-w-[400px] w-full shadow-xs"
		>
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
					{t('Nuevo Sitio')}
				</Typography>
			</div>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-4 p-2 w-full"
			>
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

				<PlaceAutocompleteField
					label={t('Dirección *')}
					placeholder={t('Sitio dirección ejemplo')}
					locale={locale}
					countryCodes={['es']}
					error={Boolean(errors.address)}
					helperTextIdle={t('addressHelperIdle')}
					helperTextSelected={t('addressHelperSelected')}
					helperTextError={t('addressHelperError')}
					onSelect={handleSelectAddress}
					onClearSelection={clearSelection}
					isSelected={!!coords}
					selectedValue={watch('address')}
				/>

				{/* RHF: registramos address aunque el input visible lo gestione Google */}
				<input
					type="hidden"
					{...register('address', {
						required: t('La dirección es obligatoria'),
					})}
				/>
				<input type="hidden" {...register('latitude')} />
				<input type="hidden" {...register('longitude')} />

				<TextArea
					label={t('Descripción')}
					placeholder={t('description-placeholder')}
					rows={3}
					{...register('description', {
						setValueAs: (v) =>
							typeof v === 'string' ? v.trim() : v,
						maxLength: {
							value: 200,
							message: t('description-characters', { n: 200 }),
						},
					})}
					error={!!errors.description}
					helperText={errors.description?.message}
				/>

				<fieldset className="flex flex-col gap-2">
					<p className="font-medium text-sm">{t('markLocation')}</p>
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
									setValue('must_visit', !mustVisitValue, {
										shouldDirty: true,
										shouldTouch: true,
										shouldValidate: true,
									});
								}}
							/>
						</div>
					</div>
					<div className="p-4 bg-sky-100 rounded-md">
						<p className="text-xs text-sky-900 mb-2">
							{t('favoriteExplained')}
						</p>
						<p className="text-xs text-sky-900">
							{t('mustSeeExplained')}
						</p>
					</div>
				</fieldset>

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
						label={t('Añadir')}
						className="w-full"
						disabled={isSubmitting}
					/>
					<Button
						label={t('Cancelar')}
						className="w-full"
						color="secondary"
						onClick={() => router.back()}
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

			{RECO_UI_ENABLED && (
				<div className="flex flex-col gap-2">
					{recos.length ? (
						<>
							<p className="text-sm font-medium">
								{/* {t('Cerca de tu alojamiento')} */}
								Cerca de tu alojamiento
							</p>
							<div className="flex flex-col gap-2">
								{recos.map((r) => {
									const selected = selectedRecoId === r.id;
									return (
										<button
											key={r.id}
											type="button"
											onClick={() =>
												applyRecommendation(r)
											}
											className={[
												'w-full text-left rounded-lg border p-3',
												selected
													? 'border-primary-500 bg-primary-50'
													: 'border-gray-200 bg-white',
											].join(' ')}
										>
											<div className="flex items-start justify-between gap-2">
												<div>
													<p className="text-sm font-medium">
														{r.name}
													</p>
													<p className="text-xs text-gray-600">
														{r.address}
													</p>
												</div>
												<div className="text-xs text-gray-600">
													{typeof r.rating ===
													'number'
														? `★ ${r.rating.toFixed(1)}`
														: null}
												</div>
											</div>
											<div className="mt-2">
												<span className="inline-flex items-center rounded-md px-2 py-1 text-xs border">
													{selected
														? 'Seleccionado'
														: 'Usar este sitio'}
												</span>
											</div>
										</button>
									);
								})}
							</div>
						</>
					) : null}
				</div>
			)}
		</div>
	);
};

export default AddPlaceForm;
