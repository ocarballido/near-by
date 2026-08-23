import Image from "next/image";

import { resolveTimeWindowGradientForPill } from "@/utils/resolve-time-window-gradient";
import blur from "../../../../public/static/img/home/blur.webp";

import type { TimeWindowShowcaseSlide } from "./time-window-showcase.data";

const CROSSFADE_DURATION_MS = 700;

type TimeWindowBackgroundProps = {
    slides: TimeWindowShowcaseSlide[];
    activeIndex: number;
    className?: string;
};

export default function TimeWindowBackground({
    slides,
    activeIndex,
    className = "",
}: TimeWindowBackgroundProps) {
    return (
        <div
            className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
            aria-hidden="true"
        >
            {slides.map((slide, index) => {
                const gradient = resolveTimeWindowGradientForPill(slide.id);
                const isActive = index === activeIndex;

                return (
                    <div
                        key={slide.id}
                        className="absolute inset-0 transition-opacity ease-in-out motion-reduce:transition-none"
                        style={{
                            background: `linear-gradient(to bottom, ${gradient.top}, ${gradient.bottom})`,
                            opacity: isActive ? 1 : 0,
                            zIndex: isActive ? 1 : 0,
                            transitionDuration: `${CROSSFADE_DURATION_MS}ms`,
                        }}
                    />
                );
            })}

            <Image
                src={blur}
                alt=""
                className="absolute bottom-0 left-1/2 z-10 w-full max-w-3xl -translate-x-1/2 select-none opacity-60"
                priority={false}
            />
        </div>
    );
}
