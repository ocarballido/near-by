"use client";

import Autoplay from "embla-carousel-autoplay";
import {
    Carousel,
    CarouselSlide,
    CarouselArrows,
} from "@/components/molecules/carousel";
import { CountryPin } from "@/components/atoms/country-pin";
import { getLocalizedCountryName } from "@/lib/i18n/localized-country-name";
import type { Locale, CountryPresence } from "@/config/config-constants";

const SLIDE_WIDTH = "150px";
const SLIDE_GAP = "1.5rem";
const AUTOPLAY_DELAY_MS = 3000;

interface CountryPinsCarouselProps {
    countries: CountryPresence[];
    locale: Locale;
}

export function CountryPinsCarousel({
    countries,
    locale,
}: CountryPinsCarouselProps) {
    return (
        <Carousel
            options={{ loop: true, align: "center" }}
            autoplay
            gap={SLIDE_GAP}
            className="w-full mx-auto max-w-[1000px]"
            showArrows={<CarouselArrows className="justify-center mt-6" />}
        >
            {countries.map(({ isoCode }) => (
                <CarouselSlide
                    key={isoCode}
                    style={{
                        flex: `0 0 ${SLIDE_WIDTH}`,
                        minWidth: 0,
                        maxWidth: SLIDE_WIDTH,
                        paddingLeft: SLIDE_GAP,
                    }}
                >
                    <div className="flex flex-col items-center gap-2">
                        <CountryPin isoCode={isoCode} />
                        <span className="text-xs font-bold text-center uppercase">
                            {getLocalizedCountryName(isoCode, locale)}
                        </span>
                    </div>
                </CarouselSlide>
            ))}
        </Carousel>
    );
}
