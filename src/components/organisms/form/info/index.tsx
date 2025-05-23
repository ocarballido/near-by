// UpdateInfoForm.tsx
'use client';

import { useTranslations } from 'next-intl';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useLoading } from '@/lib/context/LoadingContext';
import { useAIUsage } from '@/lib/context/AIUsageContext';

import {
	updateInfo,
	UpdateInfoState,
} from '@/app/actions/property-info/update-info';
import { generateAIContent } from '@/app/actions/generate-ai-content/generate-info';

import TextArea from '@/components/molecules/text-area';
import Button from '@/components/molecules/button';
import Alert from '@/components/molecules/alert';
import ButtonMagic from '@/components/molecules/button-magic';

type AddInfoFormProps = {
	propertySlug: string;
	categoryId: string;
	subCategoryId: string;
	title: string;
	initialContent?: string;
};

type FormValues = {
	id: string;
	content: string;
};

const UpdateInfoForm = ({
	propertySlug,
	categoryId,
	subCategoryId,
	title,
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

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
		setValue,
	} = useForm<FormValues>({
		defaultValues: { content: initialContent },
	});

	const onSubmit: SubmitHandler<FormValues> = async ({ content }) => {
		openLoading();
		setAlert(null);

		const fd = new FormData();
		fd.append('info_id', subCategoryId);
		fd.append('content', content);

		const result: UpdateInfoState = await updateInfo(fd);

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
				`${result.redirectTo}/${propertySlug}/${categoryId}/${subCategoryId}`
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
			if (remaining >= 20) {
				return 'text-primary-500 bg-primary-100';
			} else if (remaining > 10 && remaining < 20) {
				return 'text-warning-500 bg-warning-100';
			}

			return 'text-error-500 bg-error-100';
		}

		return;
	}, [remaining]);

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

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-4 w-full max-w-[600px]"
			>
				<h1 className="font-heading font-bold text-lg">{t(title)}</h1>

				{/* Text content */}
				<TextArea
					label={t('Añade el contenido que desees')}
					defaultValue={initialContent}
					{...register('content', {
						required: 'El contenido es obligatorio',
					})}
					error={!!errors.content}
					helperText={errors.content?.message}
					rows={15}
				/>

				<h2 className="font-heading font-bold text-2xl -mb-3">
					{t(
						'Utiliza nuestra Inteligenta Artificial para generar contenidos'
					)}
				</h2>

				<p className="text-md">
					{t(
						'Puedes usar nuestra inteligencia artificial para generar contenido automáticamente'
					)}
				</p>

				<div className="relative z-10 bg-white rounded-md">
					<div className="absolute -inset-1 z-[-1] rounded-md bg-gradient-to-tr from-[#FF6B06] to-[#31C48D] blur-xl opacity-30"></div>
					<div className="w-[full] bg-white rounded-lg p-4 flex flex-col gap-2 shadow-sm">
						<TextArea
							label={t(
								'Describe lo que quieres que la IA escriba'
							)}
							value={prompt}
							onChange={(e) => setPrompt(e.target.value)}
							rows={4}
							placeholder={t(
								'Instrucciones para el uso del aire acondicionado y te ayudaremos a redactarlo'
							)}
						/>

						<ButtonMagic
							label={
								generating
									? t('Generando')
									: t('Generar con IA')
							}
							disabled={!prompt || generating || remaining === 0}
							className="w-full shadow-none ml-auto mr-auto mb-2"
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
											'Número de consultas restantes de la AI'
										)}
									</span>
									<span
										className={`font-bold w-6 h-6 inline-flex items-center justify-center rounded-full ml-1 ${remainingColor}`}
									>{` ${remaining}`}</span>
									{/* {remaining > 0
									? t(
											'Número de consultas restantes de la AI'
									  ) + ` ${remaining}`
									: t('Has alcanzado el límite diario de IA')} */}
								</p>
							))}
					</div>
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
						label={t('Añadir información')}
						className="w-full"
						disabled={isSubmitting}
					/>
				</div>
			</form>
		</>
	);
};

export default UpdateInfoForm;
