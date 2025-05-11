'use client';

import clsx from 'clsx';

import styles from './styles.module.css';

type ButtonProps = {
	active?: boolean;
	className?: string;
	color?: 'primary' | 'secondary' | 'error' | 'white';
	disabled?: boolean;
	form?: string;
	formAction?: (formData: FormData) => Promise<void>;
	iconLeft?: React.ReactNode;
	iconRight?: React.ReactNode;
	label: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	type?: 'submit' | 'reset' | 'button';
};

const Button = ({
	active = false,
	className = '',
	color = 'primary',
	disabled = false,
	form,
	formAction,
	iconLeft,
	iconRight,
	label,
	onClick,
	type = 'button',
}: ButtonProps) => {
	const buttonStyles = clsx(
		{
			[styles['icon--primary']]:
				(iconLeft || iconRight) && color === 'white',
			[styles['icon--secondary']]:
				(iconLeft || iconRight) && color === 'secondary',
			[styles['icon--white']]:
				((iconLeft || iconRight) && color === 'primary') ||
				color === 'error',
		},
		{ 'pl-4': iconLeft },
		{ 'pr-4': iconRight },
		{
			'bg-primary-500 hover:bg-primary-600 focus:bg-primary-600 text-white':
				color === 'primary',
		},
		{
			'bg-primary-600': color === 'primary' && active,
		},
		{
			'bg-secondary-200 hover:bg-secondary-300 focus:bg-secondary-300 text-gray-800':
				color === 'secondary',
		},
		{
			'bg-secondary-300': color === 'secondary' && active,
		},
		{
			'bg-error-500 hover:bg-error-600 focus:bg-secondary-300 text-white':
				color === 'error',
		},
		{
			'bg-error-600': color === 'error' && active,
		},
		{
			'bg-white hover:bg-primary-100 text-primary-500':
				color === 'white' && !active,
		},
		{
			'bg-primary-100 hover:bg-primary-100 text-primary-500':
				color === 'white' && active,
		}
	);

	return (
		<button
			className={`font-medium text-base rounded-full transition-all flex items-center justify-center gap-1 py-2 px-5 hover:cursor-pointer disabled:opacity-30 disabled:pointer-events-none ${buttonStyles} ${className}`}
			onClick={onClick}
			type={type}
			form={form}
			formAction={formAction}
			disabled={disabled}
		>
			{iconLeft}

			{label}

			{iconRight}
		</button>
	);
};

export default Button;
