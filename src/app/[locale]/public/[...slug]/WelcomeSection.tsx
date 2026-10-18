import { getTranslations } from "next-intl/server";

import WelcomeTabs from "@/components/templates/welcome-tabs";
import WeatherWidget from "@/components/templates/weather-widget";
import InfoShortcuts from "@/components/molecules/info-shortcuts";
import HousePublic from "@/components/molecules/card/house-public";
import type { WeatherData } from "@/components/templates/weather-widget/_data";

import type { InfoGroup, HighlightGroup } from "./_data";

type Props = {
    propertyId: string;
    categoryId: string;
    propertyName: string;
    address: string;
    image: string | null;
    lat: number;
    lng: number;
    infoGroups: InfoGroup[];
    weather: WeatherData | null;
    featuredGroups: HighlightGroup[];
    mustVisitGroups: HighlightGroup[];
    checkInDate?: string;
    checkInTime?: string;
    checkOutDate?: string;
    checkOutTime?: string;
};

export default async function WelcomeSection({
    propertyId,
    propertyName,
    address,
    image,
    lat,
    lng,
    categoryId,
    infoGroups,
    weather,
    featuredGroups,
    mustVisitGroups,
    checkInDate,
    checkInTime,
    checkOutDate,
    checkOutTime,
}: Props) {
    const t = await getTranslations();

    return (
        <div className="flex flex-col gap-8">
            <section className="flex flex-col gap-8 md:flex-row md:items-start">
                <div className="flex flex-col gap-6 flex-1 min-w-0">
                    <h1 className="font-heading font-bold text-2xl leading-tight text-balance mt-3 md:text-3xl">
                        {t("¡Te damos la bienvenida con los brazos abiertos!")}
                    </h1>

                    <p className="max-w-[720px] font-body font-medium text-sm leading-5 text-gray-600">
                        {t(
                            "Nos alegra que hayas elegido nuestro alojamiento para tu estancia",
                        )}
                    </p>

                    <WeatherWidget weather={weather} />

                    <InfoShortcuts
                        groups={infoGroups}
                        propertyId={propertyId}
                    />
                </div>

                {/* Mobile: primero; desde tablet, columna derecha */}
                <HousePublic
                    name={propertyName}
                    address={address}
                    image={image}
                    latitude={lat}
                    longitude={lng}
                    checkInDate={checkInDate}
                    checkInTime={checkInTime}
                    checkOutDate={checkOutDate}
                    checkOutTime={checkOutTime}
                    className="w-full max-w-[360px] md:max-w-[300px] lg:max-w-[360px] order-first self-center md:order-last md:self-start"
                />
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
