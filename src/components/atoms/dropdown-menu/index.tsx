import clsx from 'clsx';

type DropdownMenuProps = {
	className?: string;
	children: React.ReactNode;
	open: boolean;
};

const DropdownMenu = ({
	className = '',
	children,
	open = false,
}: DropdownMenuProps) => {
	const dropdownMenuStyles = clsx(
		{
			flex: open,
		},
		{
			hidden: !open,
		},
		className
	);

	return (
		<div
			className={`flex-col gap-2 p-2 bg-white rounded-2xl shadow-xl z-10 ${dropdownMenuStyles}`}
		>
			{children}
		</div>
	);
};

export default DropdownMenu;
