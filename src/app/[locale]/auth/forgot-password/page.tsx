'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm, SubmitHandler } from 'react-hook-form';

import { createSPASassClient } from '@/lib/supabase/client';

import Image from 'next/image';
import Alert from '@/components/molecules/alert';
import Spinner from '@/components/atoms/spinner';
import Button from '@/components/molecules/button';
import ButtonLink from '@/components/molecules/button-link';
import TextField from '@/components/molecules/text-field';

type ForgotPasswordInputs = {
	email: string;
};

export default function ForgotPasswordPage() {
	const t = useTranslations();

	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ForgotPasswordInputs>();

	const onSubmit: SubmitHandler<ForgotPasswordInputs> = async ({ email }) => {
		setError('');
		setLoading(true);

		try {
			const supabase = await createSPASassClient();
			const { error } = await supabase
				.getSupabaseClient()
				.auth.resetPasswordForEmail(email, {
					redirectTo: `${window.location.origin}/auth/reset-password`,
				});

			if (error) throw error;

			setSuccess(true);
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError('An unknown error occurred');
			}
		} finally {
			setLoading(false);
		}
	};

	if (success) {
		return (
			<div className="relative max-w-96 w-full">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						{t('Revisa tu correo')}
					</h2>
					<p className="text-gray-600 mb-8">
						{t(
							'Te hemos enviado un enlace para restablecer tu contraseña a tu correo electrónico'
						)}
					</p>
					<ButtonLink
						href="/auth/login"
						label={t('Regresar al inicio de sesión')}
						color="primary"
						className="mt-4"
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="relative max-w-96 w-full">
			{error && (
				<Alert
					message={error}
					type="error"
					dismissible
					open={error !== ''}
					title="Error al enviar"
				/>
			)}

			{loading && <Spinner position="absolute" />}

			<div className="flex flex-col items-center gap-4 max-w-96 w-full">
				<Image
					width={100}
					height={100}
					src="/static/img/placeholders/logo.png"
					alt="Logo"
					className="grow-0"
				/>

				<h2 className="text-2xl font-bold text-gray-900 mb-2">
					{t('Restablecer su contraseña')}
				</h2>

				<p className="text-gray-600">
					{t(
						'Ingrese su dirección de correo electrónico y le enviaremos un enlace para restablecer su contraseña'
					)}
				</p>

				<form
					onSubmit={handleSubmit(onSubmit)}
					noValidate
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
							pattern: {
								value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
								message: t('Debes añadir Email'),
							},
						})}
					/>

					<Button
						type="submit"
						label={
							loading
								? t('Enviando')
								: t('Enviar enlace de restablecimiento')
						}
						className="w-full"
						color="primary"
						disabled={loading}
					/>

					<div className="p-1.5 rounded-3xl bg-primary-200 w-full">
						<p className="text-primary-800 pt-0.5 font-bold text-sm text-center mb-2">
							{t('Recuerdas tu contraseña')}
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
		</div>
	);
}
