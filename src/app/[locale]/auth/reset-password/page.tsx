'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm, SubmitHandler } from 'react-hook-form';

import { createSPASassClient } from '@/lib/supabase/client';

import Alert from '@/components/molecules/alert';
import Spinner from '@/components/atoms/spinner';
import TextField from '@/components/molecules/text-field';
import Button from '@/components/molecules/button';
import ButtonLink from '@/components/molecules/button-link';

type FormValues = {
	newPassword: string;
	confirmPassword: string;
};

export default function ResetPasswordPage() {
	const t = useTranslations();

	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<FormValues>({ mode: 'onTouched' });

	const onSubmit: SubmitHandler<FormValues> = async ({
		newPassword,
		confirmPassword,
	}) => {
		setError('');

		if (newPassword !== confirmPassword) {
			setError("Passwords don't match");
			return;
		}

		if (newPassword.length < 6) {
			setError('Password must be at least 6 characters long');
			return;
		}

		setLoading(true);

		try {
			const supabase = await createSPASassClient();
			const { error } = await supabase
				.getSupabaseClient()
				.auth.updateUser({
					password: newPassword,
				});

			if (error) throw error;

			setSuccess(true);
			setTimeout(() => {
				router.push('/app');
			}, 3000);
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError('Failed to reset password');
			}
		} finally {
			setLoading(false);
		}
	};

	// Check if we have a valid recovery session
	useEffect(() => {
		const checkSession = async () => {
			try {
				const supabase = await createSPASassClient();
				const {
					data: { user },
					error,
				} = await supabase.getSupabaseClient().auth.getUser();

				if (error || !user) {
					setError(
						'Invalid or expired reset link. Please request a new password reset.'
					);
				}
			} catch {
				setError('Failed to verify reset session');
			}
		};

		checkSession();
	}, []);

	if (success) {
		return (
			<div className="flex flex-col items-center gap-4 max-w-96 w-full">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						{t('Restablecimiento de contraseña exitoso')}
					</h2>
					<p className="text-gray-600 mb-8">
						{t('Tu contraseña se ha restablecido correctamente')}
					</p>
					<ButtonLink
						href="/app"
						label={t('Ir a la aplicación')}
						color="primary"
						className="mt-4"
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center gap-4 max-w-96 w-full">
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

			<h2 className="text-2xl font-bold text-gray-900 mb-2">
				{t('Restablecer su contraseña')}
			</h2>

			<form
				onSubmit={handleSubmit(onSubmit)}
				noValidate
				className="space-y-4 w-full"
			>
				<TextField
					className="w-full"
					type="password"
					label={t('Nueva contraseña')}
					id="new-password"
					placeholder={t('Inserta la nueva contraseña')}
					error={Boolean(errors.newPassword)}
					helperText={
						errors.newPassword?.message ||
						t('La contraseña debe ser al menos de 6 caracteres')
					}
					{...register('newPassword', {
						required: t('La contraseña es requerida'),
						minLength: {
							value: 6,
							message: t(
								'La contraseña debe ser al menos de 6 caracteres'
							),
						},
					})}
				/>

				<TextField
					className="w-full"
					type="password"
					label={t('Confirmar contraseña')}
					id="confirm-password"
					placeholder={t('Reintroduce la contraseña')}
					error={Boolean(errors.confirmPassword)}
					helperText={errors.confirmPassword?.message}
					{...register('confirmPassword', {
						required: t('Por favor, confirma la contraseña'),
						validate: (val) =>
							val === watch('newPassword') ||
							t('Las contraseñas no coinciden'),
					})}
				/>

				<Button
					className="w-full"
					type="submit"
					color="primary"
					label={loading ? t('Reseteando') : t('Resetear contraseña')}
					disabled={loading}
				/>
			</form>
		</div>
	);
}
