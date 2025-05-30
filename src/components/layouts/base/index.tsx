import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ROBOTO } from '@/config/fonts';
import { OUTFIT } from '@/config/fonts';
// import { Analytics } from '@vercel/analytics/next';
import CookieConsent from '@/components/Cookies';
import { GoogleAnalytics } from '@next/third-parties/google';
import { AnalyticsTracker } from '@/components/analytics';

import Script from 'next/script';

import '@/app/globals.css';

type BaseProps = {
	children: React.ReactNode;
	locale: string;
};

const BaseLayout: React.FC<BaseProps> = async ({ children, locale }) => {
	const messages = await getMessages();
	const gaID = process.env.NEXT_PUBLIC_GOOGLE_TAG;

	return (
		<NextIntlClientProvider messages={messages} locale={locale}>
			<html lang={locale}>
				<Script
					src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
					strategy="afterInteractive"
				/>

				<body
					className={`${OUTFIT.className} ${ROBOTO.className} antialiased`}
				>
					{children}
					{/* <Analytics /> */}
					<CookieConsent />
					{gaID && <GoogleAnalytics gaId={gaID} />}
					<AnalyticsTracker />
				</body>
			</html>
		</NextIntlClientProvider>
	);
};

export default BaseLayout;
