import clsx from 'clsx';

import Link from 'next/link';

import ButtonIcon from '@/components/atoms/button-icon';
import IconKeyboardArrowDown from '@/components/atoms/icon/keyboard-arrow-down';

type CategoryButtonProps = {
	open?: boolean;
	icon: React.ReactNode;
	name: string;
	href: string;
	// onClick?: React.MouseEventHandler<HTMLDivElement>;
};

const CategoryButton = ({
	open = false,
	icon,
	name,
	// onClick,
	href,
}: CategoryButtonProps) => {
	const buttonStyles = clsx({
		'font-bold': open,
	});

	const arrowStyles = clsx({
		'rotate-180': open,
	});

	return (
		<Link
			// onClick={onClick}
			href={href}
			className={`flex w-full items-center ${buttonStyles}`}
		>
			<div className="flex items-center justify-center gap-2 mr-auto py-2">
				<ButtonIcon
					className="pointer-events-none"
					color="primary"
					icon={icon}
					active={open}
				/>
				{name}
			</div>
			<div className={`transition-all ${arrowStyles}`}>
				<IconKeyboardArrowDown />
			</div>
		</Link>
	);
};

export default CategoryButton;
