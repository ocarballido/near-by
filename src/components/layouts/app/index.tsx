'use client';

import { useLoading } from '@/lib/context/LoadingContext';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { usePathname } from 'next/navigation';

import { LODGING_CATEGORY_ID } from '@/config/config-constants';

import Spinner from '@/components/atoms/spinner';
import AppBar from '@/components/organisms/appbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const t = useTranslations();

	const { loading } = useLoading();

	const pathName = usePathname();

	const publicLink = useMemo(() => {
		const pathWithoutLocale = pathName.slice(4, pathName.length);
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
	}, [pathName]);

	return (
		<>
			{loading && <Spinner />}
			<div className="p-4 flex flex-col gap-2 items-stretch w-full min-h-screen bg-gray-100 font-body overflow-hidden">
				<AppBar
					accommodationHref={
						publicLink.showPublicLink ? publicLink.url : ''
					}
					accommodationName={
						publicLink.showPublicLink ? t('Sitio público') : ''
					}
					isLogged
				/>
				{children}
			</div>
		</>
	);
}
