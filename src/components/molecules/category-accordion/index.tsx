import clsx from 'clsx';

import CategoryButton from '../caterory-button';
import CategoryBody from '../category-body';

type CategoryAccordionProps = {
	children: React.ReactNode;
	icon: React.ReactNode;
	name: string;
	open: boolean;
	hasContent?: boolean;
	href?: string;
	onClick?: () => void;
};

const CategoryAccordion = ({
	children,
	icon,
	name,
	open,
	hasContent,
	onClick,
}: CategoryAccordionProps) => {
	const buttonStyles = clsx(
		{
			'bg-white shadow-xs': open,
		},
		{ 'hover:bg-white hover:shadow-xs hover:cursor-pointer': !open },
	);

	return (
		<div
			className={`rounded-xl w-full flex flex-col items-center disabled:pointer-events-none font-medium p-2 transition-all ${buttonStyles}`}
		>
			<CategoryButton
				name={name}
				icon={icon}
				open={open}
				hasContent={hasContent}
				onClick={onClick}
			/>
			<CategoryBody open={open}>{children}</CategoryBody>
		</div>
	);
};

export default CategoryAccordion;
