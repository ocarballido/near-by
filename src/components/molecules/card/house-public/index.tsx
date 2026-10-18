import { useTranslations, useLocale } from "next-intl";

import { GOOGLE_MAPS_DIRECTION_URL } from "@/config/config-constants";

import Image from "next/image";
import IconDirections from "@/components/atoms/icon/directions";
import ButtonLink from "../../button-link";
import IconLocationOn from "@/components/atoms/icon/location-on";
import IconCheckIn from "@/components/atoms/icon/check-in";
import IconCheckOut from "@/components/atoms/icon/check-out";

import { formatDate, formatTime } from "@/utils/format-date-time";

const PROPERTY_IMAGE_PLACEHOLDER = "/static/img/home/why_bnbexplorer.png";

type HousePublicProps = {
    address: string;
    className?: string;
    latitude?: number;
    longitude?: number;
    image?: string | null;
    name: string;
    checkInDate?: string;
    checkInTime?: string;
    checkOutDate?: string;
    checkOutTime?: string;
};

const HousePublic = ({
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
}: HousePublicProps) => {
    const t = useTranslations();
    const locale = useLocale();

    const hasCheckIn = Boolean(checkInDate || checkInTime);
    const hasCheckOut = Boolean(checkOutDate || checkOutTime);

    return (
        <div
            className={`relative isolate flex flex-col items-center overflow-hidden rounded-2xl bg-primary-900 px-6 py-8 shadow-house-card h-fit ${className}`}
        >
            {/* Fondo decorativo exportado de Figma ya fusionado (elipses + degradado) */}
            <Image
                aria-hidden
                className="pointer-events-none -z-10 object-cover"
                src="/static/img/house-public/background.jpg"
                fill
                sizes="(min-width: 768px) 460px, 100vw"
                alt=""
            />

            <div className="flex w-full flex-col items-center">
                <div className="relative -mb-[60px] aspect-[1248/891] w-full max-w-[360px]">
                    <Image
                        className="object-contain"
                        src="/static/img/house-public/house.png"
                        fill
                        sizes="360px"
                        priority
                        alt=""
                    />
                </div>
                <div className="relative size-24 shrink-0 overflow-hidden rounded-full border-4 border-white bg-white shadow-house-image">
                    <Image
                        className="object-cover"
                        src={image || PROPERTY_IMAGE_PLACEHOLDER}
                        fill
                        sizes="96px"
                        alt={name}
                    />
                </div>
            </div>

            <div className="flex w-full flex-col gap-4 p-4">
                <div className="flex w-full flex-col gap-3">
                    <h2 className="font-heading font-bold text-base leading-5 text-white break-words">
                        {name}
                    </h2>
                    <div className="flex w-full items-start gap-2">
                        <span className="shrink-0 rounded-full bg-primary-500 p-1.5">
                            <IconLocationOn size={18} color="white" />
                        </span>
                        <p className="min-w-0 flex-1 font-body font-medium text-sm leading-5 text-white break-words">
                            {address}
                        </p>
                    </div>
                    {(hasCheckIn || hasCheckOut) && (
                        <div className="flex w-full flex-wrap items-start gap-2">
                            {hasCheckIn && (
                                <div className="flex min-w-0 flex-1 items-start gap-2">
                                    <span className="shrink-0 rounded-full bg-primary-500 p-1.5">
                                        <IconCheckIn size={18} color="white" />
                                    </span>
                                    <p className="min-w-0 flex-1 font-body font-medium text-sm leading-5 text-white">
                                        {checkInDate && (
                                            <span className="mr-2">
                                                {formatDate(checkInDate, locale)}
                                            </span>
                                        )}
                                        {checkInTime && (
                                            <span>
                                                {formatTime(checkInTime, locale)}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            )}
                            {hasCheckOut && (
                                <div className="flex min-w-0 flex-1 items-start gap-2">
                                    <span className="shrink-0 rounded-full bg-primary-500 p-1.5">
                                        <IconCheckOut size={18} color="white" />
                                    </span>
                                    <p className="min-w-0 flex-1 font-body font-medium text-sm leading-5 text-white">
                                        {checkOutDate && (
                                            <span className="mr-2">
                                                {formatDate(checkOutDate, locale)}
                                            </span>
                                        )}
                                        {checkOutTime && (
                                            <span>
                                                {formatTime(checkOutTime, locale)}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <ButtonLink
                    className="w-full min-h-10"
                    color="white"
                    iconLeft={<IconDirections />}
                    label={t("Como llegar")}
                    href={`${GOOGLE_MAPS_DIRECTION_URL}${latitude},${longitude}`}
                    target="_blank"
                />
            </div>
        </div>
    );
};

export default HousePublic;
