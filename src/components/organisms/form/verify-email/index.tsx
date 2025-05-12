'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import TextField from '@/components/molecules/text-field';
import Button from '@/components/molecules/button';
import ButtonLink from '@/components/molecules/button-link';
import { useTranslations } from 'next-intl';
import Alert from '@/components/molecules/alert';

type VerifyEmailFormProps = {
	formAction: (formData: FormData) => Promise<void>;
	loading: boolean;
	error?: string;
	success?: boolean;
};

type FormInputs = {
	email: string;
};

export default function VerifyEmailForm({
	formAction,
	loading,
	error,
	success,
}: VerifyEmailFormProps) {
	const t = useTranslations();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormInputs>();

	const onSubmit: SubmitHandler<FormInputs> = async (data) => {
		const formData = new FormData();
		formData.append('email', data.email);
		await formAction(formData);
	};

	return (
		<div className="flex flex-col items-center gap-4 max-w-96 w-full">
			{error ||
				(success && (
					<Alert
						message={
							error
								? error
								: t(
										'El email de verificación se ha reenviado correctamente'
								  )
						}
						type={error ? 'error' : 'success'}
						dismissible
						open={error !== '' || success}
						title={error ? 'Error al enviar' : 'Enviado'}
					/>
				))}

			<h2 className="text-2xl font-bold text-gray-900 mb-2">
				{t('Verifica tu email')}
			</h2>

			<p className="text-gray-600 mb-8">
				{t('Email de verificación enviado')}
			</p>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="space-y-4 w-full"
			>
				<TextField
					label={t('Inserta tu dirección de email')}
					id="email"
					type="email"
					autoComplete="email"
					placeholder={t('emailExample')}
					className="w-full"
					error={Boolean(errors.email)}
					helperText={errors.email?.message as string}
					{...register('email', {
						required: t('Debes añadir Email'),
					})}
				/>

				<Button
					type="submit"
					label={loading ? t('Enviando') : t('Reenviar verificación')}
					className="w-full"
					color="primary"
					disabled={loading}
				/>

				<div className="p-1.5 rounded-3xl bg-primary-200 w-full">
					<p className="text-primary-800 pt-0.5 font-bold text-sm text-center mb-2">
						{t('Regresar al inicio de sesión')}
					</p>
					<ButtonLink
						label={t('Iniciar sesión')}
						href="/auth/login"
						color="white"
						className="hover:bg-primary-500 hover:text-white"
					/>
				</div>
			</form>
		</div>
	);
}
