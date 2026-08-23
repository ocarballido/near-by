"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

import IconAccountCircle from "@/components/atoms/icon/account-circle";
import IconArrowLeftAlt from "@/components/atoms/icon/arrow-left-alt";
import IconArrowRightAlt from "@/components/atoms/icon/arrow-right-alt";
import ButtonLink from "@/components/molecules/button-link";
import { CarouselSlide } from "@/components/molecules/carousel";

import TimeWindowBackground from "./TimeWindowBackground";
import TimeWindowNav from "./TimeWindowNav";
import { useTimeWindowCarousel } from "./use-time-window-carousel";
import { TIME_WINDOW_SHOWCASE_SLIDES } from "./time-window-showcase.data";

// Mirror deliberado de LABEL_KEYS (TimeWindowHeader.tsx / TimeWindowNav.tsx),
// solo para el alt text de las imágenes del carrusel.
const LABEL_KEYS: Record<string, string> = {
    breakfast: "timeWindowBreakfast",
    sightseeing: "timeWindowSightseeing",
    lunch: "timeWindowLunch",
    aperitif: "timeWindowAperitif",
    dinner: "timeWindowDinner",
    nightlife: "timeWindowNightlife",
};

export default function TimeWindowShowcaseSection() {
    const t = useTranslations();

    const {
        emblaRef,
        selectedIndex,
        canScrollPrev,
        canScrollNext,
        scrollPrev,
        scrollNext,
        scrollTo,
    } = useTimeWindowCarousel();

    return (
        <section className="px-4 max-w-7xl w-full">
            <div
                aria-labelledby="time-window"
                className="flex flex-col items-center gap-8 rounded-xl px-4 py-12 lg:py-16 relative overflow-hidden"
            >
                <TimeWindowBackground
                    slides={TIME_WINDOW_SHOWCASE_SLIDES}
                    activeIndex={selectedIndex}
                />

                <div className="relative z-10 flex flex-col items-center gap-8 max-w-[800px] w-full text-center">
                    <div>
                        <h2
                            id="time-window"
                            className="font-heading text-4xl font-bold text-white mb-4"
                        >
                            {t("page_home.section_time_window.title")}
                        </h2>
                        <h3 className="font-heading font-medium text-xl md:text-2xl text-white/90">
                            {t("page_home.section_time_window.subtitle")}
                        </h3>
                    </div>

                    <TimeWindowNav
                        slides={TIME_WINDOW_SHOWCASE_SLIDES}
                        activeIndex={selectedIndex}
                        onSelect={scrollTo}
                        // className="max-w-sm"
                    />

                    <div className="relative w-full max-w-sm -my-6">
                        <div
                            ref={emblaRef}
                            style={{
                                overflow: "hidden",
                                width: "100%",
                                padding: "24px 0",
                            }}
                            role="region"
                            aria-roledescription="carousel"
                            aria-label={t(
                                "page_home.section_time_window.title",
                            )}
                        >
                            <div style={{ display: "flex" }}>
                                {TIME_WINDOW_SHOWCASE_SLIDES.map(
                                    (slide, index) => (
                                        <CarouselSlide
                                            key={slide.id}
                                            className="flex justify-center"
                                        >
                                            <Image
                                                src={slide.image}
                                                alt={t(
                                                    LABEL_KEYS[slide.id] ??
                                                        slide.id,
                                                )}
                                                className="w-full max-w-[300px] h-auto rounded-2xl shadow-xl"
                                                priority={index === 0}
                                            />
                                        </CarouselSlide>
                                    ),
                                )}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={scrollPrev}
                            disabled={!canScrollPrev}
                            aria-label={t("Slide anterior")}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white text-primary-600 shadow-lg disabled:opacity-30 transition-opacity hover:cursor-pointer"
                        >
                            <IconArrowLeftAlt size={20} />
                        </button>
                        <button
                            type="button"
                            onClick={scrollNext}
                            disabled={!canScrollNext}
                            aria-label={t("Slide siguiente")}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white text-primary-600 shadow-lg disabled:opacity-30 transition-opacity hover:cursor-pointer"
                        >
                            <IconArrowRightAlt size={20} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-3 max-w-[700px]">
                        <p className="font-body font-medium text-white/90">
                            {t("page_home.section_time_window.body1")}{" "}
                            {t("page_home.section_time_window.body2")}
                        </p>
                    </div>

                    <ButtonLink
                        label={t("page_home.mainAction")}
                        href="/app"
                        iconLeft={<IconAccountCircle />}
                        color="white"
                        className="w-fit"
                    />
                </div>
            </div>
        </section>
    );
}
