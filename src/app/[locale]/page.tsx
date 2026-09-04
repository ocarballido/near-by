import React from "react";
import { useTranslations } from "next-intl";

import Image from "next/image";

import rooftopCentered from "../../../public/static/img/rooftop-centered.png";
import multyProperty from "../../../public/static/img/multy-property-2x.webp";
import blur from "../../../public/static/img/home/blur.webp";
import bluredBubbles from "../../../public/static/img/blured-bubbles.png";
import how from "../../../public/static/img/home/how_bnbexplorer.webp";
import guestChat from "../../../public/static/img/home/chatbot.webp";
import welcome from "../../../public/static/img/home/welcome.png";

import categories from "../../../public/static/img/categories-2x.webp";
import uiEdit from "../../../public/static/img/ui-edit-2x.webp";
import publicUi from "../../../public/static/img/public-property.webp";
import testimony01 from "../../../public/static/img/testimony-01.webp";
import testimony02 from "../../../public/static/img/testimony-02.webp";
import testimony03 from "../../../public/static/img/testimony-03.webp";

import LandingAppBar from "@/components/organisms/landing-appbar";
import ButtonLink from "@/components/molecules/button-link";
import PlaceTooltip from "@/components/atoms/place-tooltip";
import IconAccountCircle from "@/components/atoms/icon/account-circle";
import FilterCategories from "@/components/templates/filter-categories";
import ChimneyEffect from "@/components/atoms/chimney";

import IconChatBubble from "@/components/atoms/icon/chat-bubble";
import IconStarShine from "@/components/atoms/icon/star-shine";
import IconCheckCircle from "@/components/atoms/icon/check-circle";
import IconFavorite from "@/components/atoms/icon/favorite";
import IconInterests from "@/components/atoms/icon/interests";

import Feature from "@/components/molecules/card/feature";
import ListItem from "@/components/molecules/list-item";
import FancyBadge from "@/components/atoms/fancy-badge";
import BadgeCheck from "@/components/atoms/BadgeCheck";
import IconCancel from "@/components/atoms/icon/cancel";
import Quote from "@/components/molecules/quote";
import DemoHomeModal from "@/components/organisms/supademo/home-modal";
import HomeCarousel from "@/components/molecules/home-carousel";
import TimeWindowShowcaseSection from "@/components/organisms/time-window-showcase/TimeWindowShowcaseSection";

import { DEMOS } from "@/config/config-constants";

import styles from "./page.module.css";
import Typography from "@/components/atoms/typography";
import IconBookOpened from "@/components/atoms/icon/book-opened";

import BadgeMarketing from "@/components/atoms/badge-marketing";
import IconOpenInNew from "@/components/atoms/icon/open-in-new";
import Rating from "@/components/molecules/rating";
import { heroSlides } from "@/components/organisms/hero-carousel/hero-slides";
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

    const faqItems: FaqItem[] = [
        {
            id: "coste-prueba",
            question: "¿Tiene algún coste o periodo de prueba?",
            answer: "No, BNBexplorer es 100% gratuito tanto para el anfitrión como para los huéspedes. No hay pagos ocultos, no necesitas introducir ninguna tarjeta de crédito para empezar ni se limita el número de funcionalidades tras unos días de uso.",
        },
        {
            id: "app-registro",
            question:
                "¿Mis huéspedes tienen que descargarse una app o registrarse para usar la guía?",
            answer: "No. La guía funciona a través de un simple enlace web o código QR. Tus viajeros solo tienen que hacer clic o escanearlo desde su teléfono y accederán al instante sin tener que instalar ninguna app ni crear una cuenta.",
        },
        {
            id: "idiomas",
            question:
                "¿En qué idiomas está disponible la guía para mis huéspedes?",
            answer: "La guía incluye traducción automática multilingüe y un chatbot con IA que responde a las dudas de tus viajeros en su propio idioma (español, inglés, francés, entre otros), sin que tú tengas que redactar el contenido varias veces.",
        },
        {
            id: "multi-propiedad",
            question:
                "¿Puedo gestionar varias propiedades si tengo más de un alquiler vacacional?",
            answer: "Sí, totalmente. Desde tu panel de control puedes añadir y gestionar todas las propiedades que quieras de forma independiente, creando una guía digital única y personalizada para cada una de ellas, totalmente gratis.",
        },
        {
            id: "habitacion-rural",
            question:
                "¿Puedo usar BNBexplorer si alquilo una habitación o una casa rural en lugar de un piso en la ciudad?",
            answer: "Sí, sirve para cualquier tipo de alojamiento vacacional: apartamentos urbanos, casas rurales, villas, habitaciones o bungalows. Las recomendaciones locales e instrucciones de uso se adaptan a la ubicación exacta de tu propiedad.",
        },
    ];

    return (
        <>
            <StickyHeader className="bg-white/80 backdrop-blur-md">
                <LandingAppBar className="mx-auto rounded-none shadow-none! max-w-7xl" />
            </StickyHeader>
            <main className="bg-white">
                <section
                    aria-labelledby="welcomeGuide"
                    className="bg-white flex flex-col gap-8 justify-center items-center pt-3 border-b border-gray-100"
                >
                    <BadgeMarketing
                        className="px-4"
                        label="Acceso anticipado gratuito · Sin tarjeta"
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
                            Tu guía de bienvenida responde por tí
                        </Typography>
                        <Typography
                            className="text-center text-lg sm:text-2xl! text-gray-900/60"
                            fontFamily="base"
                            weight="light"
                        >
                            Créala en 2 minutos, 100% gratis, con toda la
                            información que necesitan tus huéspedes sobre tu
                            alquiler vacacional: normas, horarios,
                            recomendaciones locales, chatbot, traducción
                            automática y mucho más.
                        </Typography>
                    </div>
                    <Rating
                        label="+500 anfitriones ya la usan"
                        className="px-4"
                    />
                    <div className="px-4 flex flex-col items-center gap-6 relative w-full pb-12">
                        <Image
                            src="/static/img/home/hero/radar.svg"
                            fill
                            className="object-cover object-top z-0"
                            alt="BBNexplorer"
                        />
                        <ButtonLink
                            href="#"
                            label="Ver una guía real"
                            size="lg"
                            color="white"
                            className="shadow z-5 border border-primary-200"
                            iconRight={<IconOpenInNew />}
                        />
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
                        alt="Blur image"
                        className="z-0 object-cover object-center md:object-fill md:h-full md:w-auto opacity-30"
                    />
                    <BadgeMarketing
                        className="px-4 relative"
                        label="Simple y rápido · Lo hacemos por tí"
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
                            Así de fácil: en sólo 2 minutos
                        </Typography>
                        <Typography
                            className="text-center text-lg sm:text-2xl! text-gray-900/60"
                            fontFamily="base"
                            weight="light"
                        >
                            La experiencia empieza en el minuto cero
                        </Typography>
                    </div>
                    <div className="grid grid-cols-1 grid-rows-1 sm:grid-cols-2 sm:grid-rows-2 gap-2 max-w-[800px] w-full">
                        <Feature
                            color="gradient"
                            number={1}
                            title="Introduce la dirección de tu alquiler vacacional"
                            body="Nuestra IA crea automáticamente una guía con contenido básico en segundos. 100% gratis, sin tarjetas de crédito y al momento."
                            className="border border-gray-100"
                        />
                        <Feature
                            color="gradient"
                            number={2}
                            title="Personaliza la experiencia vacacional de tus huéspedes"
                            body="Sugiere restaurantes, edita las normas, el wifi, cómo usar la barbacoa… ¡hay cientos de opciones!"
                            className="sm:col-start-1 sm:row-start-2 border border-gray-100"
                        />
                        <Feature
                            color="gradient"
                            number={3}
                            title="Comparte el link de tu guía cuando reserven"
                            body="Toda la información que necesitan sobre tu propiedad, en su móvil, para consultar cuando quieran, sin apps ni registros."
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
                            <p className="text-sm font-body">WhatsApp</p>
                        </div>
                        <div className="flex flex-col gap-3 items-center">
                            <FancyIcon
                                icon={<IconMail color="white" />}
                                color="primary"
                            />
                            <p className="text-sm font-body">Email</p>
                        </div>
                        <div className="flex flex-col gap-3 items-center">
                            <FancyIcon
                                icon={<IconChatBubble color="white" />}
                                color="primary"
                            />
                            <p className="text-sm font-body">Redes</p>
                        </div>
                        <div className="flex flex-col gap-3 items-center">
                            <FancyIcon
                                icon={<IconChatBubble color="white" />}
                                color="primary"
                            />
                            <p className="text-sm font-body">Código QR</p>
                        </div>
                    </div>
                    <Typography
                        weight="medium"
                        size="sm"
                        className="w-full max-w-[400px] mx-auto text-center"
                    >
                        WhatsApp, email, mensajería de Airbnb/Booking, redes
                        sociales, o código QR para imprimir en la propiedad.
                    </Typography>
                    <ButtonLink
                        label={t("page_home.mainAction")}
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
                        label="Huésped acompañado · Cercanía"
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
                            Una guía viva, que acompaña a tu huésped en todo
                            momento
                        </Typography>
                        <Typography
                            className="text-center text-lg sm:text-2xl! text-gray-900/60"
                            fontFamily="base"
                            weight="light"
                        >
                            No es solo información. Es sentir que alguien está
                            pendiente de él, aunque tú no estés.
                        </Typography>
                        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-[800px] py-3">
                            <Feature
                                color="gradient"
                                icon={<IconDirections color="white" />}
                                title="Planes a su medida"
                                body="Tus huéspedes deciden qué quieren hacer, cuándo y cómo. Tu guía crea planes personalizados al momento con itinerarios listos para abrir en Google Maps."
                                className="border border-gray-100"
                            />
                            <Feature
                                color="gradient"
                                icon={<IconAlarm color="white" />}
                                title="Recomendaciones según la hora del día"
                                body="Desayuno, comida, cena, aperitivo, planes para pasear o salir de fiesta. Tu guía va cambiando sus recomendaciones en función de la hora local."
                                className="border border-gray-100"
                            />
                            <Feature
                                color="gradient"
                                icon={<IconNightLife color="white" />}
                                title="Los mejores shows cercanos"
                                body="Musicales, monólogos, obras de teatro y mucho más. Todos los espectáculos cercanos de un vistazo con enlace directo a la compra de entradas."
                                className="border border-gray-100"
                            />
                            <Feature
                                color="gradient"
                                icon={<IconLanguage color="white" />}
                                title="Traducciones automáticas"
                                body="Tu guía se adapta al idioma de cada huésped, al instante, sin que tú tengas que traducir nada."
                                className="border border-gray-100"
                            />
                        </div>
                    </div>
                    <ButtonLink
                        label={t("page_home.mainAction")}
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
                            Y aún hay más...
                        </Typography>
                        <Typography
                            className="text-center text-sm font-medium text-gray-900/60 max-w-[400px]"
                            weight="light"
                        >
                            Los pequeños detalles son los que hacen conseguir
                            las mejores valoraciones
                        </Typography>
                    </div>
                    <div className="relative grid grid-cols-2 md:grid-cols-4 lg:grid-flow-col lg:auto-cols-fr w-full max-w-[1000px] py-4 gap-4 items-center">
                        <div className="flex flex-col gap-3 items-center">
                            <FancyIcon
                                icon={<IconChatBubble color="white" />}
                                color="primary"
                            />
                            <p className="text-sm font-body text-center">
                                Un bot inteligente dentro de la guía que
                                responde por ti a tus huéspedes
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 items-center">
                            <FancyIcon
                                icon={<IconApartment color="white" />}
                                color="primary"
                            />
                            <p className="text-sm font-body text-center">
                                Multialojamiento: Crea diferentes guías para más
                                de una propiedad totalmente gratis.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 items-center">
                            <FancyIcon
                                icon={<IconFavorite color="white" />}
                                color="primary"
                            />
                            <p className="text-sm font-body text-center">
                                A tu gusto: Personaliza tu guía con tus fotos.
                                Añade tus restaurantes favoritos, cafés, pubs...
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 items-center">
                            <FancyIcon
                                icon={<IconInterests color="white" />}
                                color="primary"
                            />
                            <p className="text-sm font-body text-center">
                                Todo tipo de categorías claras para que no les
                                falte nada de información a tus huéspedes
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 items-center col-span-full lg:col-span-1 max-w-[300px] mx-auto">
                            <FancyIcon
                                icon={<IconLightMode color="white" />}
                                color="primary"
                            />
                            <p className="text-sm font-body text-center">
                                ¿Lloverá durante las vacaciones? Incluye la
                                previsión meteorológica de hoy y los próximos
                                días.
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
                        label="Huésped acompañado · Cercanía"
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
                                Preguntas frecuentes
                            </Typography>
                            <FaqSection
                                items={faqItems}
                                defaultActiveId="coste-prueba"
                            />
                            <ButtonLink
                                label={t("page_home.mainAction")}
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
                            Tu próxima reseña de 5 estrellas empieza aquí
                        </Typography>
                        <Typography
                            className="text-center text-lg sm:text-2xl! max-w-[600px] mx-auto"
                            fontFamily="base"
                            weight="light"
                        >
                            Crea tu guía gratis en 2 minutos. Sin tarjeta. Sin
                            descargas ni registros para tus huéspedes.
                        </Typography>
                    </div>
                    <ButtonLink
                        label={t("page_home.mainAction")}
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
