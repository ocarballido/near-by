"use client";

import { useTranslations } from "next-intl";
import Typography from "@/components/atoms/typography";
import Button from "@/components/molecules/button";
import ButtonLink from "../button-link";
import type { ItineraryBlock, ItineraryBlockType } from "@/types/itinerary";
import IconOpenInNew from "@/components/atoms/icon/open-in-new";

type ItineraryTimelineItemProps = {
    block: ItineraryBlock;
    isLast: boolean;
};

const BLOCK_TYPE_STYLES: Record<
    ItineraryBlockType,
    { dotColor: string; dotBorder: string; labelKey: string }
> = {
    breakfast: {
        dotColor: "bg-amber-500",
        dotBorder: "bg-amber-500/10 !text-amber-600",
        labelKey: "Desayuno",
    },
    lunch: {
        dotColor: "bg-orange-500",
        dotBorder: "bg-orange-500/10 !text-orange-600",
        labelKey: "Comida",
    },
    dinner: {
        dotColor: "bg-indigo-500",
        dotBorder: "bg-indigo-500/10 !text-indigo-600",
        labelKey: "Cena",
    },
    activity: {
        dotColor: "bg-sky-500",
        dotBorder: "bg-sky-500/10 !text-sky-600",
        labelKey: "Qué hacer",
    },
};

const buildGoogleMapsDirectionsUrl = (lat: number, lng: number): string =>
    `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

const ItineraryTimelineItem = ({
    block,
    isLast,
}: ItineraryTimelineItemProps) => {
    const t = useTranslations();
    const { dotColor, labelKey, dotBorder } = BLOCK_TYPE_STYLES[block.type];

    const directionsUrl = buildGoogleMapsDirectionsUrl(block.lat, block.lng);

    return (
        <li className="relative flex gap-2">
            <div className="flex mt-4.5 flex-col items-center">
                <span
                    className={`z-10 flex h-4 w-4 border-3 border-gray-50 shrink-0 items-center justify-center rounded-full ${dotColor} text-white`}
                    aria-hidden="true"
                >
                    <span className="h-1 w-1 rounded-full bg-white/90" />
                </span>
                {!isLast && (
                    <span
                        className="w-0.5 flex-1 bg-gray-200 -mb-4.5"
                        aria-hidden="true"
                    />
                )}
            </div>

            <div className="flex-1 pb-2">
                <div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-xs">
                    <div className="flex items-center justify-between gap-2">
                        <Typography
                            component="span"
                            size="xs"
                            weight="semibold"
                            className={`uppercase tracking-wide py-1.5 px-2.5 ${dotBorder} rounded-full ${dotColor}/10`}
                            style={{ lineHeight: "1" }}
                        >
                            {t(labelKey)}
                        </Typography>
                        <time
                            dateTime={block.time}
                            className={`font-semibold text-xs uppercase tracking-wide py-1.5 px-2.5 ${dotBorder} rounded-full ${dotColor}/10`}
                            style={{ lineHeight: "1" }}
                        >
                            {block.time}
                        </time>
                    </div>

                    <div className="fkex fkex-col gap-1">
                        <Typography component="h3" size="base">
                            {block.poiName}
                        </Typography>

                        <Typography
                            component="p"
                            size="sm"
                            color="text-gray-600"
                        >
                            {block.shortDescription}
                        </Typography>
                    </div>

                    <ButtonLink
                        href={directionsUrl}
                        target="_blank"
                        label={t("Como llegar")}
                        color="white"
                        size="sm"
                        // className="w-fit"
                        iconRight={<IconOpenInNew size={16} />}
                    />
                    {/* <a
                        href={directionsUrl}
                        target="_blank"
                        className={`uppercase flex items-center justify-center font-semibold py-2 px-3 text-center text-xs w-fit !${dotBorder} rounded-full ${dotColor}/10`}
                    >
                        {t("Como llegar")}
                    </a> */}
                </div>
            </div>
        </li>
    );
};

export default ItineraryTimelineItem;
