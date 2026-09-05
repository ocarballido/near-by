import React from "react";
import { getTranslations, getLocale } from "next-intl/server";

import Image from "next/image";

import rooftopCentered from "../../../public/static/img/rooftop-centered.png";
import blur from "../../../public/static/img/home/blur.webp";
import bluredBubbles from "../../../public/static/img/blured-bubbles.png";
import welcome from "../../../public/static/img/home/welcome.png";

import LandingAppBar from "@/components/organisms/landing-appbar";
import ButtonLink from "@/components/molecules/button-link";
import ChimneyEffect from "@/components/atoms/chimney";

import IconChatBubble from "@/components/atoms/icon/chat-bubble";
import IconFavorite from "@/components/atoms/icon/favorite";
import IconInterests from "@/components/atoms/icon/interests";

import Feature from "@/components/molecules/card/feature";

import Typography from "@/components/atoms/typography";

import BadgeMarketing from "@/components/atoms/badge-marketing";
import IconOpenInNew from "@/components/atoms/icon/open-in-new";
import Rating from "@/components/molecules/rating";
import {
    getHeroSlides,
    type Locale,
} from "@/components/organisms/hero-carousel/hero-slides";
import { HeroCarousel } from "@/components/organisms/hero-carousel";
import { StickyHeader } from "@/components/atoms/sticky-header";
import FancyIcon from "@/components/atoms/icon/fancy-icon";
import IconMail from "@/components/atoms/icon/mail";
import IconArrowRightAlt from "@/components/atoms/icon/arrow-right-alt";
import IconDirections from "@/components/atoms/icon/directions";
import IconAlarm from "@/components/atoms/icon/alarm";
import IconNightLife from "@/components/atoms/icon/nightlife";
import IconLanguage from "@/components/atoms/icon/language";
import IconApartment from "@/components/atoms/icon/apartment";
import IconLightMode from "@/components/atoms/icon/light-mode";
import { FaqSection, type FaqItem } from "@/components/organisms/faq-section";
import IconQrCode from "@/components/atoms/icon/qr-code";
import IconShare from "@/components/atoms/icon/share";
import IconWhatsapp from "@/components/atoms/icon/whatsapp";

export default async function Home() {
    const t = await getTranslations();
    const locale = (await getLocale()) as Locale;
    const heroSlides = getHeroSlides(t, locale);

    const faqItems: FaqItem[] = [
        {
            id: "FAQ_01",
            question: t("home_page.section_04.faq_01_title"),
            answer: t("home_page.section_04.faq_01_body"),
        },
        {
            id: "FAQ_02",
            question: t("home_page.section_04.faq_02_title"),
            answer: t("home_page.section_04.faq_02_body"),
        },
        {
            id: "FAQ_03",
            question: t("home_page.section_04.faq_03_title"),
            answer: t("home_page.section_04.faq_03_body"),
        },
        {
            id: "FAQ_04",
            question: t("home_page.section_04.faq_04_title"),
            answer: t("home_page.section_04.faq_04_body"),
        },
        {
            id: "FAQ_05",
            question: t("home_page.section_04.faq_05_title"),
            answer: t("home_page.section_04.faq_05_body"),
        },
    ];

    return (
        <>
            <StickyHeader className="backdrop-blur-md pt-3 md:pt-0">
                <ButtonLink
                    href="https://www.bnbexplorer.com/es/public/37a03a95-cd39-4d40-a22b-7628cbb50245/welcome/highlights"
                    label={t("home_page.hero.action_label")}
                    color="white"
                    target="_blank"
                    className="shadow-xs z-5 border border-primary-200 flex md:hidden mx-3"
                    iconRight={<IconOpenInNew />}
                />
                <LandingAppBar className="mx-auto rounded-none shadow-none! max-w-7xl" />
            </StickyHeader>
            <main className="bg-white">
                <section
                    aria-labelledby="welcomeGuide"
                    className="bg-white flex flex-col gap-8 justify-center items-center pt-3 border-b border-gray-200"
                >
                    <BadgeMarketing
                        className="mx-4!"
                        label={t("home_page.hero.welcome_badge")}
                    />
                    <div className="flex flex-col gap-4 justify-center w-full max-w-[800px] mx-auto px-4">
                        <Typography
                            component="h1"
                            className="text-center text-4xl! sm:text-6xl!"
                            lineHeight="tight"
                            weight="semibold"
                            color="black"
                            id="welcomeGuide"
                        >
                            {t("home_page.hero.title")}
                        </Typography>
                        <Typography
                            className="text-center text-lg sm:text-2xl! text-gray-900/60"
                            fontFamily="base"
                            weight="light"
                        >
                            {t("home_page.hero.subtitle")}
                        </Typography>
                    </div>

                    <Rating
                        label={t("home_page.hero.rating")}
                        className="px-4 max-w-xs text-center"
                    />
                    <div className="px-4 flex flex-col items-center gap-6 relative w-full pb-12">
                        <Image
                            src="/static/img/home/hero/radar.svg"
                            fill
                            className="object-cover object-top z-0"
                            alt="BBNexplorer"
                        />
                        <ButtonLink
                            label={t("home_page.section_04.action_label")}
                            href="/app"
                            size="lg"
                            iconRight={<IconArrowRightAlt />}
                            className="shadow-xs z-5"
                        />
                        <div className="max-w-[1100px] w-full mx-auto relative">
                            <HeroCarousel slides={heroSlides} />
                        </div>
                    </div>
                </section>
                <section
                    aria-labelledby="easyToUse"
                    className="bg-white flex flex-col gap-8 justify-center items-center py-12 border-b border-gray-200 relative bg-radial-[circle_at_bottom] from-primary-50 to-white px-4"
                >
                    <Image
                        src={blur}
                        fill={true}
                        alt="Background Blured image"
                        className="z-0 object-cover object-center md:object-fill md:h-full md:w-auto opacity-30"
                    />
                    <BadgeMarketing
                        className="px-4 relative"
                        label={t("home_page.section_02.welcome_badge")}
                    />
                    <div className="flex flex-col gap-2 justify-center w-full max-w-[800px] mx-auto relative">
                        <Typography
                            component="h1"
                            className="text-center text-2xl! sm:text-4xl!"
                            lineHeight="tight"
                            weight="semibold"
                            color="black"
                            id="easyToUse"
                        >
                            {t("home_page.section_02.title")}
                        </Typography>
                        <Typography
                            className="text-center text-lg sm:text-2xl! text-gray-900/60"
                            fontFamily="base"
                            weight="light"
                        >
                            {t("home_page.section_02.subtitle")}
                        </Typography>
                    </div>
                    <div className="grid grid-cols-1 grid-rows-1 sm:grid-cols-2 sm:grid-rows-2 gap-2 max-w-[800px] w-full">
                        <Feature
                            color="gradient"
                            number={1}
                            title={t("home_page.section_02.feature_01_title")}
                            body={t("home_page.section_02.feature_01_body")}
                            className="border border-gray-200"
                        />
                        <Feature
                            color="gradient"
                            number={2}
                            title={t("home_page.section_02.feature_02_title")}
                            body={t("home_page.section_02.feature_02_body")}
                            className="sm:col-start-1 sm:row-start-2 border border-gray-200"
                        />
                        <Feature
                            color="gradient"
                            number={3}
                            title={t("home_page.section_02.feature_03_title")}
                            body={t("home_page.section_02.feature_03_body")}
                            className="sm:row-span-2 sm:col-start-2 sm:row-start-1 border border-gray-200"
                            isFeatured
                            image={welcome.src}
                        />
                    </div>

                    <ButtonLink
                        label={t("home_page.section_02.action_label")}
                        href="/app"
                        size="lg"
                        iconRight={<IconArrowRightAlt />}
                        className="z-1"
                    />

                    <div className="flex flex-col gap-2 items-center">
                        <Typography
                            className="text-center text-base sm:text-xl!"
                            fontFamily="base"
                            component="h3"
                        >
                            {t("home_page.section_02.feature_claim_title")}
                        </Typography>
                        <Typography
                            className="text-center text-sm font-medium text-gray-900/60 max-w-[400px]"
                            weight="light"
                        >
                            {t("home_page.section_02.feature_claim")}
                        </Typography>
                    </div>

                    <div className="relative grid grid-cols-2 md:grid-cols-4 lg:grid-flow-col lg:auto-cols-fr w-full max-w-[800px] gap-4">
                        <div className="flex flex-col gap-3 items-center">
                            <FancyIcon
                                icon={<IconWhatsapp color="white" />}
                                color="primary"
                            />
                            <p className="text-sm font-body">
                                {t("home_page.section_02.feature_04_title")}
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 items-center">
                            <FancyIcon
                                icon={<IconMail color="white" />}
                                color="primary"
                            />
                            <p className="text-sm font-body">
                                {t("home_page.section_02.feature_05_title")}
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 items-center">
                            <FancyIcon
                                icon={<IconShare color="white" />}
                                color="primary"
                            />
                            <p className="text-sm font-body">
                                {t("home_page.section_02.feature_06_title")}
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 items-center">
                            <FancyIcon
                                icon={<IconQrCode color="white" />}
                                color="primary"
                            />
                            <p className="text-sm font-body">
                                {t("home_page.section_02.feature_07_title")}
                            </p>
                        </div>
                    </div>
                </section>
                <section
                    aria-labelledby="features"
                    className="bg-white flex flex-col gap-8 justify-center items-center py-12 border-b border-gray-200 relative px-4"
                >
                    <BadgeMarketing
                        className="px-4 relative"
                        label={t("home_page.section_03.welcome_badge")}
                    />
                    <div className="flex flex-col gap-2 justify-center w-full max-w-[800px] mx-auto relative">
                        <Typography
                            component="h2"
                            className="text-center text-2xl! sm:text-4xl!"
                            lineHeight="tight"
                            weight="semibold"
                            color="black"
                            id="features"
                        >
                            {t("home_page.section_03.title")}
                        </Typography>
                        <Typography
                            className="text-center text-lg sm:text-2xl! text-gray-900/60"
                            fontFamily="base"
                            weight="light"
                        >
                            {t("home_page.section_03.subtitle")}
                        </Typography>
                        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-[800px] py-3">
                            <Feature
                                color="gradient"
                                icon={<IconDirections color="white" />}
                                title={t(
                                    "home_page.section_03.feature_01_title",
                                )}
                                body={t("home_page.section_03.feature_01_body")}
                                className="border border-gray-200"
                            />
                            <Feature
                                color="gradient"
                                icon={<IconAlarm color="white" />}
                                title={t(
                                    "home_page.section_03.feature_02_title",
                                )}
                                body={t("home_page.section_03.feature_02_body")}
                                className="border border-gray-200"
                            />
                            <Feature
                                color="gradient"
                                icon={<IconNightLife color="white" />}
                                title={t(
                                    "home_page.section_03.feature_03_title",
                                )}
                                body={t("home_page.section_03.feature_03_body")}
                                className="border border-gray-200"
                            />
                            <Feature
                                color="gradient"
                                icon={<IconLanguage color="white" />}
                                title={t(
                                    "home_page.section_03.feature_04_title",
                                )}
                                body={t("home_page.section_03.feature_04_body")}
                                className="border border-gray-200"
                            />
                        </div>
                    </div>
                    <ButtonLink
                        label={t("home_page.section_03.action_label")}
                        href="/app"
                        size="lg"
                        iconRight={<IconArrowRightAlt />}
                    />
                    <div className="flex flex-col gap-2 items-center">
                        <Typography
                            className="text-center text-base sm:text-xl!"
                            fontFamily="base"
                            component="h3"
                        >
                            {t("home_page.section_03.feature_rest_title")}
                        </Typography>
                        <Typography
                            className="text-center text-sm font-medium text-gray-900/60 max-w-[400px]"
                            weight="light"
                        >
                            {t("home_page.section_03.feature_rest_subtitle")}
                        </Typography>
                    </div>
                    <div className="relative grid grid-cols-2 md:grid-cols-4 lg:grid-flow-col lg:auto-cols-fr w-full max-w-[1000px] py-4 gap-4 items-center">
                        <div className="flex flex-col gap-3 items-center">
                            <FancyIcon
                                icon={<IconChatBubble color="white" />}
                                color="primary"
                            />
                            <p className="text-sm font-body text-center">
                                {t.rich("home_page.section_03.feature_05", {
                                    bold: (chunks) => (
                                        <strong className="font-bold">
                                            {chunks}
                                        </strong>
                                    ),
                                })}
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 items-center">
                            <FancyIcon
                                icon={<IconApartment color="white" />}
                                color="primary"
                            />
                            <p className="text-sm font-body text-center">
                                {t.rich("home_page.section_03.feature_06", {
                                    bold: (chunks) => (
                                        <strong className="font-bold">
                                            {chunks}
                                        </strong>
                                    ),
                                })}
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 items-center">
                            <FancyIcon
                                icon={<IconFavorite color="white" />}
                                color="primary"
                            />
                            <p className="text-sm font-body text-center">
                                {t.rich("home_page.section_03.feature_07", {
                                    bold: (chunks) => (
                                        <strong className="font-bold">
                                            {chunks}
                                        </strong>
                                    ),
                                })}
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 items-center">
                            <FancyIcon
                                icon={<IconInterests color="white" />}
                                color="primary"
                            />
                            <p className="text-sm font-body text-center">
                                {t.rich("home_page.section_03.feature_08", {
                                    bold: (chunks) => (
                                        <strong className="font-bold">
                                            {chunks}
                                        </strong>
                                    ),
                                })}
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 items-center col-span-full lg:col-span-1 max-w-[300px] mx-auto">
                            <FancyIcon
                                icon={<IconLightMode color="white" />}
                                color="primary"
                            />
                            <p className="text-sm font-body text-center">
                                {t.rich("home_page.section_03.feature_09", {
                                    bold: (chunks) => (
                                        <strong className="font-bold">
                                            {chunks}
                                        </strong>
                                    ),
                                })}
                            </p>
                        </div>
                    </div>
                </section>
                <section
                    aria-labelledby="faq"
                    className="bg-white flex flex-col gap-8 justify-center items-center py-12 border-b border-gray-200 relative px-4 overflow-hidden"
                >
                    <BadgeMarketing
                        className="px-4 relative z-1"
                        label={t("home_page.section_04.welcome_badge")}
                    />
                    <div className="flex flex-col md:flex-row gap-4 max-w-[1280px]">
                        <div className="flex flex-col gap-4 order-2 md:order-1 w-full">
                            <Typography
                                component="h2"
                                className="text-2xl! sm:text-4xl!"
                                lineHeight="tight"
                                weight="semibold"
                                color="black"
                                id="faq"
                            >
                                {t("home_page.section_04.title")}
                            </Typography>
                            <FaqSection
                                items={faqItems}
                                defaultActiveId="FAQ_01"
                            />
                            <ButtonLink
                                label={t("home_page.section_04.action_label")}
                                href="/app"
                                size="lg"
                                iconRight={<IconArrowRightAlt />}
                                className="w-fit"
                            />
                        </div>
                        <div className="w-full flex justify-center items-center relative max-w-[800px] order-1">
                            <ChimneyEffect
                                mode="bubble"
                                size={120}
                                frequency={250}
                                duration={4000}
                                className="absolute top-[56%] left-[50%] z-0"
                            />
                            <Image
                                alt={t("Enlace público")}
                                src={rooftopCentered}
                                sizes="100vw"
                                style={{
                                    height: "auto",
                                }}
                            />
                            <Image
                                src={bluredBubbles}
                                // fill={true}
                                width={400}
                                height={400}
                                alt="Blur image"
                                className="z-0 absolute top-0 right-0 w-[50%] h-auto"
                            />
                        </div>
                    </div>
                </section>
                <section
                    aria-labelledby="cta"
                    className="bg-gray-100 flex flex-col gap-8 justify-center items-center pt-12 border-b border-gray-200 relative px-4"
                >
                    <Image
                        src={blur}
                        fill={true}
                        alt="Blur image"
                        className="z-0 object-cover object-bottom md:w-auto opacity-50"
                    />
                    <div className="flex flex-col gap-2 justify-center w-full max-w-[800px] mx-auto relative z-1">
                        <Typography
                            component="h1"
                            className="text-center text-4xl! sm:text-6xl!"
                            lineHeight="tight"
                            weight="semibold"
                            color="black"
                            id="cta"
                        >
                            {t("home_page.call_to_action.title")}
                        </Typography>
                        <Typography
                            className="text-center text-lg sm:text-2xl! max-w-[600px] mx-auto"
                            fontFamily="base"
                            weight="light"
                        >
                            {t("home_page.call_to_action.subtitle")}
                        </Typography>
                    </div>
                    <ButtonLink
                        label={t("home_page.call_to_action.action_label")}
                        href="/app"
                        size="lg"
                        iconRight={<IconArrowRightAlt />}
                        className="z-1"
                    />
                </section>
            </main>
        </>
    );
}
