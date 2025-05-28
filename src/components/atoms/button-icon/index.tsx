'use client';

import clsx from 'clsx';

import styles from './styles.module.css';

type ButtonIconProps = {
	active?: boolean;
	className?: string;
	color?: 'primary' | 'secondary' | 'error' | 'white' | 'warning';
	disabled?: boolean;
	icon: React.ReactNode;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	size?: 'small' | 'medium';
	type?: 'submit' | 'reset' | 'button';
};

const ButtonIcon = ({
	active = false,
	className = '',
	color = 'primary',
	disabled = false,
	icon,
	onClick,
	size = 'medium',
	type = 'button',
}: ButtonIconProps) => {
	const buttonStyles = clsx(
		{
			[styles['icon--primary']]: color === 'primary',
			[styles['icon--secondary']]: color === 'secondary',
			[styles['icon--error']]: color === 'error',
			[styles['icon--white']]: color === 'white',
			[styles['icon--warning']]: color === 'warning',
		},
		{
			'p-2': size === 'medium',
		},
		{
			'p-1': size === 'small',
		},
		{
			'hover:bg-primary-100 focus:bg-primary-100': color === 'primary',
		},
		{
			'bg-primary-100': color === 'primary' && active,
		},
		{
			'hover:bg-warning-100 focus:bg-warning-100': color === 'warning',
		},
		{
			'bg-warning-100': color === 'warning' && active,
		},
		{
			'hover:bg-black/10 focus:bg-black/10': color === 'secondary',
		},
		{
			'bg-black/10': color === 'secondary' && active,
		},
		{
			'hover:bg-error-100 focus:bg-secondary-50': color === 'error',
		},
		{
			'bg-error-100': color === 'error' && active,
		},
		{
			'hover:bg-black/20': color === 'white' && !active,
		},
		{
			'bg-black/20': color === 'white' && active,
		}
	);

	return (
		<button
			className={`rounded-full transition-all flex items-center justify-center hover:cursor-pointer disabled:opacity-30 disabled:pointer-events-none ${buttonStyles} ${className}`}
			onClick={onClick}
			type={type}
			disabled={disabled}
		>
			{icon}
		</button>
	);
};

export default ButtonIcon;
