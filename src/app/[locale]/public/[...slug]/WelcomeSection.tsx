import { getTranslations, getLocale } from "next-intl/server";

import WelcomeTabs from "@/components/templates/welcome-tabs";
import WeatherWidget from "@/components/templates/weather-widget";
import InfoShortcuts from "@/components/molecules/info-shortcuts";
import { fetchWeather } from "@/components/templates/weather-widget/_data";

import { fetchWelcomeHighlightsTabsData, type InfoGroup } from "./_data";

type Props = {
    propertyId: string;
    categoryId: string;
    lat: number;
    lng: number;
    infoGroups: InfoGroup[];
};

export default async function WelcomeSection({
    propertyId,
    lat,
    lng,
    categoryId,
    infoGroups,
}: Props) {
    const locale = await getLocale();

    const t = await getTranslations();

    const [{ featuredGroups, mustVisitGroups }, weather] = await Promise.all([
        fetchWelcomeHighlightsTabsData(propertyId, locale),
        fetchWeather(lat, lng),
    ]);

    return (
        <>
            <h1 className="font-heading text-3xl font-bold">
                {t("¡Te damos la bienvenida con los brazos abiertos!")}
            </h1>

            <p className="font-body">
                {t(
                    "Nos alegra que hayas elegido nuestro alojamiento para tu estancia",
                )}
            </p>

            <InfoShortcuts groups={infoGroups} propertyId={propertyId} />

            <WeatherWidget weather={weather} />

            <WelcomeTabs
                lat={lat}
                lng={lng}
                featuredGroups={featuredGroups}
                categoryId={categoryId}
                mustVisitGroups={mustVisitGroups}
                labels={{
                    featuredTab: t("favorites"),
                    mustVisitTab: t("mustSees"),
                    eventsTab: t("events"),
                    featuredHeading: t("favoriteExplained"),
                    mustVisitHeading: t("mustSeeExplained"),
                }}
            />
        </>
    );
}
