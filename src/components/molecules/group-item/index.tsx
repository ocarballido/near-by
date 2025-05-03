'use client';

import clsx from 'clsx';

import IconEdit from '@/components/atoms/icon/edit';
import IconDelete from '@/components/atoms/icon/delete';
import ButtonIcon from '@/components/atoms/button-icon';

type GroupItemProps = {
	active?: boolean;
	deleatable?: boolean;
	editeable?: boolean;
	label: string;
	onClick?: React.MouseEventHandler<HTMLDivElement>;
};

const GroupItem = ({
	active = false,
	deleatable = false,
	editeable = false,
	label,
	onClick,
}: GroupItemProps) => {
	const buttonStyles = clsx({
		'bg-secondary-200': active,
	});

	return (
		<div
			className={`rounded-md w-full transition-all flex items-center justify-between hover:bg-secondary-200 hover:cursor-pointer disabled:pointer-events-none font-medium py-2 px-4 min-h-14 ${buttonStyles}`}
			onClick={onClick}
		>
			{label}
			<div className="flex items-center justify-center">
				{deleatable && (
					<ButtonIcon color="secondary" icon={<IconDelete />} />
				)}
				{editeable && (
					<ButtonIcon color="secondary" icon={<IconEdit />} />
				)}
			</div>
		</div>
	);
};

export default GroupItem;
