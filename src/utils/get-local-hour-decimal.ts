export function getLocalHourDecimal(
    timezone: string,
    date: Date = new Date(),
): number {
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        hour: "numeric",
        minute: "numeric",
        hour12: false,
    });

    const parts = formatter.formatToParts(date);
    const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
    const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);

    return hour + minute / 60;
}
