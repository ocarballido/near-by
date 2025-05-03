import clsx from 'clsx';

import styles from './styles.module.css';

type DropdownItemButtonProps = {
	active?: boolean;
	className?: string;
	icon?: React.ReactNode;
	label: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	disabled?: boolean;
	form?: string;
	formAction?: (formData: FormData) => Promise<void>;
	iconLeft?: React.ReactNode;
	iconRight?: React.ReactNode;
	type?: 'submit' | 'reset' | 'button';
};

const DropdownItemButton = ({
	active = false,
	className,
	icon,
	label,
	onClick,
	disabled = false,
	form,
	formAction,
	type = 'button',
}: DropdownItemButtonProps) => {
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
		<button
			className={`rounded-sm min-w-max transition-all flex items-center gap-2 hover:bg-primary-50 hover:text-primary-500 hover:cursor-pointer font-medium text-sm py-2 px-3 disabled:opacity-30 disabled:pointer-events-none ${buttonStyles} ${className}`}
			onClick={onClick}
			type={type}
			form={form}
			formAction={formAction}
			disabled={disabled}
		>
			{icon}
			{label}
		</button>
	);
};

export default DropdownItemButton;
