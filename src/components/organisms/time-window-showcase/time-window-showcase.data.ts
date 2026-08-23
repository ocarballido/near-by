import type { StaticImageData } from "next/image";

import { TIME_WINDOWS_WIDGET } from "@/config/config-constants";

import timeWindow0 from "../../../../public/static/img/home/time-window-0.png";
import timeWindow1 from "../../../../public/static/img/home/time-window-1.png";
import timeWindow2 from "../../../../public/static/img/home/time-window-2.png";
import timeWindow3 from "../../../../public/static/img/home/time-window-3.png";
import timeWindow4 from "../../../../public/static/img/home/time-window-4.png";
import timeWindow5 from "../../../../public/static/img/home/time-window-5.png";

export type TimeWindowShowcaseSlide = {
    /** Coincide con TIME_WINDOWS_WIDGET.windows[].id — único punto de acoplamiento
     *  con la config real, para detectar desincronización si el producto cambia. */
    id: string;
    image: StaticImageData;
    /** Posición (0-100) del indicador sol/luna, derivada del rango horario real. */
    sliderPosition: number;
};

/**
 * Las imágenes están nombradas por posición (time-window-0.png … time-window-5.png),
 * no por id semántico — deben mantenerse en el mismo orden que
 * TIME_WINDOWS_WIDGET.windows (breakfast, sightseeing, lunch, aperitif, dinner, nightlife).
 * Si el orden de `windows` cambia alguna vez, este array debe reordenarse a mano.
 */
const SLIDE_IMAGES_BY_INDEX: StaticImageData[] = [
    timeWindow0,
    timeWindow1,
    timeWindow2,
    timeWindow3,
    timeWindow4,
    timeWindow5,
];

function getRepresentativeSliderPosition(windowId: string): number {
    const window = TIME_WINDOWS_WIDGET.windows.find((w) => w.id === windowId);
    const firstRange = window?.hours.iberia[0];

    if (!firstRange) return 0;

    const [start, end] = firstRange;
    const midpointHour = (start + end) / 2;

    return Math.min(100, Math.max(0, (midpointHour / 24) * 100));
}

/**
 * Slides de la sección de landing "franjas horarias", en el mismo orden que
 * TIME_WINDOWS_WIDGET.windows. Solo datos de marketing (imagen + posición del
 * slider); color e i18n se resuelven en el componente vía las utilidades ya
 * existentes (resolveTimeWindowGradientForPill, LABEL_KEYS) para no duplicar
 * fuente de verdad.
 */
export const TIME_WINDOW_SHOWCASE_SLIDES: TimeWindowShowcaseSlide[] =
    TIME_WINDOWS_WIDGET.windows.map((window, index) => ({
        id: window.id,
        image: SLIDE_IMAGES_BY_INDEX[index],
        sliderPosition: getRepresentativeSliderPosition(window.id),
    }));
