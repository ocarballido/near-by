'use client';

import clsx from 'clsx';
import IconCircle from '../icon/circle';
import IconCheckCircle from '../icon/check-circle';

type BadgeCheckProps = {
	label: string;
	className?: string;
	checkedColor?:
		| 'primary'
		| 'secondary'
		| 'success'
		| 'warning'
		| 'info'
		| 'error'
		| 'body'
		| 'light'
		| 'white'
		| undefined;
	checked: boolean;
	iconUnchecked?: React.ReactNode;
	iconChecked?: React.ReactNode;
	onToggle?: () => void;
};

const BadgeCheck = ({
	label,
	checked,
	className = '',
	onToggle,
	checkedColor = 'primary',
	iconUnchecked = <IconCircle color="light" size={20} />,
	iconChecked = (
		<IconCheckCircle
			color={
				checkedColor === 'body'
					? 'white'
					: checkedColor === 'white'
						? 'body'
						: checkedColor
			}
			size={20}
		/>
	),
}: BadgeCheckProps) => {
	const badgeStyles = clsx(
		`rounded-full inline-flex items-center gap-1 font-bold text-xs pl-1.5 pr-3 py-1 cursor-pointer select-none transition-colors min-h-[32px] ${className}`,
		{
			'bg-secondary-200 text-secondary-900 hover:bg-secondary-300':
				!checked,
		},
		{
			'bg-primary-100 text-primary-900 hover:bg-primary-200':
				checkedColor === 'primary' && checked,
		},
		{
			'bg-secondary-100 text-secondary-900 hover:bg-secondary-200':
				checkedColor === 'secondary' && checked,
		},
		{
			'bg-success-100 text-success-900 hover:bg-success-200':
				checkedColor === 'success' && checked,
		},
		{
			'bg-warning-100 text-warning-900 hover:bg-warning-200':
				checkedColor === 'warning' && checked,
		},
		{
			'bg-info-100 text-info-900 hover:bg-info-200':
				checkedColor === 'info' && checked,
		},
		{
			'bg-error-100 text-error-900 hover:bg-error-200':
				checkedColor === 'error' && checked,
		},
		{
			'bg-gray-800 text-gray-200 hover:bg-gray-950':
				checkedColor === 'body' && checked,
		},
		{
			'bg-gray-300 text-gray-900 hover:bg-gray-300':
				checkedColor === 'light' && checked,
		},
		{
			'bg-gray-100 text-gray-900 hover:bg-gray-300':
				checkedColor === 'white' && checked,
		},
	);

	return (
		<div
			onClick={onToggle}
			className={badgeStyles}
			role="button"
			aria-pressed={checked}
		>
			{checked ? (
				iconChecked
			) : (
				<div className="opacity-50">{iconUnchecked}</div>
			)}
			<span>{label}</span>
		</div>
	);
};

export default BadgeCheck;
