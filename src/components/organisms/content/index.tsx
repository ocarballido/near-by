'use client';

import { useTranslations } from 'next-intl';
import { useSidebar } from '@/lib/context/SidebarContext';

import Button from '@/components/molecules/button';
import IconMenu from '@/components/atoms/icon/menu';

const Content = ({ children }: { children: React.ReactNode }) => {
	const t = useTranslations();

	const { openSidebar } = useSidebar();

	return (
		<main className="flex flex-col gap-2 w-full grow rounded-lg overflow-hidden">
			<Button
				label={t('Abrir menú')}
				color="white"
				onClick={openSidebar}
				iconLeft={<IconMenu />}
				className="md:hidden shadow-sm"
			/>

			{children}
		</main>
	);
};

export default Content;
