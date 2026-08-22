"use client";

import { useState } from "react";

import TimeWindowWidget from "@/components/molecules/time-window-widget";
import TimeWindowModal from "@/components/molecules/time-window-modal";
import type {
    TimeWindowWidgetData,
    TimeWindowPill,
} from "@/types/time-window-widget";

type Props = {
    data: TimeWindowWidgetData;
};

export default function TimeWindowSection({ data }: Props) {
    const [selectedPill, setSelectedPill] = useState<TimeWindowPill | null>(
        null,
    );

    const handleSelectPill = (pill: TimeWindowPill) => {
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
            />
        </>
    );
}
