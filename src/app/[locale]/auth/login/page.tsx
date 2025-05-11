// src/app/auth/login/page.tsx
'use client';

import { createSPASassClient } from '@/lib/supabase/client';
// import { AuthChangeEvent, Session } from '@supabase/supabase-js';

import { useForm, SubmitHandler } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Link from 'next/link';
import TextField from '@/components/molecules/text-field';
import Spinner from '@/components/atoms/spinner';
import Alert from '@/components/molecules/alert';
import Button from '@/components/molecules/button';
import ButtonLink from '@/components/molecules/button-link';

type FormValues = {
	email: string;
	password: string;
};

export default function LoginPage() {
	const t = useTranslations();

	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [showMFAPrompt, setShowMFAPrompt] = useState(false);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({
		mode: 'onTouched',
	});

	const onSubmit: SubmitHandler<FormValues> = async ({ email, password }) => {
		setError('');
		setLoading(true);

		try {
			const client = await createSPASassClient();
			const { error: signInError } = await client.loginEmail(
				email,
				password
			);

			if (signInError) throw signInError;

			const supabase = client.getSupabaseClient();
			const { data: mfaData, error: mfaError } =
				await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

			console.log('🔐 MFA data:', mfaData);
			console.log('❌ MFA error:', mfaError);

			if (mfaError) throw mfaError;

			if (
				mfaData?.nextLevel === 'aal2' &&
				mfaData?.nextLevel !== mfaData?.currentLevel
			) {
				setShowMFAPrompt(true);
			} else {
				console.log('➡️ Redirigiendo a /app (no se requiere MFA)');
				router.push('/app');
			}
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

	useEffect(() => {
		if (showMFAPrompt) {
			router.push('/auth/2fa');
		}
	}, [showMFAPrompt, router]);

	useEffect(() => {
		if (!loading && !error) {
			router.push('/app');
		}
	}, [loading, error, router]);

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

				<TextField
					className="w-full"
					type="password"
					label={t('Contraseña *')}
					autoComplete="current-password"
					id="password"
					placeholder={t('Añade una contraseña segura')}
					error={Boolean(errors.password)}
					helperText={errors.password?.message as string}
					{...register('password', {
						required: t('La contraseña es obligatoria'),
					})}
				/>

				<Link
					href="/auth/forgot-password"
					className="font-medium text-primary-600 hover:text-primary-500"
				>
					{t('Has olvidado tu contraseña')}
				</Link>

				<Button
					label={loading ? 'Signing in...' : t('Iniciar sesión')}
					className="w-full"
					disabled={loading}
					type="submit"
					color="primary"
				/>

				<div className="p-1.5 rounded-3xl bg-primary-200 w-full">
					<p className="text-primary-800 pt-0.5 font-bold text-sm text-center mb-2">
						{t('No tengo una cuenta')}
					</p>
					<ButtonLink
						label={t('Registrarme')}
						href="/auth/register"
						color="white"
						className="hover:bg-primary-500 hover:text-white"
					/>
				</div>
			</form>
		</div>
	);
}
