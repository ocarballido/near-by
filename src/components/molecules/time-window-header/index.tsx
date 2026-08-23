"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

import IconLightMode from "@/components/atoms/icon/light-mode";
import IconBedtime from "@/components/atoms/icon/bedtime";
import IconKeyboardArrowDown from "@/components/atoms/icon/keyboard-arrow-down";
import IconAdd from "@/components/atoms/icon/add";
import { resolveTimeWindowGradient } from "@/utils/resolve-time-window-gradient";
import type { TimeWindowPill } from "@/types/time-window-widget";

const LABEL_KEYS: Record<string, string> = {
    breakfast: "timeWindowBreakfast",
    sightseeing: "timeWindowSightseeing",
    lunch: "timeWindowLunch",
    aperitif: "timeWindowAperitif",
    dinner: "timeWindowDinner",
    nightlife: "timeWindowNightlife",
};

const AUTO_RETURN_DELAY_MS = 5000;

type Props = {
    pills: TimeWindowPill[];
    activeId: string | null;
    selectedId?: string | null;
    hourDecimal: number;
    onSelectPill: (pill: TimeWindowPill) => void;
    transparent?: boolean;
};

export default function TimeWindowHeader({
    pills,
    activeId,
    selectedId = null,
    hourDecimal,
    onSelectPill,
    transparent = false,
}: Props) {
    const t = useTranslations();
    const activePillRef = useRef<HTMLButtonElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const gradient = resolveTimeWindowGradient(hourDecimal);
    const sunMoonPosition = Math.min(
        100,
        Math.max(0, (hourDecimal / 24) * 100),
    );

    const scrollToActive = () => {
        activePillRef.current?.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest",
        });
    };

    useEffect(() => {
        scrollToActive();
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleScroll = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(scrollToActive, AUTO_RETURN_DELAY_MS);
    };

    return (
        <div
            className="flex w-full min-w-0 flex-col gap-4 rounded-lg p-4"
            style={
                transparent
                    ? undefined
                    : {
                          background: `linear-gradient(to bottom, ${gradient.top}, ${gradient.bottom})`,
                      }
            }
        >
            <div className="relative flex items-center px-1">
                <span className="drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]">
                    <IconLightMode color="white" size={20} />
                </span>
                <div className="relative mx-2 h-1 flex-1 rounded-full bg-white/30">
                    <div
                        className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white"
                        style={{ left: `calc(${sunMoonPosition}% - 6px)` }}
                    />
                </div>
                <span className="drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]">
                    <IconBedtime color="white" size={20} />
                </span>
            </div>

            <div
                className="flex w-full min-w-0 gap-1 overflow-x-auto pb-1"
                onScroll={handleScroll}
            >
                {pills.map((pill) => {
                    const isRealActive = pill.id === activeId;
                    const isSelected = pill.id === selectedId;

                    const stateClasses = isRealActive
                        ? "border-2 border-white bg-white text-black"
                        : isSelected
                          ? "border-2 border-white bg-white/20 text-white"
                          : "border-2 border-transparent bg-white/20 text-white hover:bg-white/30";

                    return (
                        <button
                            key={pill.id}
                            ref={isRealActive ? activePillRef : undefined}
                            onClick={() => onSelectPill(pill)}
                            className={`flex shrink-0 items-center gap-1 rounded-full ps-4 pe-3 py-2 text-sm font-bold transition-colors hover:cursor-pointer ${stateClasses}`}
                        >
                            {t(LABEL_KEYS[pill.id] ?? pill.id)}
                            <IconAdd
                                color={isRealActive ? "body" : "white"}
                                size={20}
                            />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
