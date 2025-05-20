'use client';

import clsx from 'clsx';

import { useTranslations } from 'next-intl';
import { useSidebar } from '@/lib/context/SidebarContext';

import IconClose from '@/components/atoms/icon/close';
import IconApartment from '@/components/atoms/icon/apartment';
import ButtonLink from '@/components/molecules/button-link';
import Button from '@/components/molecules/button';
import PropertySidebar from '@/components/organisms/sidebar/property-sidebar';

const PropertyContent = () => {
	const t = useTranslations();

	const { isOpen, closeSidebar } = useSidebar();

	const sidebarContentStyles = clsx(
		{ 'translate-x-0': isOpen },
		{ '-translate-x-full': !isOpen }
	);

	return (
		<aside
			className={`absolute z-10 md:relative w-full md:max-w-80 grow flex gap-2 flex-col h-full bg-gray-100 transition-all duration-300 md:translate-x-0 ${sidebarContentStyles}`}
		>
			<div className="flex gap-2 items-center md:hidden">
				<ButtonLink
					label={t('Mis Propiedades')}
					href="/app/properties"
					iconLeft={<IconApartment />}
					className="w-max"
				/>
				<Button
					label={t('Ocultar menú')}
					color="white"
					onClick={closeSidebar}
					iconLeft={<IconClose />}
					className="shadow-sm grow"
				/>
			</div>
			<PropertySidebar />
		</aside>
	);
};

export default PropertyContent;
