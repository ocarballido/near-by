import clsx from 'clsx';

import { usePathname } from '@/i18n/routing';

import Link from 'next/link';
import { ReactNode } from 'react';

type SidebarMenuItemProps = {
	active?: boolean;
	label: string;
	icon?: ReactNode;
	href: string;
};

const SidebarMenuItem = ({
	// active = false,
	label,
	icon,
	href,
}: SidebarMenuItemProps) => {
	const pathname = usePathname();

	const buttonStyles = clsx({
		'bg-secondary-200 text-gray-950': href === pathname,
	});

	return (
		<Link
			className={`rounded-md w-full transition-all flex items-center gap-2 hover:bg-secondary-200 hover:cursor-pointer disabled:pointer-events-none font-medium text-sm text-md py-4 px-3.5 ${buttonStyles}`}
			href={href}
		>
			{icon}
			{label}
		</Link>
	);
};

export default SidebarMenuItem;
