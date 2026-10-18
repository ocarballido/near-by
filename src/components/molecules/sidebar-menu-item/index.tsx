import clsx from 'clsx';

import { usePathname } from '@/i18n/routing';

import Link from 'next/link';
import { ReactNode } from 'react';

import styles from './styles.module.css';

type SidebarMenuItemProps = {
	active?: boolean;
	label: string;
	icon?: ReactNode;
	// Sin href se pinta como <span>: lo usa quien ya pone el elemento
	// interactivo alrededor (p. ej. CreatePropertyEntry con paywall)
	href?: string;
};

const SidebarMenuItem = ({
	// active = false,
	label,
	icon,
	href,
}: SidebarMenuItemProps) => {
	const pathname = usePathname();

	const isActive = href !== undefined && href === pathname;

	// Mismo aspecto que CategoryButton (sidebar de propiedad), sin flecha
	const iconStyles = clsx(
		'flex shrink-0 items-center justify-center p-2 rounded-full transition-all',
		isActive ? `bg-white ${styles['icon--primary']}` : styles['icon--light'],
	);

	const labelStyles = clsx(
		'flex-1 min-w-0 text-sm leading-4 font-medium transition-colors',
		isActive
			? 'text-secondary-800'
			: 'text-secondary-600 group-hover:text-secondary-800',
	);

	const content = (
		<>
			{icon && <span className={iconStyles}>{icon}</span>}
			<span className={labelStyles}>{label}</span>
		</>
	);

	if (href === undefined) {
		return (
			<span
				className={`group flex w-full items-center gap-2 py-1 rounded-lg cursor-pointer ${styles['menu-item']}`}
			>
				{content}
			</span>
		);
	}

	return (
		<Link
			className={`group flex w-full items-center gap-2 py-1 rounded-lg cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${styles['menu-item']}`}
			href={href}
			aria-current={isActive ? 'page' : undefined}
		>
			{content}
		</Link>
	);
};

export default SidebarMenuItem;
