'use client';
import { useTranslations } from 'next-intl';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
// Eliminamos useRouter si no lo vamos a usar
// import { useRouter } from 'next/navigation';

import { createSPASassClient } from '@/lib/supabase/client';

import Link from 'next/link';
import TextField from '@/components/molecules/text-field';
import Button from '@/components/molecules/button';
import ButtonLink from '@/components/molecules/button-link';
import Alert from '@/components/molecules/alert';
import Spinner from '@/components/atoms/spinner';
import IconCheckCircle from '@/components/atoms/icon/check-circle';

type MagicLinkFormInputs = {
	email: string;
	acceptedTerms: boolean;
};

export default function MagicLinkPage() {
	const t = useTranslations();

	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [emailSent, setEmailSent] = useState(false);
	const [userEmail, setUserEmail] = useState('');
	// Eliminamos la declaración del router si no lo vamos a usar
	// const router = useRouter();

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
			setError('You must accept the Terms of Service and Privacy Policy');
			return;
		}

		setLoading(true);

		try {
			const supabase = await createSPASassClient();
			const { error } = await supabase.signInWithMagicLink(email);

			if (error) throw error;

			setUserEmail(email);
			setEmailSent(true);
		} catch (err: Error | unknown) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError('An unknown error occurred');
			}
		} finally {
			setLoading(false);
		}
	};

	// Contenido cuando el email ha sido enviado
	if (emailSent) {
		return (
			<div className="relative max-w-96 w-full text-center font-body">
				<div className="rounded-lg p-6 mb-6">
					<p className="flex  justify-center">
						<IconCheckCircle color="success" size={48} />
					</p>

					<h2 className="text-xl font-heading font-bold text-green-700 mb-4">
						{t('¡Enlace enviado!')}
					</h2>

					<p className="mb-1">
						{t('Hemos enviado un enlace mágico a')}
					</p>

					<p className="text-sm text-gray-600 mb-6">{userEmail}</p>

					<div className="mb-6">
						<p>
							{t(
								'Revisa tu bandeja de entrada y haz clic en el enlace para iniciar sesión'
							)}
						</p>
						<p className="mt-2 font-medium">
							{t('El enlace expirará en 24 horas')}
						</p>
					</div>

					<div className="mb-6">
						<h3 className="font-medium text-gray-700 mb-2">
							{t('¿No has recibido el enlace?')}
						</h3>
						<p className="text-sm text-gray-600">
							{t(
								'Verifica tu carpeta de spam o correo no deseado'
							)}
						</p>
						<p className="text-sm text-gray-600">
							{t(
								'Asegúrate de que la dirección de correo sea correcta'
							)}
						</p>
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
		);
	}

	// Formulario para solicitar el Magic Link
	return (
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
				<h2 className="text-xl font-bold text-center w-full">
					{t('Accede sin contraseña')}
				</h2>

				<p className="text-sm text-gray-600 text-center mb-2">
					{t(
						'Introduce tu email y te enviaremos un enlace mágico para iniciar sesión'
					)}
				</p>

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
									'Debes aceptar los términos y la política de privacidad'
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
										href="/legal/terms"
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
					label={loading ? t('Enviando') : t('Enviar enlace mágico')}
					className="w-full"
					disabled={loading}
					type="submit"
					color="primary"
				/>
			</form>
		</div>
	);
}
