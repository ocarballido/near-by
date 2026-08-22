export type TimeWindowGradient = {
    top: string;
    bottom: string;
};

const GRADIENTS: readonly {
    start: number;
    end: number;
    top: string;
    bottom: string;
}[] = [
    { start: 5, end: 9, top: "#1C64F2", bottom: "#FF8A4C" },
    { start: 9, end: 16, top: "#1E429F", bottom: "#76A9FA" },
    { start: 16, end: 20, top: "#1E429F", bottom: "#FF8A4C" },
];

const NIGHT_GRADIENT: TimeWindowGradient = {
    top: "#000000",
    bottom: "#4A1D96",
};

export function resolveTimeWindowGradient(
    hourDecimal: number,
): TimeWindowGradient {
    const match = GRADIENTS.find(
        (g) => hourDecimal >= g.start && hourDecimal < g.end,
    );
    return match ?? NIGHT_GRADIENT;
}

const GRADIENT_BY_PILL_ID: Record<string, TimeWindowGradient> = {
    breakfast: { top: "#1C64F2", bottom: "#FF8A4C" },
    sightseeing: { top: "#1E429F", bottom: "#76A9FA" },
    lunch: { top: "#1E429F", bottom: "#76A9FA" },
    aperitif: { top: "#1E429F", bottom: "#FF8A4C" },
    dinner: { top: "#000000", bottom: "#4A1D96" },
    nightlife: { top: "#000000", bottom: "#4A1D96" },
};

export function resolveTimeWindowGradientForPill(
    pillId: string,
): TimeWindowGradient {
    return GRADIENT_BY_PILL_ID[pillId] ?? NIGHT_GRADIENT;
}
