import React from "react";
import { useTranslations } from "next-intl";

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
import { getHeroSlides } from "@/components/organisms/hero-carousel/hero-slides";
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

export default function Home() {
    const t = useTranslations();
    const heroSlides = getHeroSlides(t);

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
            <StickyHeader className="backdrop-blur-md">
                <LandingAppBar className="mx-auto rounded-none shadow-none! max-w-7xl" />
            </StickyHeader>
            <main className="bg-white">
                <section
                    aria-labelledby="welcomeGuide"
                    className="bg-white flex flex-col gap-8 justify-center items-center pt-3 border-b border-gray-100"
                >
                    <BadgeMarketing
                        className="px-4"
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
                        <div className="flex flex-col sm:flex-row gap-2">
                            <ButtonLink
                                href="#"
                                label={t("home_page.hero.action_label")}
                                size="lg"
                                color="white"
                                className="shadow-xs z-5 border border-primary-200"
                                iconRight={<IconOpenInNew />}
                            />
                            <ButtonLink
                                label={t("home_page.section_04.action_label")}
                                href="/app"
                                size="lg"
                                iconRight={<IconArrowRightAlt />}
                                className="shadow-xs z-5"
                            />
                        </div>
                        <div className="max-w-[1100px] w-full mx-auto">
                            <HeroCarousel slides={heroSlides} />
                        </div>
                    </div>
                </section>
                <section
                    aria-labelledby="easyToUse"
                    className="bg-white flex flex-col gap-8 justify-center items-center py-12 border-b border-gray-100 relative bg-radial-[circle_at_bottom] from-primary-50 to-white px-4"
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
                            className="border border-gray-100"
                        />
                        <Feature
                            color="gradient"
                            number={2}
                            title={t("home_page.section_02.feature_02_title")}
                            body={t("home_page.section_02.feature_02_body")}
                            className="sm:col-start-1 sm:row-start-2 border border-gray-100"
                        />
                        <Feature
                            color="gradient"
                            number={3}
                            title={t("home_page.section_02.feature_03_title")}
                            body={t("home_page.section_02.feature_03_body")}
                            className="sm:row-span-2 sm:col-start-2 sm:row-start-1 border border-gray-100"
                            isFeatured
                            image={welcome.src}
                        />
                    </div>

                    <div className="relative grid grid-cols-2 md:grid-cols-4 lg:grid-flow-col lg:auto-cols-fr w-full max-w-[800px] py-3 gap-4">
                        <div className="flex flex-col gap-3 items-center">
                            <FancyIcon
                                icon={<IconChatBubble color="white" />}
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
                                icon={<IconChatBubble color="white" />}
                                color="primary"
                            />
                            <p className="text-sm font-body">
                                {t("home_page.section_02.feature_06_title")}
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 items-center">
                            <FancyIcon
                                icon={<IconChatBubble color="white" />}
                                color="primary"
                            />
                            <p className="text-sm font-body">
                                {t("home_page.section_02.feature_07_title")}
                            </p>
                        </div>
                    </div>
                    <Typography
                        weight="medium"
                        size="sm"
                        className="w-full max-w-[400px] mx-auto text-center"
                    >
                        {t("home_page.section_02.feature_claim")}
                    </Typography>
                    <ButtonLink
                        label={t("home_page.section_02.action_label")}
                        href="/app"
                        size="lg"
                        iconRight={<IconArrowRightAlt />}
                        className="z-1"
                    />
                </section>
                <section
                    aria-labelledby="features"
                    className="bg-white flex flex-col gap-8 justify-center items-center py-12 border-b border-gray-100 relative px-4"
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
                                className="border border-gray-100"
                            />
                            <Feature
                                color="gradient"
                                icon={<IconAlarm color="white" />}
                                title={t(
                                    "home_page.section_03.feature_02_title",
                                )}
                                body={t("home_page.section_03.feature_02_body")}
                                className="border border-gray-100"
                            />
                            <Feature
                                color="gradient"
                                icon={<IconNightLife color="white" />}
                                title={t(
                                    "home_page.section_03.feature_03_title",
                                )}
                                body={t("home_page.section_03.feature_03_body")}
                                className="border border-gray-100"
                            />
                            <Feature
                                color="gradient"
                                icon={<IconLanguage color="white" />}
                                title={t(
                                    "home_page.section_03.feature_04_title",
                                )}
                                body={t("home_page.section_03.feature_04_body")}
                                className="border border-gray-100"
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
                                {t("home_page.section_03.feature_05")}
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 items-center">
                            <FancyIcon
                                icon={<IconApartment color="white" />}
                                color="primary"
                            />
                            <p className="text-sm font-body text-center">
                                {t("home_page.section_03.feature_06")}
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 items-center">
                            <FancyIcon
                                icon={<IconFavorite color="white" />}
                                color="primary"
                            />
                            <p className="text-sm font-body text-center">
                                {t("home_page.section_03.feature_07")}
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 items-center">
                            <FancyIcon
                                icon={<IconInterests color="white" />}
                                color="primary"
                            />
                            <p className="text-sm font-body text-center">
                                {t("home_page.section_03.feature_08")}
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 items-center col-span-full lg:col-span-1 max-w-[300px] mx-auto">
                            <FancyIcon
                                icon={<IconLightMode color="white" />}
                                color="primary"
                            />
                            <p className="text-sm font-body text-center">
                                {t("home_page.section_03.feature_09")}
                            </p>
                        </div>
                    </div>
                </section>
                <section
                    aria-labelledby="faq"
                    className="bg-white flex flex-col gap-8 justify-center items-center py-12 border-b border-gray-100 relative px-4 overflow-hidden"
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
                    className="bg-gray-100 flex flex-col gap-8 justify-center items-center pt-12 border-b border-gray-100 relative px-4"
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
