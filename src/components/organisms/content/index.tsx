'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useSidebar } from '@/lib/context/SidebarContext';
import { usePathname } from 'next/navigation';

import Button from '@/components/molecules/button';
import ButtonLink from '@/components/molecules/button-link';
import IconMenu from '@/components/atoms/icon/menu';
import IconOpenInNew from '@/components/atoms/icon/open-in-new';
import ButtonQr from '@/components/molecules/button-qr';

const Content = ({
	children,
	propertyId,
	categoryId,
	subCategoryId,
}: {
	children: React.ReactNode;
	propertyId?: string;
	categoryId?: string;
	subCategoryId?: string;
}) => {
	const t = useTranslations();

	const pathname = usePathname();

	const publicLink = useMemo(() => {
		const pathWithoutLocale = pathname.slice(4, pathname.length);
		const isPathProperties = pathWithoutLocale.includes('properties');
		const pathSplitted = pathWithoutLocale.split('/');
		const pathLength = pathSplitted.length;

		if (isPathProperties && pathLength === 5) {
			return {
				showPublicLink: true,
				url: `/public/${propertyId}/${categoryId}/${subCategoryId}`,
			};
		}

		return {
			showPublicLink: false,
			url: '',
		};
	}, [categoryId, pathname, propertyId, subCategoryId]);

	const { openSidebar } = useSidebar();

	return (
		<main className="flex flex-col gap-2 w-full grow rounded-lg overflow-hidden bg-gray-50">
			<div className="flex flex-col sm:flex-row gap-2 md:hidden p-2">
				<Button
					label={t('Abrir menú')}
					color="white"
					onClick={openSidebar}
					iconLeft={<IconMenu />}
					className="shadow-sm w-full"
				/>
				{publicLink.showPublicLink ? (
					<div className="flex gap-2 w-full">
						<ButtonLink
							label={t('Sitio público')}
							color="primary"
							iconLeft={<IconOpenInNew />}
							className="shadow-sm w-full"
							href={`/public/${propertyId}/welcome/highlights`}
							target="_blank"
						/>
						<ButtonQr
							url={`https://www.bnbexplorer.com/public/${propertyId}/welcome/highlights`}
						/>
					</div>
				) : null}
			</div>
			{children}
		</main>
	);
};

export default Content;
