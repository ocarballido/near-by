import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ROBOTO } from '@/config/fonts';
import { OUTFIT } from '@/config/fonts';
import CookieConsent from '@/components/Cookies';
import { GoogleTagManager } from '@next/third-parties/google';
import { GtmTracker } from '@/components/analytics/gtm-tracker';
import GoogleMapsScript from '@/components/providers/GoogleMapsScript';
import Footer from '@/components/templates/footer';

import '@/app/globals.css';

type BaseProps = {
	children: React.ReactNode;
	locale: string;
};

const BaseLayout: React.FC<BaseProps> = async ({ children, locale }) => {
	const messages = await getMessages();
	const gtmID = process.env.NEXT_PUBLIC_GTM_ID;

	return (
		<NextIntlClientProvider messages={messages} locale={locale}>
			<html lang={locale}>
				<body
					className={`${OUTFIT.className} ${ROBOTO.className} antialiased`}
				>
					{gtmID && <GoogleTagManager gtmId={gtmID} />}
					<GoogleMapsScript />
					{children}
					<CookieConsent />
					<GtmTracker />
					<Footer />
				</body>
			</html>
		</NextIntlClientProvider>
	);
};

export default BaseLayout;
