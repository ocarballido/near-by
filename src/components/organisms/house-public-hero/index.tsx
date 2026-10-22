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
};

type HeroBlob = {
    className: string;
    // Desfase propio para que las manchas con la misma animación no se muevan a la par
    delay?: string;
};

// Manchas de color difuminadas (sustituyen al PNG de Figma). Posición = centro de la mancha
const blobs: HeroBlob[] = [
    // Acento lavanda (puente entre el azul y el melocotón). Primera del array para que
    // el verde de marca quede por encima y siga dominando
    {
        className:
            "left-[82%] top-[15%] animate-blob-drift-a bg-[radial-gradient(closest-side,rgb(200_185_250/0.7),transparent)]",
        delay: "-5s",
    },
    {
        className:
            "left-[25%] top-[72%] animate-blob-drift-a bg-[radial-gradient(closest-side,rgb(240_200_150/0.8),transparent)]",
    },
    {
        className:
            "left-[40%] top-[55%] animate-blob-orbit bg-[radial-gradient(closest-side,rgb(120_235_195/0.7),transparent)]",
    },
    {
        className:
            "left-[62%] top-[80%] animate-blob-drift-b bg-[radial-gradient(closest-side,rgb(140_220_240/0.7),transparent)]",
    },
    {
        className:
            "left-[74%] top-[50%] animate-blob-drift-a bg-[radial-gradient(closest-side,rgb(110_240_200/0.7),transparent)]",
        delay: "-11s",
    },
    {
        className:
            "left-[35%] top-[5%] animate-blob-drift-b bg-[radial-gradient(closest-side,rgb(190_225_240/0.7),transparent)]",
        delay: "-9s",
    },
];

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
}: HousePublicHeroProps) => {
    const t = useTranslations();
    const locale = useLocale();

    const hasCheckIn = Boolean(checkInDate || checkInTime);
    const hasCheckOut = Boolean(checkOutDate || checkOutTime);

    return (
        <section
            className={`relative isolate flex w-full flex-col items-center gap-6 overflow-hidden px-6 pt-10 pb-25 bg-primary-50 ${className}`}
        >
            {/* Fondo decorativo animado: manchas de color en movimiento y, encima,
                las elipses semitransparentes para que el color se vea a través */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
            >
                {blobs.map((blob) => (
                    <div
                        key={blob.className}
                        className={`absolute aspect-[3/2] w-[max(80%,600px)] -translate-x-1/2 -translate-y-1/2 motion-reduce:animate-none ${blob.className}`}
                        style={
                            blob.delay
                                ? { animationDelay: blob.delay }
                                : undefined
                        }
                    />
                ))}
                {/* Encuadre de las elipses con "slice": equivale al object-cover
                    del fondo de Figma (viewBox = proporción del diseño original) */}
                <svg
                    className="absolute inset-0 size-full opacity-40"
                    viewBox="0 0 2000 781"
                    preserveAspectRatio="xMidYMid slice"
                >
                    <image
                        href="/static/img/house-public-hero/radar.svg"
                        x="-99"
                        y="133"
                        width="2198"
                        height="957"
                    />
                </svg>
            </div>

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
                    className="relative size-24 shrink-0 overflow-hidden rounded-full border-4 border-white bg-white shadow-[0_1px_2px_0_rgb(0_0_0/0.1)]"
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
                        className="w-full text-center font-heading font-bold text-2xl leading-tight text-balance break-words text-gray-800 md:text-3xl"
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
                            className="min-w-0 font-body font-medium text-sm leading-5 break-words text-gray-800"
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
                                        className="font-body font-medium text-sm leading-5 text-gray-800"
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
                                        className="font-body font-medium text-sm leading-5 text-gray-800"
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
                color="primary"
                iconLeft={<IconDirections />}
                label={t("Como llegar")}
                href={`${GOOGLE_MAPS_DIRECTION_URL}${latitude},${longitude}`}
                target="_blank"
            />
        </section>
    );
};

export default HousePublicHero;
