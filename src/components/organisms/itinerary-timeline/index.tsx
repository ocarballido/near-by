// src/components/organisms/itinerary-timeline/index.tsx
"use client";

import { useState } from "react";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import Typography from "@/components/atoms/typography";
import ButtonLink from "@/components/molecules/button-link";
import ItineraryTimelineItem from "@/components/molecules/itinerary-timeline-item";
import { buildDayRouteUrl } from "@/utils/build-day-route-url";
import type { Itinerary } from "@/types/itinerary";

type ItineraryTimelineProps = {
    itinerary: Itinerary;
    transport: string;
};

const ItineraryTimeline = ({
    itinerary,
    transport,
}: ItineraryTimelineProps) => {
    const t = useTranslations();
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);

    const hasMultipleDays = itinerary.days.length > 1;
    const selectedDay = itinerary.days[selectedDayIndex] ?? itinerary.days[0];
    const dayRouteUrl = buildDayRouteUrl(selectedDay, transport);

    return (
        <div className="flex flex-col gap-4">
            {hasMultipleDays && (
                <div
                    role="tablist"
                    aria-label={t("Días del itinerario")}
                    className="flex w-full rounded-3xl bg-white p-1 gap-1 shadow-xs"
                >
                    {itinerary.days.map((day, index) => {
                        const isSelected = index === selectedDayIndex;
                        const tabId = `itinerary-day-tab-${day.dayNumber}`;
                        const panelId = `itinerary-day-panel-${day.dayNumber}`;

                        return (
                            <button
                                key={day.dayNumber}
                                type="button"
                                role="tab"
                                id={tabId}
                                aria-selected={isSelected}
                                aria-controls={panelId}
                                onClick={() => setSelectedDayIndex(index)}
                                className={clsx(
                                    "flex-1 rounded-full px-4 py-1.5 text-md font-medium min-w-0",
                                    "flex items-center justify-center transition-colors hover:cursor-pointer",
                                    isSelected
                                        ? "bg-primary-100"
                                        : "bg-transparent text-gray-800 hover:bg-primary-50",
                                )}
                            >
                                <Typography
                                    component="span"
                                    className="truncate uppercase"
                                    weight="semibold"
                                    size="sm"
                                >
                                    {t("Día {number}", {
                                        number: day.dayNumber,
                                    })}
                                </Typography>
                            </button>
                        );
                    })}
                </div>
            )}

            <div
                role={hasMultipleDays ? "tabpanel" : undefined}
                id={
                    hasMultipleDays
                        ? `itinerary-day-panel-${selectedDay.dayNumber}`
                        : undefined
                }
                aria-labelledby={
                    hasMultipleDays
                        ? `itinerary-day-tab-${selectedDay.dayNumber}`
                        : undefined
                }
                className="flex flex-col gap-4"
            >
                <ol className="flex flex-col">
                    {selectedDay.blocks.map((block, index) => (
                        <ItineraryTimelineItem
                            key={`${selectedDay.dayNumber}-${block.poiName}-${block.time}`}
                            block={block}
                            isLast={index === selectedDay.blocks.length - 1}
                        />
                    ))}
                </ol>

                {dayRouteUrl && (
                    <ButtonLink
                        href={dayRouteUrl}
                        target="_blank"
                        label={t("Ver ruta completa en Google Maps")}
                        color="primary"
                        className="w-fit mx-auto -mt-4"
                        size="md"
                    />
                )}
            </div>

            <Typography
                component="p"
                size="sm"
                color="text-primary-800"
                className="flex flex-col gap-2 p-4 bg-primary-100 rounded-lg"
            >
                {itinerary.closingNote}
            </Typography>
        </div>
    );
};

export default ItineraryTimeline;
