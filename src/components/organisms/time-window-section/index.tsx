"use client";

import { useState } from "react";

import TimeWindowWidget from "@/components/molecules/time-window-widget";
import TimeWindowModal from "@/components/molecules/time-window-modal";
import { trackClientEvent } from "@/lib/analytics/trackClient";
import type {
    TimeWindowWidgetData,
    TimeWindowPill,
} from "@/types/time-window-widget";

type Props = {
    data: TimeWindowWidgetData;
    propertyId: string;
    anonId: string;
};

export default function TimeWindowSection({ data, propertyId, anonId }: Props) {
    const [selectedPill, setSelectedPill] = useState<TimeWindowPill | null>(
        null,
    );

    const handleSelectPill = (pill: TimeWindowPill) => {
        const source = selectedPill ? "modal" : "widget";

        void trackClientEvent({
            event: "time_window_pill_clicked",
            distinctId: anonId,
            props: { property_id: propertyId, pill_id: pill.id, source },
        });

        setSelectedPill(pill);
    };

    const handleClose = () => {
        setSelectedPill(null);
    };

    return (
        <>
            <TimeWindowWidget data={data} onSelectPill={handleSelectPill} />

            <TimeWindowModal
                data={data}
                selectedPill={selectedPill}
                onSelectPill={handleSelectPill}
                onClose={handleClose}
                propertyId={propertyId}
                anonId={anonId}
            />
        </>
    );
}
