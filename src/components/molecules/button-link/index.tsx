'use client';

import clsx from 'clsx';

import Link from 'next/link';

import styles from './styles.module.css';

type ButtonLinkProps = {
	active?: boolean;
	className?: string;
	color?: 'primary' | 'secondary' | 'error' | 'white';
	target?: '_blank' | '_self' | '_parent' | '_top';
	href: string;
	iconLeft?: React.ReactNode;
	iconRight?: React.ReactNode;
	label: string;
};

const ButtonLink = ({
	active = false,
	className = '',
	color = 'primary',
	href,
	iconLeft,
	iconRight,
	label,
	target = '_self',
}: ButtonLinkProps) => {
	const buttonLinkStyles = clsx(
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
			'bg-white hover:bg-gray-200 text-primary-500':
				color === 'white' && !active,
		},
		{
			'bg-gray-200 hover:bg-gray-200 text-primary-500':
				color === 'white' && active,
		}
	);

	return (
		<Link
			className={`font-medium text-base rounded-full transition-all flex items-center justify-center gap-1 py-2 px-5 hover:cursor-pointer disabled:opacity-30 disabled:pointer-events-none ${buttonLinkStyles} ${className}`}
			href={href}
			target={target}
		>
			{iconLeft}

			{label}

			{iconRight}
		</Link>
	);
};

export default ButtonLink;
