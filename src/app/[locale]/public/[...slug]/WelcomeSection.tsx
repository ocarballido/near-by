import { getTranslations } from "next-intl/server";

import WelcomeTabs from "@/components/templates/welcome-tabs";
import WeatherWidget from "@/components/templates/weather-widget";
import InfoShortcuts from "@/components/molecules/info-shortcuts";
import type { WeatherData } from "@/components/templates/weather-widget/_data";

import type { InfoGroup, HighlightGroup } from "./_data";

type Props = {
    propertyId: string;
    categoryId: string;
    lat: number;
    lng: number;
    infoGroups: InfoGroup[];
    weather: WeatherData | null;
    featuredGroups: HighlightGroup[];
    mustVisitGroups: HighlightGroup[];
};

export default async function WelcomeSection({
    propertyId,
    lat,
    lng,
    categoryId,
    infoGroups,
    weather,
    featuredGroups,
    mustVisitGroups,
}: Props) {
    const t = await getTranslations();

    return (
        <div className="flex flex-col">
            <section className="flex flex-col gap-8 px-4 py-10 bg-white justify-center relative border-b border-gray-100">
                <WeatherWidget weather={weather} />

                <InfoShortcuts groups={infoGroups} propertyId={propertyId} />
            </section>

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
        </div>
    );
}
