import Link from 'next/link';

import clsx from 'clsx';

import styles from './styles.module.css';

type DropdownItemProps = {
	active?: boolean;
	className?: string;
	icon?: React.ReactNode;
	label: string;
	href: string;
};

const DropdownItem = ({
	active = false,
	className,
	icon,
	label,
	href,
}: DropdownItemProps) => {
	const buttonStyles = clsx(
		{
			[styles.link]: true,
			[styles['link--primary']]: active,
		},
		{
			'bg-primary-50 text-primary-500': active,
		}
	);

	return (
		<Link
			className={`rounded-sm min-w-max transition-all flex items-center gap-2 hover:bg-primary-50 hover:text-primary-500 hover:cursor-pointer font-medium font-sm py-2 px-3 ${buttonStyles} ${className}`}
			href={href}
		>
			{icon}
			{label}
		</Link>
	);
};

export default DropdownItem;
