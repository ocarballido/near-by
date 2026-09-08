import { resolveTimeWindowZone } from "@/utils/resolve-time-window-zone";
import { getLocalHourDecimal } from "@/utils/get-local-hour-decimal";
import { resolveActiveWindow } from "@/utils/resolve-active-time-windows";
import { TIME_WINDOWS_WIDGET } from "@/config/config-constants";

export interface ActiveTimeWindow {
    id: string;
    subCategoryIds: readonly string[];
}

/**
 * Reutiliza exactamente el mismo cálculo que ya usa el widget de horarios
 * de la página pública (fetchTimeWindowWidgetData) — no reimplementa la
 * lógica de zonas ni de franjas, solo la aplica al contexto del chatbot.
 */
export function resolveActiveTimeWindow(
    timezone: string,
): ActiveTimeWindow | null {
    const zone = resolveTimeWindowZone(timezone);
    const hourDecimal = getLocalHourDecimal(timezone);
    const activeWindow = resolveActiveWindow(zone, hourDecimal);

    if (!activeWindow) return null;

    const windowConfig = TIME_WINDOWS_WIDGET.windows.find(
        (w) => w.id === activeWindow.id,
    );
    if (!windowConfig) return null;

    return { id: windowConfig.id, subCategoryIds: windowConfig.subCategoryIds };
}
