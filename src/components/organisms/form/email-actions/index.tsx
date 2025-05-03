'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import Image from 'next/image';

import TextField from '@/components/molecules/text-field';
import Button from '@/components/molecules/button';
import ButtonLink from '@/components/molecules/button-link';
import Alert from '@/components/molecules/alert';

type EmailActionsFormProps = {
	formAction: (formData: FormData) => Promise<void>;
	loading: boolean;
	error?: string;
	success?: boolean;
	type?: 'EMAIL_VERIFICATION' | 'RECOVER_PASSWORD';
};

type FormInputs = {
	email: string;
};

export default function EmailActionsForm({
	formAction,
	loading,
	error,
	success,
	type = 'EMAIL_VERIFICATION',
}: EmailActionsFormProps) {
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

			<Image
				width={100}
				height={100}
				src="/static/img/placeholders/logo.png"
				alt="Logo"
				className="grow-0"
			/>
			<h2 className="text-2xl font-bold text-gray-900 mb-2">
				{type === 'EMAIL_VERIFICATION'
					? t('Verifica tu email')
					: t('Restablecer su contraseña')}
			</h2>

			<p className="text-gray-600 mb-8">
				{type === 'EMAIL_VERIFICATION'
					? t('Email de verificación enviado')
					: t(
							'Ingrese su dirección de correo electrónico y le enviaremos un enlace para restablecer su contraseña'
					  )}
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
					label={
						loading
							? t('Enviando')
							: type === 'EMAIL_VERIFICATION'
							? t('Reenviar verificación')
							: t('Enviar enlace de restablecimiento')
					}
					className="w-full"
					color="primary"
					disabled={loading}
				/>

				<div className="p-1.5 rounded-3xl bg-primary-200 w-full">
					<p className="text-primary-800 pt-0.5 font-bold text-sm text-center mb-2">
						{type === 'EMAIL_VERIFICATION'
							? t('Regresar al inicio de sesión')
							: t('Recuerdas tu contraseña')}
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
