import { TIME_WINDOWS_WIDGET } from "@/config/config-constants";
import type { TimeWindowZone } from "@/utils/resolve-time-window-zone";

type TimeWindow = (typeof TIME_WINDOWS_WIDGET.windows)[number];

function isHourInRange(
    hourDecimal: number,
    range: readonly [number, number],
): boolean {
    const [start, end] = range;

    // Rango cruza medianoche (ej. nightlife: [23, 26])
    if (end > 24) {
        const normalizedHour =
            hourDecimal < start ? hourDecimal + 24 : hourDecimal;
        return normalizedHour >= start && normalizedHour < end;
    }

    return hourDecimal >= start && hourDecimal < end;
}

export function isWindowActive(
    window: TimeWindow,
    zone: TimeWindowZone,
    hourDecimal: number,
): boolean {
    const ranges = window.hours[zone];
    if (!ranges || ranges.length === 0) return false;

    return ranges.some((range) => isHourInRange(hourDecimal, range));
}

export function resolveActiveWindow(
    zone: TimeWindowZone,
    hourDecimal: number,
): TimeWindow | null {
    return (
        TIME_WINDOWS_WIDGET.windows.find((window) =>
            isWindowActive(window, zone, hourDecimal),
        ) ?? null
    );
}
