'use client';

import { useTranslations } from 'next-intl';

import IconAdd from '@/components/atoms/icon/add';

import BodyType from '@/components/atoms/typography/body';
import Button from '../button';

type EmptyContentActionProps = {
	className?: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const EmptyContentAction = ({
	className,
	onClick,
}: EmptyContentActionProps) => {
	const t = useTranslations();

	return (
		<div
			className={`flex flex-col gap-4 items-center justify-center ${className}`}
		>
			<BodyType align="center" variant="sm" weight="medium">
				{t('Aún no has añadido contenido')}
				<br />
				{t('No lo dejes para mas tarde!')}
			</BodyType>
			<Button
				onClick={onClick}
				label="Añadir contenido"
				iconLeft={<IconAdd />}
			/>
		</div>
	);
};

export default EmptyContentAction;
