"use client";

import TimeWindowHeader from "@/components/molecules/time-window-header";
import type {
    TimeWindowWidgetData,
    TimeWindowPill,
} from "@/types/time-window-widget";

type Props = {
    data: TimeWindowWidgetData;
    onSelectPill?: (pill: TimeWindowPill) => void;
    edgeOffsetClassName?: string;
};

export default function TimeWindowWidget({
    data,
    onSelectPill,
    edgeOffsetClassName,
}: Props) {
    return (
        <TimeWindowHeader
            pills={data.pills}
            activeId={data.activeWindowId}
            hourDecimal={data.hourDecimal}
            onSelectPill={(pill) => onSelectPill?.(pill)}
        />
    );
}
