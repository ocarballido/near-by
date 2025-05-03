'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useGlobal } from '@/lib/context/GlobalContext';
import { useForm, SubmitHandler } from 'react-hook-form';

import { createSPASassClient } from '@/lib/supabase/client';

import TextField from '@/components/molecules/text-field';
import Alert from '../alert';
import Spinner from '@/components/atoms/spinner';
import Button from '@/components/molecules/button';

type FormValues = {
	newPassword: string;
	confirmPassword: string;
};

const WelcomeProfile = () => {
	const t = useTranslations();

	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const { user } = useGlobal();

	const {
		register,
		handleSubmit,
		watch,
		reset,
		formState: { errors },
	} = useForm<FormValues>({ mode: 'onTouched' });

	const handlePasswordChange: SubmitHandler<FormValues> = async ({
		newPassword,
		confirmPassword,
	}) => {
		setLoading(true);
		setError('');
		setSuccess(false);

		if (newPassword !== confirmPassword) {
			setError(t('Las contraseñas no coinciden'));
			return;
		}

		try {
			const supabase = await createSPASassClient();
			const client = supabase.getSupabaseClient();

			const { error } = await client.auth.updateUser({
				password: newPassword,
			});

			if (error) throw error;

			reset();

			setSuccess(true);
		} catch (err: Error | unknown) {
			if (err instanceof Error) {
				console.error('Error updating password:', err);
				setError(err.message);
			} else {
				console.error('Error updating password:', err);
				setError('Failed to update password');
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{loading && <Spinner />}
			{error && (
				<Alert
					message={error}
					type="error"
					dismissible
					open={error !== ''}
					title={t('Error al enviar')}
				/>
			)}
			{success && (
				<Alert
					message={t('La contraseña se ha actualizado correctamente')}
					type="success"
					dismissible
					open={success}
					title={t('Actualizada')}
				/>
			)}
			<div className="flex flex-col gap-0 w-full max-w-[360px]">
				<h1 className="font-heading font-bold text-lg mb-2 text-primary-500">
					{t('Datos personales')}
				</h1>
				<h2 className="font-bold text-sm mb-2">Email</h2>
				<p className="bg-primary-100 text-primary-700 py-1 px-3 text-sm rounded-md w-fit font-medium">
					{loading ? '...' : user?.email}
				</p>
			</div>
			<div className="flex flex-col gap-0 w-full max-w-[360px]">
				<h2 className="font-heading font-bold text-lg mb-2 text-primary-500">
					{t('Cambiar contraseña')}
				</h2>

				<form
					onSubmit={handleSubmit(handlePasswordChange)}
					noValidate
					className="flex flex-col gap-4"
				>
					<div className="flex flex-col gap-4">
						<TextField
							label={t('Nueva contraseña')}
							type="password"
							className="w-full"
							id="new-password"
							error={Boolean(errors.newPassword)}
							helperText={
								errors.newPassword?.message ||
								t(
									'La contraseña debe ser al menos de 6 caracteres'
								)
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
							label={t('Confirmar contraseña')}
							type="password"
							className="w-full"
							id="confirm-password"
							error={Boolean(errors.confirmPassword)}
							helperText={errors.confirmPassword?.message}
							{...register('confirmPassword', {
								required: t(
									'Por favor, confirma la contraseña'
								),
								validate: (val) =>
									val === watch('newPassword') ||
									t('Las contraseñas no coinciden'),
							})}
						/>
					</div>
					<Button
						type="submit"
						disabled={loading}
						label={t('Actualizar contraseña')}
						className="w-full"
					/>
				</form>
			</div>
		</>
	);
};

export default WelcomeProfile;
