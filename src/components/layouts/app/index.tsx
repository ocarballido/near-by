'use client';

import { useLoading } from '@/lib/context/LoadingContext';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { usePathname } from 'next/navigation';

import Spinner from '@/components/atoms/spinner';
import { SpinnerPortal } from '@/components/atoms/spinner/spinner-portal';
import AppBar from '@/components/organisms/appbar';
import PaywallModal from '@/components/templates/paywall-modal';

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const t = useTranslations();

	const { loading } = useLoading();

	const pathName = usePathname();

	const publicLink = useMemo(() => {
		const pathWithoutLocale = pathName.slice(4, pathName.length);
		const isPathProperties = pathWithoutLocale.includes('properties');
		const pathSplitted = pathWithoutLocale.split('/');
		const pathLength = pathSplitted.length;

		if (isPathProperties && pathLength === 5) {
			return {
				showPublicLink: true,
				url: `/public/${pathSplitted[2]}/welcome/highlights`,
			};
		}

		return {
			showPublicLink: false,
			url: '',
		};
	}, [pathName]);

	return (
		<>
			{loading && (
				<SpinnerPortal>
					<Spinner position="fixed" />
				</SpinnerPortal>
			)}
			<div className="p-2 flex flex-col gap-2 items-stretch w-full min-h-screen bg-[#EFEFEF] font-body overflow-hidden">
				<PaywallModal />
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
