import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';

import { LoadingProvider } from '@/lib/context/LoadingContext';
import BaseLayout from '@/components/layouts/base';

interface GenerateMetadataProps {
	params: {
		locale: string;
	};
}

export async function generateMetadata({
	params,
}: GenerateMetadataProps): Promise<Metadata> {
	const t = await getTranslations();

	const { locale } = await params;

	const localeMap: Record<string, string> = {
		es: 'es_ES',
		en: 'en_US',
	};

	const ogLocale = localeMap[locale] || `${locale}_${locale.toUpperCase()}`;

	return {
		title: process.env.NEXT_PUBLIC_PRODUCTNAME,
		description: t('meta description'),
		keywords: t('meta keywords'),
		metadataBase: new URL('https://bnbexplorer.com'),
		openGraph: {
			title: process.env.NEXT_PUBLIC_PRODUCTNAME,
			description: t('meta description'),
			url: `/${locale}`,
			siteName: 'BNBexplorer',
			images: [
				{
					url: '/static/img/default-property-2x.webp',
					width: 1200,
					height: 1200,
					alt: 'BNBexplorer',
				},
			],
			locale: ogLocale,
			type: 'article',
		},
		twitter: {
			card: 'summary_large_image',
			title: process.env.NEXT_PUBLIC_PRODUCTNAME,
			description: t('meta description'),
			images: ['/static/img/default-property-2x.webp'],
		},
	};
}

export default async function RootLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: { locale: string };
}>) {
	const { locale } = await params;

	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}
	return (
		<BaseLayout locale={locale}>
			<LoadingProvider>{children}</LoadingProvider>
		</BaseLayout>
	);
}
