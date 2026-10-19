import { useTranslations, useLocale } from "next-intl";

import { GOOGLE_MAPS_DIRECTION_URL } from "@/config/config-constants";

import Image from "next/image";
import IconDirections from "@/components/atoms/icon/directions";
import ButtonLink from "@/components/molecules/button-link";
import IconLocationOn from "@/components/atoms/icon/location-on";
import IconCheckIn from "@/components/atoms/icon/check-in";
import IconCheckOut from "@/components/atoms/icon/check-out";

import { formatDate, formatTime } from "@/utils/format-date-time";

const PROPERTY_IMAGE_PLACEHOLDER = "/static/img/home/why_bnbexplorer.png";

type HousePublicHeroStyle = "primary" | "white";

type HousePublicHeroProps = {
    address: string;
    className?: string;
    latitude: number;
    longitude: number;
    image?: string | null;
    name: string;
    checkInDate?: string;
    checkInTime?: string;
    checkOutDate?: string;
    checkOutTime?: string;
    style?: HousePublicHeroStyle;
};

const containerStyles: Record<HousePublicHeroStyle, string> = {
    primary: "bg-primary-900",
    white: "bg-primary-50",
};

const backgroundImages: Record<HousePublicHeroStyle, string> = {
    primary: "/static/img/house-public-hero/background-primary.jpg",
    white: "/static/img/house-public-hero/background-white.jpg",
};

const propertyImageStyles: Record<HousePublicHeroStyle, string> = {
    primary: "border-primary-800",
    white: "border-white",
};

const textStyles: Record<HousePublicHeroStyle, string> = {
    primary: "text-white",
    white: "text-gray-800",
};

const buttonColors: Record<HousePublicHeroStyle, "white" | "primary"> = {
    primary: "white",
    white: "primary",
};

const HousePublicHero = ({
    address,
    className = "",
    latitude,
    longitude,
    name,
    checkInDate,
    checkInTime,
    checkOutDate,
    checkOutTime,
    image,
    style = "primary",
}: HousePublicHeroProps) => {
    const t = useTranslations();
    const locale = useLocale();

    const hasCheckIn = Boolean(checkInDate || checkInTime);
    const hasCheckOut = Boolean(checkOutDate || checkOutTime);

    return (
        <section
            className={`relative isolate flex w-full flex-col items-center gap-6 overflow-hidden border-b border-gray-100 px-6 py-8 ${containerStyles[style]} ${className}`}
        >
            {/* Fondo decorativo exportado de Figma ya fusionado (elipses + degradado con blend) */}
            <Image
                aria-hidden
                className="pointer-events-none -z-10 object-cover"
                src={backgroundImages[style]}
                fill
                sizes="100vw"
                alt=""
            />

            <div className="flex flex-col items-center">
                <div className="relative -mb-[60px] aspect-[1248/891] w-[360px] max-w-full">
                    <Image
                        className="object-contain"
                        src="/static/img/house-public/house.png"
                        fill
                        sizes="360px"
                        priority
                        alt=""
                    />
                </div>
                <div
                    className={`relative size-24 shrink-0 overflow-hidden rounded-full border-4 bg-white shadow-[0_1px_2px_0_rgb(0_0_0/0.1)] ${propertyImageStyles[style]}`}
                >
                    <Image
                        className="object-cover"
                        src={image || PROPERTY_IMAGE_PLACEHOLDER}
                        fill
                        sizes="96px"
                        alt={name}
                    />
                </div>
            </div>

            <div className="flex w-full flex-col items-center px-4">
                <div className="flex w-full max-w-[400px] flex-col items-center gap-3">
                    {/* h2: el h1 de la guía es el nombre en el appbar */}
                    <h2
                        className={`w-full text-center font-heading font-bold text-2xl leading-tight text-balance break-words md:text-3xl ${textStyles[style]}`}
                    >
                        {name}
                    </h2>
                    <div className="flex w-full items-center gap-2 justify-center">
                        <span
                            aria-hidden
                            className="shrink-0 rounded-full bg-white p-1.5"
                        >
                            <IconLocationOn size={18} color="primary" />
                        </span>
                        <p
                            className={`min-w-0 font-body font-medium text-sm leading-5 break-words ${textStyles[style]}`}
                        >
                            {address}
                        </p>
                    </div>
                    {(hasCheckIn || hasCheckOut) && (
                        <div className="flex w-full flex-wrap items-start justify-center gap-4">
                            {hasCheckIn && (
                                <div className="flex items-center gap-2">
                                    <span
                                        aria-hidden
                                        className="shrink-0 rounded-full bg-white p-1.5"
                                    >
                                        <IconCheckIn
                                            size={18}
                                            color="primary"
                                        />
                                    </span>
                                    <p
                                        className={`font-body font-medium text-sm leading-5 ${textStyles[style]}`}
                                    >
                                        {/* El icono no se anuncia: el lector de pantalla lee esta etiqueta */}
                                        <span className="sr-only">
                                            {t("propertyForm.checkIn")}
                                        </span>
                                        {checkInDate && (
                                            <span className="mr-2">
                                                {formatDate(
                                                    checkInDate,
                                                    locale,
                                                )}
                                            </span>
                                        )}
                                        {checkInTime && (
                                            <span>
                                                {formatTime(
                                                    checkInTime,
                                                    locale,
                                                )}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            )}
                            {hasCheckOut && (
                                <div className="flex items-center gap-2">
                                    <span
                                        aria-hidden
                                        className="shrink-0 rounded-full bg-white p-1.5"
                                    >
                                        <IconCheckOut
                                            size={18}
                                            color="primary"
                                        />
                                    </span>
                                    <p
                                        className={`font-body font-medium text-sm leading-5 ${textStyles[style]}`}
                                    >
                                        <span className="sr-only">
                                            {t("propertyForm.checkOut")}
                                        </span>
                                        {checkOutDate && (
                                            <span className="mr-2">
                                                {formatDate(
                                                    checkOutDate,
                                                    locale,
                                                )}
                                            </span>
                                        )}
                                        {checkOutTime && (
                                            <span>
                                                {formatTime(
                                                    checkOutTime,
                                                    locale,
                                                )}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <ButtonLink
                className="min-h-10"
                color={buttonColors[style]}
                iconLeft={<IconDirections />}
                label={t("Como llegar")}
                href={`${GOOGLE_MAPS_DIRECTION_URL}${latitude},${longitude}`}
                target="_blank"
            />
        </section>
    );
};

export default HousePublicHero;
