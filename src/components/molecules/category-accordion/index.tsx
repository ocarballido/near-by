import clsx from 'clsx';

import CategoryButton from '../caterory-button';
// import CategoryButtonLink from '../category-button-link';
import CategoryBody from '../category-body';

type CategoryAccordionProps = {
	children: React.ReactNode;
	icon: React.ReactNode;
	name: string;
	open: boolean;
	href?: string;
	onClick?: () => void;
};

const CategoryAccordion = ({
	children,
	icon,
	name,
	open,
	onClick,
}: CategoryAccordionProps) => {
	const buttonStyles = clsx(
		{
			'bg-gray-50 shadow-sm': open,
		},
		{ 'hover:bg-gray-50 hover:shadow-sm hover:cursor-pointer': !open }
	);

	return (
		<div
			className={`rounded-xl w-full flex flex-col items-center disabled:pointer-events-none font-medium py-2 pl-2 pr-2 ${buttonStyles}`}
		>
			<CategoryButton
				name={name}
				icon={icon}
				open={open}
				onClick={onClick}
			/>
			<CategoryBody open={open}>{children}</CategoryBody>
		</div>
	);
};

export default CategoryAccordion;
