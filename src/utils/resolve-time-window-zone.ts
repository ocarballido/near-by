const IBERIA_TIMEZONES = [
    "Europe/Madrid",
    "Europe/Lisbon",
    "Atlantic/Canary",
    "Europe/Andorra",
] as const;

export type TimeWindowZone = "iberia" | "default";

export function resolveTimeWindowZone(timezone: string | null): TimeWindowZone {
    if (!timezone) return "default";
    return IBERIA_TIMEZONES.includes(
        timezone as (typeof IBERIA_TIMEZONES)[number],
    )
        ? "iberia"
        : "default";
}
