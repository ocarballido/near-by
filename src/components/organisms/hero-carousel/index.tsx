"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { Carousel } from "@/components/molecules/carousel";
import { CarouselSlide } from "@/components/molecules/carousel";
import { CarouselPaginationTabs } from "@/components/molecules/carousel/carouselPaginationTabs";

export type HeroSlide = {
    id: string;
    src: StaticImageData;
    alt: string;
    label: string; // texto del pill de navegación
};

type HeroCarouselProps = {
    slides: HeroSlide[];
    className?: string;
};

export function HeroCarousel({ slides, className = "" }: HeroCarouselProps) {
    return (
        <Carousel
            options={{ loop: false }}
            className={`w-full ${className}`}
            showPagination={
                <CarouselPaginationTabs
                    items={slides.map(({ id, label }) => ({ id, label }))}
                    className="mt-4"
                />
            }
        >
            {slides.map((slide, index) => (
                <CarouselSlide key={slide.id}>
                    <div
                        className="relative w-full"
                        style={{
                            aspectRatio: `${slide.src.width} / ${slide.src.height}`,
                        }}
                    >
                        <Image
                            src={slide.src}
                            alt={slide.alt}
                            fill
                            sizes="100vw"
                            quality={90}
                            priority={index === 0}
                            className="object-contain"
                        />
                    </div>
                </CarouselSlide>
            ))}
        </Carousel>
    );
}
