'use client';

import { useForm, SubmitHandler, useWatch } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import TextField from '@/components/molecules/text-field';
import Button from '@/components/molecules/button';
import Alert from '@/components/molecules/alert';

type ResetPasswordFormProps = {
	formAction: (formData: FormData) => Promise<void>;
	loading: boolean;
	error?: string;
};

type FormInputs = {
	newPassword: string;
	confirmPassword: string;
};

export default function ResetPasswordForm({
	formAction,
	loading,
	error,
}: ResetPasswordFormProps) {
	const t = useTranslations();

	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
	} = useForm<FormInputs>();

	const newPasswordValue = useWatch({ control, name: 'newPassword' });

	const onSubmit: SubmitHandler<FormInputs> = async (data) => {
		const formData = new FormData();
		formData.append('newPassword', data.newPassword);
		formData.append('confirmPassword', data.confirmPassword);
		await formAction(formData);
	};

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

			<h2 className="text-2xl font-bold text-gray-900 mb-2">
				{t('Restablecer su contraseña')}
			</h2>

			<form
				onSubmit={handleSubmit(onSubmit)}
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
							val === newPasswordValue ||
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
