import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';

import { LoadingProvider } from '@/lib/context/LoadingContext';
import BaseLayout from '@/components/layouts/base';

// Define el tipo para los parámetros
interface GenerateMetadataProps {
	params: {
		locale: string;
	};
}

export async function generateMetadata({
	params,
}: GenerateMetadataProps): Promise<Metadata> {
	const t = await getTranslations();

	const locale = params.locale;

	// Mapeo de locales a formatos Open Graph
	const localeMap: Record<string, string> = {
		es: 'es_ES',
		en: 'en_US',
		// Añade más locales según necesites
	};

	// Obtén el formato adecuado para Open Graph
	const ogLocale = localeMap[locale] || `${locale}_${locale.toUpperCase()}`;

	return {
		title: process.env.NEXT_PUBLIC_PRODUCTNAME,
		description: t('meta description'),
		keywords: t('meta keywords'),
		openGraph: {
			title: process.env.NEXT_PUBLIC_PRODUCTNAME,
			description: t('meta description'),
			url: `https://bnbexplorer.com/${locale}`, // Añade el locale a la URL
			siteName: 'BNBexplorer',
			images: [
				{
					url: '/static/img/default-property-2x.webp',
					width: 1200,
					height: 630,
					alt: 'BNBexplorer',
				},
			],
			locale: ogLocale, // Usa el locale dinámico
			type: 'article',
		},
	};
}

export default async function RootLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: { locale: string }; // Corrige también este tipo
}>) {
	// Como params ya no es una Promise, no necesitas await
	const { locale } = params;

	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}
	return (
		<BaseLayout locale={locale}>
			<LoadingProvider>{children}</LoadingProvider>
		</BaseLayout>
	);
}
