"use client";

import { useTranslations, useLocale } from "next-intl";

import { formatDate, formatTime } from "@/utils/format-date-time";

import Image from "next/image";
import BadgeCheck from "@/components/atoms/BadgeCheck";
import IconHome from "@/components/atoms/icon/home";
import IconLocationOn from "@/components/atoms/icon/location-on";
import IconCheckIn from "@/components/atoms/icon/check-in";
import IconCheckOut from "@/components/atoms/icon/check-out";
import ButtonLink from "../button-link";
import IconEdit from "@/components/atoms/icon/edit";
import IconApartment from "@/components/atoms/icon/apartment";
import IconHelp from "@/components/atoms/icon/help";
import IconConstruction from "@/components/atoms/icon/construction";

type PropertyDataBoardProps = {
    propertyId: string;
    categoryId: string;
    subCategoryId: string;
    propertyName: string;
    propertyAddress: string;
    propertyCheckInDate: string;
    propertyCheckInTime: string;
    propertyCheckOutDate: string;
    propertyCheckOutTime: string;
};

const PropertyDataBoard = ({
    propertyId,
    categoryId,
    subCategoryId,
    propertyName,
    propertyAddress,
    propertyCheckInDate,
    propertyCheckInTime,
    propertyCheckOutDate,
    propertyCheckOutTime,
}: PropertyDataBoardProps) => {
    const t = useTranslations();
    const locale = useLocale();

    // bg-gradient-to-tr from-[#ffa263] to-[#6cffc9]

    return (
        <div className="bg-white -mt-0.5 -ms-0.5 -me-0.5 p-3 flex gap-3 flex-col xl:flex-row justify-between shadow-xs relative overflow-hidden">
            <div className="flex gap-4 flex-wrap">
                <div className="col-span-2 xl:col-span-1 flex gap-2 items-center">
                    <div className="shrink-0 flex justify-center items-center p-1.5 rounded-full bg-primary-100">
                        <IconHome size={18} color="primary" />
                    </div>
                    <p className="text-sm font-medium">{propertyName}</p>
                </div>

                {(propertyCheckInDate || propertyCheckInTime) && (
                    <div className="flex gap-2 items-center">
                        <div className="shrink-0 flex justify-center items-center p-1.5 rounded-full bg-primary-100">
                            <IconCheckIn size={18} color="primary" />
                        </div>
                        <p className="text-sm font-medium">{`${propertyCheckInDate ? formatDate(propertyCheckInDate, locale) + " | " : ""} ${propertyCheckInTime ? formatTime(propertyCheckInTime, locale) : ""}`}</p>
                    </div>
                )}

                {(propertyCheckOutDate || propertyCheckOutTime) && (
                    <div className="flex gap-2 items-center">
                        <div className="shrink-0 flex justify-center items-center p-1.5 rounded-full bg-primary-100">
                            <IconCheckOut size={18} color="primary" />
                        </div>
                        <p className="text-sm font-medium">{`${propertyCheckOutDate ? formatDate(propertyCheckOutDate, locale) + " | " : ""} ${propertyCheckOutTime ? formatTime(propertyCheckOutTime, locale) : ""}`}</p>
                    </div>
                )}
            </div>

            <div className="flex flex-col sm:flex-row gap-1 relative z-1 justify-end flex-1">
                <ButtonLink
                    label={t("Editar")}
                    href={`/app/properties/edit/${propertyId}?from=manage`}
                    color="white"
                    className="w-full xl:w-fit"
                    iconLeft={<IconEdit size={20} />}
                />
                <ButtonLink
                    label={t("Mis Propiedades")}
                    href="/app/properties"
                    color="secondary"
                    className="w-full xl:w-fit"
                    iconLeft={<IconApartment size={20} />}
                />
            </div>
        </div>
    );
};

export default PropertyDataBoard;
