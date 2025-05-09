'use client';

import { useTranslations } from 'next-intl';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { createSPASassClient } from '@/lib/supabase/client';

import Link from 'next/link';
import TextField from '@/components/molecules/text-field';
import Button from '@/components/molecules/button';
import ButtonLink from '@/components/molecules/button-link';
import Alert from '@/components/molecules/alert';
import Spinner from '@/components/atoms/spinner';

type RegisterFormInputs = {
	email: string;
	password: string;
	confirmPassword: string;
	acceptedTerms: boolean;
};

export default function RegisterPage() {
	const t = useTranslations();

	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<RegisterFormInputs>({
		mode: 'onTouched',
	});

	const onSubmit: SubmitHandler<RegisterFormInputs> = async ({
		email,
		password,
		confirmPassword,
		acceptedTerms,
	}) => {
		setError('');

		if (!acceptedTerms) {
			setError('You must accept the Terms of Service and Privacy Policy');
			return;
		}

		if (password !== confirmPassword) {
			setError("Passwords don't match");
			return;
		}

		setLoading(true);

		try {
			const supabase = await createSPASassClient();
			const { error } = await supabase.registerEmail(email, password);

			if (error) throw error;

			router.push('/auth/verify-email');
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

				<TextField
					className="w-full"
					type="password"
					label={t('Confirmar contraseña *')}
					id="confirmPassword"
					placeholder={t('Repite tu contraseña')}
					error={Boolean(errors.confirmPassword)}
					helperText={errors.confirmPassword?.message as string}
					{...register('confirmPassword', {
						required: t('Debes confirmar tu contraseña'),
						validate: (value) =>
							value === watch('password') ||
							t('Las contraseñas no coinciden'),
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
					label={loading ? 'Signing in...' : t('Registrarme')}
					className="w-full"
					disabled={loading}
					type="submit"
					color="primary"
				/>

				<div className="p-1.5 rounded-3xl bg-primary-200 w-full">
					<p className="text-primary-800 pt-0.5 font-bold text-sm text-center mb-2">
						{t('Ya tengo una cuenta')}
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
