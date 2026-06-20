import { useTranslations, useLocale } from "next-intl";

import { GOOGLE_MAPS_DIRECTION_URL } from "@/config/config-constants";

import IconDirections from "@/components/atoms/icon/directions";
import ButtonLink from "../../button-link";
import Typography from "@/components/atoms/typography";
import IconLocationOn from "@/components/atoms/icon/location-on";
import IconCheckIn from "@/components/atoms/icon/check-in";
import IconCheckOut from "@/components/atoms/icon/check-out";

import { formatDate, formatTime } from "@/utils/format-date-time";

type HousePublicMobileProps = {
    address: string;
    className?: string;
    latitude?: number;
    longitude?: number;
    name: string;
    checkInDate?: string;
    checkInTime?: string;
    checkOutDate?: string;
    checkOutTime?: string;
};

const HousePublicMobile = ({
    address,
    className,
    latitude,
    longitude,
    name,
    checkInDate,
    checkInTime,
    checkOutDate,
    checkOutTime,
}: HousePublicMobileProps) => {
    const t = useTranslations();
    const locale = useLocale();

    return (
        <div
            className={`rounded-xl p-3 flex gap-2 bg-white shadow-xs ${className}`}
        >
            <div className="flex flex-col gap-2 flex-1">
                <div className="flex gap-2 items-center">
                    <span className="grow-0 p-1.5 bg-primary-100 rounded-full h-fit">
                        <IconLocationOn size={18} color="primary" />
                    </span>
                    <Typography size="sm" weight="bold" color="text-gray-600">
                        <b>{name}: </b>
                        {address}
                    </Typography>
                </div>
                {(checkInDate ||
                    checkInTime ||
                    checkOutDate ||
                    checkInTime) && (
                    <div className="flex gap-2 flex-wrap">
                        {(checkInDate || checkInTime) && (
                            <div className="flex gap-2 flex-1 items-center">
                                <span className="grow-0 p-1.5 bg-primary-100 rounded-full h-fit">
                                    <IconCheckIn size={18} color="primary" />
                                </span>
                                <Typography size="sm" color="text-gray-600">
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
                                </Typography>
                            </div>
                        )}
                        {(checkOutDate || checkInTime) && (
                            <div className="flex gap-2 flex-1 items-center">
                                <span className="grow-0 p-1.5 bg-primary-100 rounded-full h-fit">
                                    <IconCheckOut size={18} color="primary" />
                                </span>
                                <Typography size="sm" color="text-gray-600">
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
                                </Typography>
                            </div>
                        )}
                    </div>
                )}
                <ButtonLink
                    className="w-full"
                    color="primary"
                    iconLeft={<IconDirections />}
                    label={t("Como llegar")}
                    href={`${GOOGLE_MAPS_DIRECTION_URL}${latitude},${longitude}`}
                    target="_blank"
                />
            </div>
        </div>
    );
};

export default HousePublicMobile;
