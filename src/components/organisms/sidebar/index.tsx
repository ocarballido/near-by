'use client';

import clsx from 'clsx';

import { useTranslations } from 'next-intl';
import { useSidebar } from '@/lib/context/SidebarContext';

import Button from '@/components/molecules/button';
import ButtonLink from '@/components/molecules/button-link';
import IconClose from '@/components/atoms/icon/close';
import IconApartment from '@/components/atoms/icon/apartment';
import PropertySidebar from './property-sidebar';
import AppSidebar from './app-sidebar';

type SidebarProps = {
	propertyId?: string;
	sidebar: 'APP' | 'PROPERTY';
};

const Sidebar = ({ sidebar = 'APP', propertyId }: SidebarProps) => {
	const t = useTranslations();

	const { isOpen, closeSidebar } = useSidebar();

	const sidebarContentStyles = clsx(
		{ 'translate-x-0': isOpen },
		{ '-translate-x-full': !isOpen }
	);

	return (
		<aside
			className={`fixed bottom-0 left-0 right-0 top-0 p-4 z-10 overflow-y-scroll md:top-0 md:p-0 md:overflow-y-auto md:relative md:w-full md:max-w-80 grow flex gap-2 flex-col md:h-fit bg-gray-100 transition-all duration-300 md:translate-x-0 ${sidebarContentStyles}`}
		>
			<div className="flex gap-2 items-center md:hidden">
				{sidebar === 'PROPERTY' && (
					<ButtonLink
						label={t('Mis Propiedades')}
						href="/app/properties"
						iconLeft={<IconApartment />}
						className="w-max"
					/>
				)}
				<Button
					label={t('Ocultar menú')}
					color="white"
					onClick={closeSidebar}
					iconLeft={<IconClose />}
					className="shadow-sm grow"
				/>
			</div>
			{sidebar === 'PROPERTY' ? (
				<PropertySidebar propertyId={propertyId} />
			) : (
				<AppSidebar />
			)}
		</aside>
	);
};

export default Sidebar;
