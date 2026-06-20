"use client";

import { useTranslations, useLocale } from "next-intl";

import { formatDate, formatTime } from "@/utils/format-date-time";

import IconHome from "@/components/atoms/icon/home";
import IconCheckIn from "@/components/atoms/icon/check-in";
import IconCheckOut from "@/components/atoms/icon/check-out";
import ButtonLink from "../button-link";
import IconEdit from "@/components/atoms/icon/edit";
import IconApartment from "@/components/atoms/icon/apartment";
import ButtonQr from "../button-qr";

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
    propertyName,
    propertyCheckInDate,
    propertyCheckInTime,
    propertyCheckOutDate,
    propertyCheckOutTime,
}: PropertyDataBoardProps) => {
    const t = useTranslations();
    const locale = useLocale();

    // bg-gradient-to-tr from-[#ffa263] to-[#6cffc9]
    const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL}/public/${propertyId}/welcome/highlights`;

    return (
        <div className="bg-white -mt-0.5 -ms-0.5 -me-0.5 p-3 flex flex-col sm:flex-row gap-2 justify-between shadow-xs relative">
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

            <div className="flex gap-1 justify-end flex-1">
                <ButtonLink
                    label=""
                    href={`/app/properties/edit/${propertyId}?from=manage`}
                    color="secondary"
                    className="px-2.5! h-10 w-full sm:w-fit"
                    iconLeft={<IconEdit size={20} />}
                />
                <ButtonLink
                    label=""
                    href="/app/properties"
                    color="secondary"
                    className="px-2.5! h-10 w-full sm:w-fit"
                    iconLeft={<IconApartment size={20} />}
                />
                <ButtonQr url={publicUrl} />
            </div>
        </div>
    );
};

export default PropertyDataBoard;
