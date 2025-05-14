'use client';

import clsx from 'clsx';

import { useTranslations } from 'next-intl';

import ButtonIcon from '@/components/atoms/button-icon';
import IconKeyboardArrowDown from '@/components/atoms/icon/keyboard-arrow-down';
import GroupItem from '../group-item';

export type CategoryNames =
	| 'El Alojamiento'
	| 'Salud y Bienestar'
	| 'Comida y Bebida'
	| 'Arte y Cultura'
	| 'Parques y Naturaleza'
	| 'Compras'
	| 'Servicios'
	| 'Transporte'
	| 'Entretenimiento y Vida Nocturna'
	| 'Atracciones y Turismo'
	| 'Seguridad y Emergencias'
	| 'Familia y Niños'
	| 'Mascotas';

type GroupItem = {
	name: string;
	id: number;
};

type CategoryItemProps = {
	active?: boolean;
	children?: React.ReactNode;
	deleatable?: boolean;
	label: string;
	icon: React.ReactNode;
	categoryData?: GroupItem[];
	onClick?: React.MouseEventHandler<HTMLDivElement>;
};

const CategoryItem = ({
	active = false,
	label,
	icon,
	categoryData = [],
	onClick,
}: CategoryItemProps) => {
	const t = useTranslations();

	const buttonStyles = clsx({
		'bg-gray-50 shadow-sm': active,
	});

	const labelStyles = clsx({
		'text-primary-500': active,
	});

	const arrowStyles = clsx({
		'rotate-180': active,
	});

	const bodyStyles = clsx(
		{
			'h-0': !active,
		},
		{ 'h-auto': active }
	);

	return (
		<div
			className={`rounded-xl w-full transition-all duration-300 flex flex-col items-center hover:bg-gray-50 hover:shadow-sm hover:cursor-pointer disabled:pointer-events-none font-medium py-2 pl-2 pr-2 ${buttonStyles}`}
		>
			<div onClick={onClick} className="flex w-full items-center">
				<div className="flex items-center justify-center gap-2 mr-auto py-2">
					<ButtonIcon
						className="pointer-events-none"
						color="primary"
						icon={icon}
						active={active}
					/>
					<span className={labelStyles}>{t(label)}</span>
				</div>
				<div className={`transition-all ${arrowStyles}`}>
					<IconKeyboardArrowDown />
				</div>
			</div>
			<div
				className={`flex flex-col w-full gap-2 overflow-hidden transition-all duration-300 ${bodyStyles}`}
			>
				{categoryData.map((group) => (
					<GroupItem key={group.id} label={group.name} />
				))}
			</div>
		</div>
	);
};

export default CategoryItem;
