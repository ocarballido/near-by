'use client';

import clsx from 'clsx';
import IconCheck from '../icon/check';

type BadgeCheckProps = {
	label: string;
	checked: boolean;
	onToggle: () => void;
};

const BadgeCheck = ({ label, checked, onToggle }: BadgeCheckProps) => {
	const badgeStyles = clsx(
		'rounded-sm inline-flex items-center gap-1 font-bold text-xs pl-2 pr-2 py-1 cursor-pointer select-none transition-colors min-h-[32px]',
		{
			'bg-secondary-200 text-secondary-900 hover:bg-secondary-300':
				!checked,

			'bg-success-200 text-success-900 hover:bg-success-300 pl-2 pr-3':
				checked,
		}
	);

	return (
		<div
			onClick={onToggle}
			className={badgeStyles}
			role="button"
			aria-pressed={checked}
		>
			{checked && <IconCheck color="primary" size={20} />}
			<span>{label}</span>
		</div>
	);
};

export default BadgeCheck;
