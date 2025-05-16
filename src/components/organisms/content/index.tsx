'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useSidebar } from '@/lib/context/SidebarContext';
import { usePathname } from 'next/navigation';

import { LODGING_CATEGORY_ID } from '@/config/config-constants';

import Button from '@/components/molecules/button';
import ButtonLink from '@/components/molecules/button-link';
import IconMenu from '@/components/atoms/icon/menu';
import IconOpenInNew from '@/components/atoms/icon/open-in-new';

const Content = ({
	children,
	propertySlug,
}: {
	children: React.ReactNode;
	propertySlug?: string;
}) => {
	const t = useTranslations();

	const pathname = usePathname();

	const publicLink = useMemo(() => {
		const pathWithoutLocale = pathname.slice(4, pathname.length);
		const isPathProperties = pathWithoutLocale.includes('properties');
		const pathSplitted = pathWithoutLocale.split('/');
		const pathLength = pathSplitted.length;

		if (isPathProperties && pathLength > 3) {
			return {
				showPublicLink: true,
				url: `/public/${pathSplitted[2]}/${LODGING_CATEGORY_ID}`,
			};
		}

		return {
			showPublicLink: false,
			url: '',
		};
	}, [pathname]);

	const { openSidebar } = useSidebar();

	return (
		<main className="flex flex-col gap-2 w-full grow rounded-lg overflow-hidden">
			<div className="flex gap-2 md:hidden">
				<Button
					label={t('Abrir menú')}
					color="white"
					onClick={openSidebar}
					iconLeft={<IconMenu />}
					className="shadow-sm w-full"
				/>
				{publicLink.showPublicLink ? (
					<ButtonLink
						label={t('Sitio público')}
						color="primary"
						iconLeft={<IconOpenInNew />}
						className="shadow-sm w-full"
						href={`/public/${propertySlug}/${LODGING_CATEGORY_ID}`}
						target="_blank"
					/>
				) : null}
			</div>
			{children}
		</main>
	);
};

export default Content;
