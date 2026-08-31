import { useTranslations, useLocale } from "next-intl";

import Image from "next/image";
import IconLocationOn from "@/components/atoms/icon/location-on";
import IconDelete from "@/components/atoms/icon/delete";
import IconEdit from "@/components/atoms/icon/edit";
import IconCheckIn from "@/components/atoms/icon/check-in";
import IconCheckOut from "@/components/atoms/icon/check-out";
import ButtonLink from "../../button-link";
import PropertySteps from "../../property-steps";
import PropertyTierBadge from "../../property-tier-badge";
import Typography from "@/components/atoms/typography";
import ShareButton from "../../share-property-button";

import { formatDate, formatTime } from "@/utils/format-date-time";
import IconConstruction from "@/components/atoms/icon/construction";
import ButtonIcon from "@/components/atoms/button-icon";
import type { PropertyTier } from "@/config/config-constants";

type HouseProps = {
    address: string;
    className?: string;
    handleDelete?: () => void;
    href?: string;
    propertyId?: string;
    image?: string | null;
    name: string;
    deleatable?: boolean;
    editeable?: boolean;
    hasLocation?: boolean;
    hasInfo?: boolean;
    checkInDate?: string;
    checkInTime?: string;
    checkOutDate?: string;
    checkOutTime?: string;
    distinctId?: string;
    tier?: PropertyTier;
    onOpenTierModal?: () => void;
};

const House = ({
    address,
    className,
    handleDelete,
    href,
    propertyId,
    name,
    deleatable = true,
    editeable = true,
    hasLocation,
    hasInfo,
    checkInDate,
    checkInTime,
    checkOutDate,
    checkOutTime,
    distinctId = "",
    image = "/static/img/header-trimed-2x.webp",
    tier,
    onOpenTierModal,
}: HouseProps) => {
    const t = useTranslations();
    const locale = useLocale();

    const isActivated = Boolean(hasInfo && hasLocation);

    const graySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><rect width="4" height="4" fill="#a3e7d0" /></svg>`;
    const grayDataUrl = `data:image/svg+xml;base64,${Buffer.from(
        graySvg,
    ).toString("base64")}`;

    return (
        <div
            className={`group relative flex flex-col justify-start rounded-2xl overflow-hidden shadow-xs bg-white h-fit ${className}`}
        >
            <div className="aspect-[4/3] p-1 overflow-hidden relative rounded-xl mx-1 mt-1 bg-gradient-to-tr from-[#ffa263] to-[#6cffc9]">
                <Image
                    className="absolute inset-0 object-cover z-0 transition-transform duration-300 ease-out group-hover:scale-105"
                    src={image === null ? "/static/img/heroMobile.webp" : image}
                    fill={true}
                    placeholder="blur"
                    blurDataURL={grayDataUrl}
                    alt={name}
                />
                {isActivated && tier && (
                    <PropertyTierBadge
                        tier={tier}
                        onOpenModal={onOpenTierModal}
                    />
                )}
            </div>

            <div className="relative w-full px-5 pb-6 pt-4 flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                    <Typography component="h5">{name}</Typography>
                </div>
                <div className="flex gap-2 items-center">
                    <span className="grow-0 p-1.5 bg-primary-100 rounded-full h-fit">
                        <IconLocationOn color="primary" size={18} />
                    </span>
                    <Typography size="sm" weight="medium" color="text-gray-600">
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
                                <Typography
                                    size="sm"
                                    color="text-gray-600"
                                    weight="medium"
                                >
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
                                <Typography
                                    size="sm"
                                    weight="medium"
                                    color="text-gray-600"
                                >
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

                {!isActivated && (
                    <PropertySteps
                        hasLocation={hasLocation || false}
                        hasInfo={hasInfo || false}
                    />
                )}

                <div className="flex gap-2 w-full mt-2">
                    {/* <ButtonLink
                        iconLeft={<IconEdit />}
                        label={t("Editar")}
                        href={`/app/properties/edit/${propertyId}?from=properties`}
                        color="secondary"
                        className="w-full"
                    /> */}
                    {deleatable && (
                        <ButtonIcon
                            icon={<IconDelete />}
                            onClick={handleDelete}
                            color="error"
                            className="bg-white top-3 left-3 z-5"
                        />
                    )}
                    {editeable && href && (
                        <ButtonLink
                            className="w-full"
                            label={t("manage")}
                            href={href}
                            iconLeft={<IconConstruction />}
                        />
                    )}
                    <ShareButton
                        propertyId={propertyId ?? ""}
                        name={name}
                        distinctId={distinctId}
                    />
                </div>
            </div>
        </div>
    );
};

export default House;
