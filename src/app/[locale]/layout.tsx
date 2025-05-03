import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

import { LoadingProvider } from '@/lib/context/LoadingContext';
import BaseLayout from '@/components/layouts/base';

export const metadata: Metadata = {
	title: process.env.NEXT_PUBLIC_PRODUCTNAME,
	description: 'The best way to build your SaaS product.',
};

export default async function RootLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
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
