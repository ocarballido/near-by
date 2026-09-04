"use client";

import { useCarousel } from "./carousel.context";

type CarouselPaginationVariant = "dot" | "pill";

type CarouselPaginationProps = {
    className?: string;
    variant?: CarouselPaginationVariant;
};

const INDICATOR_BASE_CLASSES =
    "rounded-full transition-all duration-300 ease-out cursor-pointer";

// Solo cambia el aspecto visual; la lógica de estado es compartida.
const VARIANT_CLASSES: Record<
    CarouselPaginationVariant,
    { active: string; inactive: string }
> = {
    dot: {
        active: "w-2 h-2 bg-primary-500 scale-125",
        inactive: "w-2 h-2 bg-primary-500/30 hover:bg-primary-500/50",
    },
    pill: {
        active: "w-6 h-2 bg-primary-500",
        inactive: "w-2 h-2 bg-primary-500/30 hover:bg-primary-500/50",
    },
};

export function CarouselPagination({
    className = "",
    variant = "dot",
}: CarouselPaginationProps) {
    const { scrollSnaps, selectedIndex, scrollTo } = useCarousel();

    if (scrollSnaps.length <= 1) return null;

    const variantClasses = VARIANT_CLASSES[variant];

    return (
        <div className={`flex items-center justify-center gap-2 ${className}`}>
            {scrollSnaps.map((_, index) => {
                const isActive = index === selectedIndex;

                return (
                    <button
                        key={index}
                        type="button"
                        onClick={() => scrollTo(index)}
                        aria-label={`Ir al slide ${index + 1}`}
                        aria-current={isActive ? "true" : undefined}
                        className={`${INDICATOR_BASE_CLASSES} ${
                            isActive
                                ? variantClasses.active
                                : variantClasses.inactive
                        }`}
                    />
                );
            })}
        </div>
    );
}
