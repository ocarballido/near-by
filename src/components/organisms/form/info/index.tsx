// UpdateInfoForm.tsx
'use client';
/// <reference types="google.maps" />

import { useTranslations } from 'next-intl';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useLoading } from '@/lib/context/LoadingContext';

import {
	updateInfo,
	UpdateInfoState,
} from '@/app/actions/property-info/update-info';

import TextArea from '@/components/molecules/text-area';
import Button from '@/components/molecules/button';
import Alert from '@/components/molecules/alert';

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

	const { openLoading, closeLoading } = useLoading();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
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
				<h1 className="font-heading font-bold text-lg text-primary-500">
					{t(title)}
				</h1>

				<TextArea
					label={''}
					defaultValue={initialContent}
					{...register('content', {
						required: 'El contenido es obligatorio',
					})}
					error={!!errors.content}
					helperText={errors.content?.message}
					rows={20}
				/>

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
