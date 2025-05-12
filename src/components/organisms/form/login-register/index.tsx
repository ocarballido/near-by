'use client';

import { useForm, SubmitHandler, useWatch } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import TextField from '@/components/molecules/text-field';
import Button from '@/components/molecules/button';
import ButtonLink from '@/components/molecules/button-link';
import Link from 'next/link';

type FormProps = {
	type: 'login' | 'register';
	formAction?: (formData: FormData) => Promise<void>;
};

type FormInputs = {
	// name?: string;
	email: string;
	password: string;
	confirmPassword?: string;
	acceptedTerms?: boolean;
};

const LoginRegisterForm = ({ formAction, type = 'login' }: FormProps) => {
	const t = useTranslations();

	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
	} = useForm<FormInputs>();

	const passwordValue = useWatch({ control, name: 'password' });

	const onSubmit: SubmitHandler<FormInputs> = async (data) => {
		const formData = new FormData();
		Object.entries(data).forEach(([key, value]) => {
			// checkbox unchecked => undefined, so coerce to ''
			formData.append(key, value === true ? 'on' : value || '');
		});
		if (formAction) {
			await formAction(formData);
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col items-center gap-4 max-w-96 w-full"
		>
			<TextField
				className="w-full"
				label={t('Email *')}
				id="email"
				placeholder={t('Añade tu email')}
				error={Boolean(errors.email)}
				helperText={errors.email?.message as string}
				{...register('email', {
					required: t('Debes añadir Email'),
				})}
			/>

			<TextField
				className="w-full"
				type="password"
				label={t('Contraseña *')}
				id="password"
				placeholder={t('Añade una contraseña segura')}
				error={Boolean(errors.password)}
				helperText={errors.password?.message as string}
				{...register('password', {
					required: t('La contraseña es obligatoria'),
				})}
			/>

			{type === 'register' && (
				<>
					{/* <TextField
						className="w-full"
						label={t('Nombre y Apellido *')}
						id="name"
						placeholder={t('Añade tu nombre completo')}
						error={Boolean(errors.name)}
						helperText={errors.name?.message as string}
						{...register('name', {
							required: t('Debes añadir un nombre'),
						})}
					/> */}

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
							validate: (val) =>
								val === passwordValue ||
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
				</>
			)}

			{type === 'login' && (
				<Link
					href="/auth/forgot-password"
					className="font-medium text-primary-600 hover:text-primary-500"
				>
					{t('Has olvidado tu contraseña')}
				</Link>
			)}

			<Button
				label={
					type === 'login' ? t('Iniciar sesión') : t('Registrarme')
				}
				className="w-full"
				type="submit"
				color="primary"
			/>

			<div className="p-1.5 rounded-3xl bg-primary-200 w-full">
				<p className="text-primary-800 pt-0.5 font-bold text-sm text-center mb-2">
					{type === 'login'
						? t('No tengo una cuenta')
						: t('Ya tengo una cuenta')}
				</p>
				<ButtonLink
					label={
						type === 'login'
							? t('Registrarme')
							: t('Iniciar sesión')
					}
					href={type === 'login' ? '/auth/register' : '/auth/login'}
					color="white"
					className="hover:bg-primary-500 hover:text-white"
				/>
			</div>
		</form>
	);
};

export default LoginRegisterForm;
