'use client';

import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useLoading } from '@/lib/context/LoadingContext';
import Alert from '@/components/molecules/alert';
import { Select, SelectOption } from '@/components/molecules/select';
import Button from '@/components/molecules/button';
import { fetchNearbyPOIs, POI } from '@/lib/fetcher-nearby';

type FormValues = {
	preferences: string;
	duration: string;
	transport: string;
};

const preferencesOptions: SelectOption[] = [
	{ value: 'culture', label: 'Cultura' },
	{ value: 'food', label: 'Gastronomía' },
	{ value: 'nature', label: 'Naturaleza' },
	{ value: 'shopping', label: 'Compras' },
	{ value: 'tours', label: 'Tours' },
];

const durationOptions: SelectOption[] = [
	{ value: 'half_day', label: 'Medio día' },
	{ value: 'full_day', label: 'Día completo' },
	{ value: 'weekend', label: 'Fin de semana' },
];

const transportOptions: SelectOption[] = [
	{ value: 'walk', label: 'A pie' },
	{ value: 'bike', label: 'Bicicleta' },
	{ value: 'car', label: 'Coche' },
	{ value: 'public', label: 'Transporte público' },
];

const ItineraryForm = ({
	lat,
	lng,
	locale = 'es',
}: {
	lat: number;
	lng: number;
	locale?: string;
}) => {
	const t = useTranslations();
	const { openLoading, closeLoading } = useLoading();

	const [alert, setAlert] = useState<{
		type: 'error' | 'success';
		message: string;
	} | null>(null);
	const [itinerary, setItinerary] = useState<string | null>(null);

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({
		defaultValues: {
			preferences: '',
			duration: '',
			transport: '',
		},
	});

	const onSubmit: SubmitHandler<FormValues> = async (data) => {
		openLoading();

		try {
			const poiList: POI[] = await fetchNearbyPOIs({
				lat,
				lng,
				preferences: [data.preferences],
				language: locale,
			});

			const response = await fetch('/api/custom-plan', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					location: `${lat},${lng}`,
					preferences: [data.preferences],
					duration: data.duration,
					transport: data.transport,
					poiList,
					locale,
				}),
			});

			const result = await response.json();
			if (!result.success) {
				throw new Error();
			}

			setItinerary(result.itinerary);
			setAlert({
				type: 'success',
				message: t('Itinerario generado con éxito'),
			});
		} catch (error) {
			console.log(error);
			setAlert({
				type: 'error',
				message: t('Hubo un problema al generar el itinerario'),
			});
		}

		closeLoading();
	};

	return (
		<div className="w-full max-w-[500px] flex flex-col gap-4 ml-auto mr-auto">
			<h1 className="font-bold font-heading text-3xl">
				{t('Crea tu día ideal')}
			</h1>

			<h2 className="bg-info-100 rounded-lg p-4">
				{t(
					'El contenido que se generará a continuación ha sido creado automáticamente mediante inteligencia artificial'
				)}
			</h2>

			{alert && (
				<Alert
					type={alert.type}
					title={alert.type === 'error' ? t('Error') : t('Éxito')}
					message={alert.message}
					open={!!alert}
					hideTime={3000}
				/>
			)}

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-6"
			>
				<Controller
					name="preferences"
					control={control}
					rules={{
						required: t('Selecciona al menos una preferencia'),
					}}
					render={({ field }) => (
						<Select
							label={t('Qué te gusta hacer')}
							options={preferencesOptions.map((o) => ({
								...o,
								label: t(o.label),
							}))}
							className="w-full"
							value={field.value}
							onChange={field.onChange}
							name="preferences"
							error={!!errors.preferences}
							helperText={errors.preferences?.message}
							placeholder={t('Selecciona una preferencia')}
						/>
					)}
				/>

				<Controller
					name="duration"
					control={control}
					rules={{
						required: t(
							'Selecciona cuánto tiempo tienes disponible'
						),
					}}
					render={({ field }) => (
						<Select
							label={t('Tiempo disponible')}
							options={durationOptions.map((o) => ({
								...o,
								label: t(o.label),
							}))}
							className="w-full"
							value={field.value}
							onChange={field.onChange}
							name="duration"
							error={!!errors.duration}
							helperText={errors.duration?.message}
							placeholder={t('Selecciona duración')}
						/>
					)}
				/>

				<Controller
					name="transport"
					control={control}
					rules={{ required: t('Selecciona un modo de transporte') }}
					render={({ field }) => (
						<Select
							label={t('Cómo prefieres moverte')}
							options={transportOptions.map((o) => ({
								...o,
								label: t(o.label),
							}))}
							className="w-full"
							value={field.value}
							onChange={field.onChange}
							name="transport"
							error={!!errors.transport}
							helperText={errors.transport?.message}
							placeholder={t('Selecciona transporte')}
						/>
					)}
				/>

				<Button
					type="submit"
					label={t('Generar itinerario')}
					disabled={isSubmitting}
					className="w-full"
				/>
			</form>

			{itinerary && (
				<>
					<h2 className="font-bold text-2xl">
						{t('Tu plan personalizado')}
					</h2>
					<div className="p-4 bg-gray-100 rounded-lg">
						<pre className="whitespace-pre-wrap font-body">
							{itinerary}
						</pre>
					</div>
				</>
			)}
		</div>
	);
};

export default ItineraryForm;
