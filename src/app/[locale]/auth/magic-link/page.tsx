'use client';
import Script from 'next/script';

import { useTranslations, useLocale } from 'next-intl';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';

import { createSPASassClient } from '@/lib/supabase/client';

import Link from 'next/link';
import RecaptchaCleaner from '../recaptcha-cleaner';
import TextField from '@/components/molecules/text-field';
import Button from '@/components/molecules/button';
import ButtonLink from '@/components/molecules/button-link';
import Alert from '@/components/molecules/alert';
import Spinner from '@/components/atoms/spinner';
import IconCheckCircle from '@/components/atoms/icon/check-circle';
import Typography from '@/components/atoms/typography';
import FancyIcon from '@/components/atoms/icon/fancy-icon';

type MagicLinkFormInputs = {
	email: string;
	acceptedTerms: boolean;
};

export default function MagicLinkPage() {
	const t = useTranslations();
	const locale = useLocale();

	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [emailSent, setEmailSent] = useState(false);
	const [userEmail, setUserEmail] = useState('');

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<MagicLinkFormInputs>({
		mode: 'onTouched',
	});

	const onSubmit: SubmitHandler<MagicLinkFormInputs> = async ({
		email,
		acceptedTerms,
	}) => {
		setError('');

		if (!acceptedTerms) {
			setError('Debes aceptar los términos');
			return;
		}

		setLoading(true);

		try {
			// Esperar a que grecaptcha esté listo
			await new Promise((resolve) => {
				if (window.grecaptcha?.ready) {
					window.grecaptcha.ready(resolve);
				} else {
					setTimeout(resolve, 500);
				}
			});

			const token = await window.grecaptcha.execute(
				process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
				{ action: 'submit' },
			);

			// Validar en backend
			const response = await fetch('/api/verify-recaptcha', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token, action: 'submit' }),
			});

			const result = await response.json();

			if (!result.success) {
				throw new Error('Validación reCAPTCHA fallida');
			}

			// Enviar magic link
			const supabase = await createSPASassClient();
			const { error } = await supabase.signInWithMagicLink(email, locale);

			if (error) throw error;

			setUserEmail(email);
			setEmailSent(true);
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError('Error inesperado');
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="relative max-w-96 w-full">
			<Script
				src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
				strategy="afterInteractive"
			/>

			<RecaptchaCleaner />

			{emailSent ? (
				<>
					<div className="relative max-w-96 w-full text-center font-body">
						<div className="rounded-lg p-6 mb-6">
							<div className="flex justify-center">
								<FancyIcon
									icon={<IconCheckCircle color="white" />}
									color="gradient"
								/>
							</div>

							<Typography
								component="h1"
								size="lg"
								className="text-center"
							>
								{t('¡Enlace enviado!')}
							</Typography>

							<Typography className="text-center">
								{t('Hemos enviado un enlace mágico a')}
							</Typography>

							<Typography className="text-center" weight="bold">
								{userEmail}
							</Typography>

							<div className="my-6">
								<Typography className="text-center">
									{t(
										'Revisa tu bandeja de entrada y haz clic en el enlace para iniciar sesión',
									)}
								</Typography>
								<Typography
									className="text-center"
									weight="bold"
								>
									{t('El enlace expirará en 24 horas')}
								</Typography>
							</div>

							<div className="mb-6">
								<Typography
									component="h2"
									size="base"
									className="text-center"
								>
									{t('¿No has recibido el enlace?')}
								</Typography>
								<Typography className="text-center">
									{t(
										'Verifica tu carpeta de spam o correo no deseado',
									)}
									.{' '}
									{t(
										'Asegúrate de que la dirección de correo sea correcta',
									)}
								</Typography>
							</div>

							<Button
								label={t('Enviar nuevo enlace')}
								color="secondary"
								className="w-full mb-2"
								onClick={() => setEmailSent(false)}
							/>

							<ButtonLink
								label={t('Volver al inicio')}
								href="/"
								color="primary"
								className="w-full"
							/>
						</div>
					</div>
				</>
			) : (
				<div className="relative max-w-96 w-full">
					{error && (
						<Alert
							message={error}
							type="error"
							dismissible
							open={error !== ''}
							title="Error"
						/>
					)}

					{loading && <Spinner position="absolute" />}

					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col items-center gap-4 max-w-96 w-full"
					>
						<Typography
							component="h1"
							size="lg"
							className="text-center"
						>
							{t('Accede sin contraseña')}
						</Typography>

						<Typography className="text-center">
							{t(
								'Introduce tu email y te enviaremos un enlace mágico para iniciar sesión',
							)}
						</Typography>
						{/* <h2 className="text-xl font-bold text-center w-full">
							{t('Accede sin contraseña')}
						</h2> */}

						{/* <p className="text-sm text-gray-600 text-center mb-2">
							{t(
								'Introduce tu email y te enviaremos un enlace mágico para iniciar sesión',
							)}
						</p> */}

						<TextField
							className="w-full"
							label={t('Email *')}
							id="email"
							type="email"
							placeholder={t('Añade tu email')}
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

						<div className="flex w-full items-start">
							<div className="flex h-5 items-center">
								<input
									id="acceptedTerms"
									{...register('acceptedTerms', {
										required: t(
											'Debes aceptar los términos y la política de privacidad',
										),
									})}
									type="checkbox"
									className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
								/>
							</div>
							<div className="ml-3 text-sm">
								<label
									htmlFor="acceptedTerms"
									className="text-gray-600"
								>
									{t.rich('policyTerms', {
										terms: (chunks) => (
											<Link
												href="/legal/conditions"
												className="font-medium text-primary-600 hover:text-primary-500"
												target="_blank"
											>
												{chunks}
											</Link>
										),
										privacy: (chunks) => (
											<Link
												href="/legal/privacy"
												className="font-medium text-primary-600 hover:text-primary-500"
												target="_blank"
											>
												{chunks}
											</Link>
										),
									})}
								</label>
								{errors.acceptedTerms && (
									<p className="mt-1 text-xs text-red-600">
										{errors.acceptedTerms.message as string}
									</p>
								)}
							</div>
						</div>

						<Button
							label={
								loading
									? t('Enviando')
									: t('Enviar enlace mágico')
							}
							className="w-full"
							disabled={loading}
							type="submit"
							color="primary"
						/>
					</form>
				</div>
			)}
		</div>
	);
}
