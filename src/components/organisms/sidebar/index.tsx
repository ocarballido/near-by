'use client';

import clsx from 'clsx';

import { useTranslations } from 'next-intl';
import { useSidebar } from '@/lib/context/SidebarContext';

import Button from '@/components/molecules/button';
import ButtonLink from '@/components/molecules/button-link';
import IconClose from '@/components/atoms/icon/close';
import IconHome from '@/components/atoms/icon/home';
import PropertySidebar from './property-sidebar';
import AppSidebar from './app-sidebar';

type Category = {
	id: string;
	name: string;
	icon: string;
	firstEntryId: string;
};

type Subcategory = {
	id: string;
	label: string;
	href: string;
};

type SidebarProps = {
	sidebar: 'APP' | 'PROPERTY';
	propertySlug?: string;
	categoryId?: string;
	categories?: Category[];
	subCategories?: Subcategory[];
	subcategoryGroupId?: string;
};

const Sidebar = ({
	sidebar = 'APP',
	categoryId,
	categories,
	subCategories,
	subcategoryGroupId,
	propertySlug,
}: SidebarProps) => {
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
						iconLeft={<IconHome />}
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
				<PropertySidebar
					categoryId={categoryId}
					categories={categories}
					subCategories={subCategories}
					subcategoryGroupId={subcategoryGroupId}
					propertySlug={propertySlug}
				/>
			) : (
				<AppSidebar />
			)}
		</aside>
	);
};

export default Sidebar;
