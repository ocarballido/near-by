'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import { createSPASassClient } from '@/lib/supabase/client';

import Image from 'next/image';
import Button from '@/components/molecules/button';
import TextField from '@/components/molecules/text-field';
import ButtonLink from '@/components/molecules/button-link';
import Alert from '@/components/molecules/alert';
import Spinner from '@/components/atoms/spinner';

type FormValues = {
	email: string;
};

export default function VerifyEmailPage() {
	const t = useTranslations();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>();

	const onSubmit: SubmitHandler<FormValues> = async ({ email }) => {
		try {
			const supabase = await createSPASassClient();
			const { error } = await supabase.resendVerificationEmail(email);

			if (error) {
				setError(error.message);
				return;
			}
			setSuccess(true);
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

	return (
		<div className="relative max-w-96 w-full">
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
					{t('Verifica tu email')}
				</h2>

				<p className="text-gray-600">
					{t('Email de verificación enviado')}
				</p>

				<p className="text-gray-600">{t('¿No recibiste el correo?')}</p>

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
							loading ? t('Enviando') : t('Reenviar verificación')
						}
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
		</div>
	);
}

// 'use client';

// import { useState } from 'react';
// import { createSPASassClient } from '@/lib/supabase/client';
// import EmailActionsForm from '@/components/organisms/form/email-actions';
// import Spinner from '@/components/atoms/spinner';

// export default function VerifyEmailPage() {
// 	const [error, setError] = useState<string>();
// 	const [loading, setLoading] = useState(false);
// 	const [success, setSuccess] = useState(false);

// 	const handleFormAction = async (formData: FormData) => {
// 		const email = formData.get('email') as string;
// 		if (!email) {
// 			setError('Please enter your email address');
// 			return;
// 		}

// 		setLoading(true);
// 		setError(undefined);

// 		try {
// 			const client = await createSPASassClient();
// 			const { error: resendError } = await client.resendVerificationEmail(
// 				email
// 			);
// 			if (resendError) throw resendError;
// 			setSuccess(true);
// 		} catch (err) {
// 			if (err instanceof Error) setError(err.message);
// 			else setError('An unknown error occurred');
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	return (
// 		<div className="relative max-w-96 w-full">
// 			{loading && <Spinner position="absolute" />}

// 			<EmailActionsForm
// 				formAction={handleFormAction}
// 				loading={loading}
// 				error={error}
// 				success={success}
// 				type="EMAIL_VERIFICATION"
// 			/>
// 		</div>
// 	);
// }
