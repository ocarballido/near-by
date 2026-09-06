"use client";

import { Children, isValidElement } from "react";
import { Carousel } from "@/components/molecules/carousel";
import { CarouselSlide } from "@/components/molecules/carousel";
import { CarouselArrows } from "@/components/molecules/carousel";

type FeaturesCarouselProps = {
    /** Cada hijo es una card ya construida (p. ej. <Feature ... />) */
    children: React.ReactNode;
    className?: string;
};

const CARD_MAX_WIDTH = "300px";
const SLIDE_GAP = "1rem";

export function FeaturesCarousel({
    children,
    className = "",
}: FeaturesCarouselProps) {
    return (
        <div className={`w-full max-w-[1280px] mx-auto ${className}`}>
            <Carousel
                options={{ loop: true, align: "center" }}
                gap={SLIDE_GAP}
                className="w-full"
                showArrows={<CarouselArrows className="justify-center mt-6" />}
            >
                {Children.toArray(children).map((child) => (
                    <CarouselSlide
                        key={
                            isValidElement(child)
                                ? (child.key ?? undefined)
                                : undefined
                        }
                        style={{
                            flex: `0 0 ${CARD_MAX_WIDTH}`,
                            minWidth: 0,
                            maxWidth: CARD_MAX_WIDTH,
                            paddingLeft: SLIDE_GAP,
                        }}
                    >
                        {child}
                    </CarouselSlide>
                ))}
            </Carousel>
        </div>
    );
}
