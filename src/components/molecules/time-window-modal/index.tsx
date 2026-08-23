"use client";

import { useTranslations } from "next-intl";
import {
    Dialog,
    DialogPanel,
    DialogBackdrop,
    DialogTitle,
} from "@headlessui/react";

import TimeWindowHeader from "@/components/molecules/time-window-header";
import ButtonLink from "@/components/molecules/button-link";
import IconDirections from "@/components/atoms/icon/directions";
import { buildDirectionsUrl } from "@/utils/build-directions-url";
import {
    resolveTimeWindowGradient,
    resolveTimeWindowGradientForPill,
} from "@/utils/resolve-time-window-gradient";
import { trackClientEvent } from "@/lib/analytics/trackClient";
import type {
    TimeWindowWidgetData,
    TimeWindowPill,
} from "@/types/time-window-widget";
import Button from "../button";

const LABEL_KEYS: Record<string, string> = {
    breakfast: "timeWindowBreakfast",
    sightseeing: "timeWindowSightseeing",
    lunch: "timeWindowLunch",
    aperitif: "timeWindowAperitif",
    dinner: "timeWindowDinner",
    nightlife: "timeWindowNightlife",
};

const IMAGE_BY_PILL_ID: Record<string, string> = {
    breakfast: "/static/img/public-property/breakfast.webp",
    lunch: "/static/img/public-property/breakfast.webp",
    aperitif: "/static/img/public-property/aperitif.webp",
    dinner: "/static/img/public-property/dinner.webp",
    nightlife: "/static/img/public-property/night.webp",
    sightseeing: "/static/img/public-property/sightseeing.webp",
};

type Props = {
    data: TimeWindowWidgetData;
    selectedPill: TimeWindowPill | null;
    onSelectPill: (pill: TimeWindowPill) => void;
    onClose: () => void;
    propertyId: string;
    anonId: string;
};

export default function TimeWindowModal({
    data,
    selectedPill,
    onSelectPill,
    onClose,
    propertyId,
    anonId,
}: Props) {
    const t = useTranslations();

    if (!selectedPill) return null;

    const image =
        IMAGE_BY_PILL_ID[selectedPill.id] ?? IMAGE_BY_PILL_ID.breakfast;

    const gradient =
        selectedPill.id === data.activeWindowId
            ? resolveTimeWindowGradient(data.hourDecimal)
            : resolveTimeWindowGradientForPill(selectedPill.id);

    const handleDirectionsClick = (locationId: string) => {
        void trackClientEvent({
            event: "time_window_directions_clicked",
            distinctId: anonId,
            props: {
                property_id: propertyId,
                pill_id: selectedPill.id,
                location_id: locationId,
            },
        });
    };

    return (
        <Dialog
            open={!!selectedPill}
            onClose={onClose}
            className="relative z-50"
        >
            <DialogBackdrop className="fixed inset-0 bg-gray-200/90" />

            <div className="fixed inset-0 flex items-center justify-center">
                <DialogPanel className="relative mx-auto flex h-full sm:max-h-[720px] w-full sm:max-w-[400px] flex-col overflow-hidden sm:rounded-2xl shadow-xl">
                    <DialogTitle className="sr-only">
                        {t(LABEL_KEYS[selectedPill.id] ?? selectedPill.id)}
                    </DialogTitle>

                    <div
                        className="absolute inset-0 z-0"
                        style={{
                            background: `linear-gradient(to bottom, ${gradient.top}, ${gradient.bottom})`,
                        }}
                    />

                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <div className="absolute left-1/2 top-full w-full -translate-x-1/2 -translate-y-[100%]">
                            <img src={image} alt="" className="h-auto w-full" />
                        </div>
                    </div>

                    <div className="relative z-10 flex h-full flex-col gap-4 overflow-y-auto">
                        <TimeWindowHeader
                            pills={data.pills}
                            activeId={data.activeWindowId}
                            selectedId={selectedPill.id}
                            hourDecimal={data.hourDecimal}
                            onSelectPill={onSelectPill}
                            transparent
                        />

                        <div className="flex flex-col gap-1 p-4 mb-auto">
                            {selectedPill.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between gap-3 rounded-xl bg-gray-100 p-4"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-bold">
                                            {item.name}
                                        </p>
                                        <p className="truncate text-sm font-medium text-gray-600">
                                            {item.address}
                                        </p>
                                    </div>

                                    {item.latitude != null &&
                                        item.longitude != null && (
                                            <div
                                                onClick={() =>
                                                    handleDirectionsClick(
                                                        item.id,
                                                    )
                                                }
                                            >
                                                <ButtonLink
                                                    href={buildDirectionsUrl(
                                                        item.latitude,
                                                        item.longitude,
                                                    )}
                                                    target="_blank"
                                                    label=""
                                                    color="primary"
                                                    iconLeft={
                                                        <IconDirections />
                                                    }
                                                    className="aspect-square !p-0 w-10 h-10 shrink-0"
                                                />
                                            </div>
                                        )}
                                </div>
                            ))}
                        </div>

                        <Button
                            onClick={onClose}
                            label={t("Cerrar")}
                            color="white"
                            className="ms-4 me-4 mb-4"
                        />
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
