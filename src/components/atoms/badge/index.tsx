import clsx from 'clsx';

type BadgeProps = {
	label: string;
	color?: 'secondary' | 'success' | 'error';
	onClick?: () => void;
};

const Badge = ({ color = 'secondary', label, onClick }: BadgeProps) => {
	const badgeStyles = clsx(
		{
			'bg-secondary-200 text-secondary-900': color === 'secondary',
		},
		{
			'bg-success-200 text-success-900': color === 'success',
		},
		{ 'bg-error-200 text-error-900': color === 'error' }
	);

	return (
		<div
			onClick={onClick}
			className={`rounded-sm inline-block font-bold text-xs px-2 py-1 ${badgeStyles}`}
		>
			{label}
		</div>
	);
};

export default Badge;
