// UpdateInfoForm.tsx
'use client';

import { useTranslations } from 'next-intl';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import { useLoading } from '@/lib/context/LoadingContext';
import { useAIUsage } from '@/lib/context/AIUsageContext';

import { updateInfo } from '@/app/actions/property-info/update-info';
import { generateAIContent } from '@/app/actions/generate-ai-content/generate-info';

import TextArea from '@/components/molecules/text-area';
import Button from '@/components/molecules/button';
import Alert from '@/components/molecules/alert';
import ButtonMagic from '@/components/molecules/button-magic';
import ButtonLink from '@/components/molecules/button-link';
import IconHelp from '@/components/atoms/icon/help';
import FancyIcon from '@/components/atoms/icon/fancy-icon';
import IconInfo from '@/components/atoms/icon/info';
import Typography from '@/components/atoms/typography';

import { DAILY_AI_USAGE_LIMMIT } from '@/config/config-constants';
import DashboardData from '../../dashboard-card/dashboard-data';

type AddInfoFormProps = {
	propertyId: string;
	categoryId: string;
	subCategoryId: string;
	name: string | null;
	initialContent?: string;
};

type FormValues = {
	id: string;
	content: string;
};

type CreateInfoState = {
	errors?: {
		content?: string[];
		server?: string[];
	};
	success?: boolean;
	message?: string;
	redirectTo?: string;
};

const UpdateInfoForm = ({
	propertyId,
	categoryId,
	subCategoryId,
	name,
	initialContent = '',
}: AddInfoFormProps) => {
	const t = useTranslations();

	const router = useRouter();

	const [alert, setAlert] = useState<{
		type: 'error' | 'success';
		message: string;
	} | null>(null);

	const [prompt, setPrompt] = useState('');
	const [generating, setGenerating] = useState(false);

	const { openLoading, closeLoading } = useLoading();
	const { remaining, reloadUsage } = useAIUsage();

	useEffect(() => {
		// load remaining AI usage when this screen mounts
		void reloadUsage();
	}, [reloadUsage]);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
		setValue,
	} = useForm<FormValues>({
		defaultValues: { content: initialContent ?? '' },
	});

	const onSubmit: SubmitHandler<FormValues> = async ({ content }) => {
		openLoading();
		setAlert(null);

		const fd = new FormData();
		fd.append('property_id', propertyId);
		fd.append('category_id', categoryId);
		fd.append('sub_category_id', subCategoryId);
		fd.append('type', 'info'); // o dinámico si corresponde
		fd.append('content', content);

		const result: CreateInfoState = await updateInfo(fd);

		closeLoading();

		if (result.errors) {
			setAlert({
				type: 'error',
				message: result.errors.server?.[0] ?? 'Error',
			});
			return;
		}
		setAlert({ type: 'success', message: result.message! });

		if (result.redirectTo) {
			router.push(
				`${result.redirectTo}/${propertyId}/${categoryId}/${subCategoryId}`,
			);
			return;
		}

		reset({ content });
	};

	const generateAI = async () => {
		if (!prompt) return;
		setGenerating(true);
		setAlert(null);

		const result = await generateAIContent(prompt);

		if (result.error) {
			setAlert({ type: 'error', message: result.error });
		} else {
			setValue('content', result.content ?? '', { shouldValidate: true });
			setPrompt('');
			await reloadUsage();
		}

		setGenerating(false);
	};

	const remainingColor = useMemo(() => {
		if (remaining) {
			if (remaining >= Math.ceil((DAILY_AI_USAGE_LIMMIT / 3) * 2)) {
				return 'text-primary-500 bg-primary-100';
			} else if (
				remaining > Math.ceil(DAILY_AI_USAGE_LIMMIT / 3) &&
				remaining < DAILY_AI_USAGE_LIMMIT
			) {
				return 'text-warning-500 bg-warning-100';
			}

			return 'text-error-500 bg-error-100';
		}

		return;
	}, [remaining]);

	return (
		<div className="bg-white rounded-xl max-w-[600px] w-full shadow-xs">
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

			<div className="rounded-lg flex flex-col gap-2 items-center mb-3">
				<FancyIcon icon={<IconInfo color="white" />} color="gradient" />
				{name && (
					<Typography component="h2" size="lg">
						{t(name)}
					</Typography>
				)}
			</div>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-0 w-full"
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
								{t('demo.navigation.editPropertyInfo')}
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
					{/* Text content */}
					<TextArea
						label={t('Añade el contenido que desees')}
						defaultValue={initialContent}
						{...register('content')}
						error={!!errors.content}
						helperText={errors.content?.message}
						rows={15}
					/>
				</div>

				<div className="flex flex-col gap-4 p-4 border-b border-gray-200">
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
								{t('Generar con IA')}
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
					<TextArea
						label={t('Describe lo que quieres que la IA escriba')}
						value={prompt}
						onChange={(e) => setPrompt(e.target.value)}
						rows={4}
						placeholder={t(
							'Instrucciones para el uso del aire acondicionado y te ayudaremos a redactarlo',
						)}
					/>

					<ButtonMagic
						label={
							generating ? t('Generando') : t('Generar con IA')
						}
						disabled={!prompt || generating || remaining === 0}
						className="w-full shadow-none ml-auto mr-auto my-2"
						onClick={generateAI}
					/>

					{remaining !== null &&
						(remaining === 0 ? (
							<p className="text-xs text-error-500 font-medium py-1 px-3 w-full text-center uppercase">
								{t('Has alcanzado el límite diario de IA')}
							</p>
						) : (
							<p className="text-xs flex justify-center items-center text-gray-600 font-medium py-1 px-3 w-full text-center uppercase">
								<span>
									{t(
										'Número de consultas restantes de la AI',
									)}
								</span>
								<span
									className={`font-bold w-6 h-6 inline-flex items-center justify-center rounded-full ml-1 ${remainingColor}`}
								>{` ${remaining}`}</span>
							</p>
						))}
				</div>

				<div className="flex flex-col gap-4 p-4">
					<div className="flex flex-col gap-2">
						<Button
							type="submit"
							label={t('Añadir información')}
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
							href={`/app/feedback/create_info/property/${propertyId}?returnTo=/app/properties/${propertyId}/${categoryId}/${subCategoryId}`}
							color="white"
							className="w-full"
							iconLeft={<IconHelp />}
						/>
					</div>
				</div>
			</form>
		</div>
	);
};

export default UpdateInfoForm;
