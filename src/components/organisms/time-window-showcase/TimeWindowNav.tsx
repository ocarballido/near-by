"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

import IconLightMode from "@/components/atoms/icon/light-mode";
import IconBedtime from "@/components/atoms/icon/bedtime";
import IconAdd from "@/components/atoms/icon/add";

import type { TimeWindowShowcaseSlide } from "./time-window-showcase.data";

// Mirror deliberado de LABEL_KEYS (TimeWindowHeader.tsx, widget real de producción).
// Duplicado en vez de importado para no acoplar este componente de landing al
// componente que sirve a guests reales. Si esas claves cambian allí, deben
// actualizarse aquí también.
const LABEL_KEYS: Record<string, string> = {
    breakfast: "timeWindowBreakfast",
    sightseeing: "timeWindowSightseeing",
    lunch: "timeWindowLunch",
    aperitif: "timeWindowAperitif",
    dinner: "timeWindowDinner",
    nightlife: "timeWindowNightlife",
};

const AUTO_RETURN_DELAY_MS = 5000;

type TimeWindowNavProps = {
    slides: TimeWindowShowcaseSlide[];
    activeIndex: number;
    onSelect: (index: number) => void;
    className?: string;
};

export default function TimeWindowNav({
    slides,
    activeIndex,
    onSelect,
    className = "",
}: TimeWindowNavProps) {
    const t = useTranslations();
    const pillRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
    const userScrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );

    const activeSlide = slides[activeIndex];
    const sunMoonPosition = activeSlide?.sliderPosition ?? 0;

    const scrollActivePillIntoView = () => {
        pillRefs.current.get(activeIndex)?.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest",
        });
    };

    // Re-centra la pill activa cada vez que cambia el índice — aquí cambia
    // constantemente por el autoplay del carrusel, no solo al montar.
    useEffect(() => {
        scrollActivePillIntoView();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeIndex]);

    useEffect(() => {
        return () => {
            if (userScrollTimeoutRef.current) {
                clearTimeout(userScrollTimeoutRef.current);
            }
        };
    }, []);

    const handleManualScroll = () => {
        if (userScrollTimeoutRef.current) {
            clearTimeout(userScrollTimeoutRef.current);
        }
        userScrollTimeoutRef.current = setTimeout(
            scrollActivePillIntoView,
            AUTO_RETURN_DELAY_MS,
        );
    };

    return (
        <div className={`flex w-full min-w-0 flex-col gap-4 ${className}`}>
            <div className="relative flex items-center px-1">
                <span className="drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]">
                    <IconLightMode color="white" size={20} />
                </span>
                <div className="relative mx-2 h-1 flex-1 rounded-full bg-white/30">
                    <div
                        className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white transition-all duration-700 ease-in-out"
                        style={{ left: `calc(${sunMoonPosition}% - 6px)` }}
                    />
                </div>
                <span className="drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]">
                    <IconBedtime color="white" size={20} />
                </span>
            </div>

            <div
                className="flex w-full min-w-0 gap-1 overflow-x-auto pb-1 justify-center"
                onScroll={handleManualScroll}
            >
                {slides.map((slide, index) => {
                    const isActive = index === activeIndex;

                    return (
                        <button
                            key={slide.id}
                            ref={(node) => {
                                if (node) {
                                    pillRefs.current.set(index, node);
                                } else {
                                    pillRefs.current.delete(index);
                                }
                            }}
                            type="button"
                            onClick={() => onSelect(index)}
                            aria-current={isActive ? "true" : undefined}
                            className={`flex shrink-0 items-center gap-1 rounded-full ps-4 pe-3 py-2 text-sm font-bold transition-colors hover:cursor-pointer ${
                                isActive
                                    ? "border-2 border-white bg-white text-black"
                                    : "border-2 border-transparent bg-white/20 text-white hover:bg-white/30"
                            }`}
                        >
                            {t(LABEL_KEYS[slide.id] ?? slide.id)}
                            <IconAdd
                                color={isActive ? "body" : "white"}
                                size={20}
                            />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
