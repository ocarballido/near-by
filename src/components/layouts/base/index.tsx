import { NextIntlClientProvider } from "next-intl";
import { ROBOTO } from "@/config/fonts";
import { OUTFIT } from "@/config/fonts";
import CookieConsent from "@/components/Cookies";
import { GoogleTagManager } from "@next/third-parties/google";
import { GtmTracker } from "@/components/analytics/gtm-tracker";
import GoogleMapsScript from "@/components/providers/GoogleMapsScript";
import Footer from "@/components/templates/footer";
import { getMaintenanceConfig } from "@/lib/maintenance";
import { getMessagesForLocale } from "@/i18n/get-messages-for-locale";

import "@/app/globals.css";

type BaseProps = {
    children: React.ReactNode;
    locale: string;
};

const BaseLayout: React.FC<BaseProps> = async ({ children, locale }) => {
    const gtmID = process.env.NEXT_PUBLIC_GTM_ID;
    const { isEnabled: isMaintenanceModeEnabled } = getMaintenanceConfig();
    const messages = await getMessagesForLocale(locale);

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <html lang={locale}>
                <body
                    className={`${OUTFIT.className} ${ROBOTO.className} antialiased`}
                >
                    {gtmID && <GoogleTagManager gtmId={gtmID} />}
                    <GoogleMapsScript />
                    {children}
                    <CookieConsent />
                    <GtmTracker />
                    {!isMaintenanceModeEnabled && <Footer />}
                </body>
            </html>
        </NextIntlClientProvider>
    );
};

export default BaseLayout;
