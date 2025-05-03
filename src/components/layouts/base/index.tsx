import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ROBOTO } from '@/config/fonts';
import { OUTFIT } from '@/config/fonts';
import { Analytics } from '@vercel/analytics/next';
import CookieConsent from '@/components/Cookies';
import { GoogleAnalytics } from '@next/third-parties/google';

import '@/app/globals.css';

type BaseProps = {
	children: React.ReactNode;
	locale: string;
};

const BaseLayout: React.FC<BaseProps> = async ({ children, locale }) => {
	const messages = await getMessages();
	const gaID = process.env.NEXT_PUBLIC_GOOGLE_TAG;

	return (
		<html lang={locale}>
			<body
				className={`${OUTFIT.className} ${ROBOTO.className} antialiased`}
			>
				<NextIntlClientProvider messages={messages} locale={locale}>
					{children}
				</NextIntlClientProvider>
				<Analytics />
				<CookieConsent />
				{gaID && <GoogleAnalytics gaId={gaID} />}
			</body>
		</html>
	);
};

export default BaseLayout;
