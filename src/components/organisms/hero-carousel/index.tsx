"use client";

import { getImageProps } from "next/image";
import type { StaticImageData } from "next/image";
import { Carousel } from "@/components/molecules/carousel";
import { CarouselSlide } from "@/components/molecules/carousel";
import { CarouselPaginationTabs } from "@/components/molecules/carousel/carouselPaginationTabs";
import styles from "./hero-slide-frame.module.css";

export type HeroSlideImages = {
    desktop: StaticImageData;
    mobile: StaticImageData;
};

export type HeroSlide = {
    id: string;
    images: HeroSlideImages;
    alt: string;
    label: string; // texto del pill de navegación
};

type HeroCarouselProps = {
    slides: HeroSlide[];
    className?: string;
};

// Debe coincidir con el breakpoint `md` de Tailwind, para que la lógica
// de "qué imagen se sirve" y "qué layout ve el usuario" nunca diverjan.
const MOBILE_MAX_WIDTH = 767;

function HeroSlidePicture({
    images,
    alt,
    priority,
}: {
    images: HeroSlideImages;
    alt: string;
    priority: boolean;
}) {
    const common = {
        alt,
        fill: true as const,
        sizes: "100vw",
        quality: 90,
        priority,
        className: "object-contain",
    };

    const {
        props: { srcSet: desktopSrcSet },
    } = getImageProps({ ...common, src: images.desktop });
    const {
        props: { srcSet: mobileSrcSet, ...imgProps },
    } = getImageProps({ ...common, src: images.mobile });

    return (
        // display:contents — el <picture> no debe generar su propia caja;
        // el <img> con fill necesita que el div.relative de fuera sea su
        // ancestro posicionado más cercano, sin nada intermedio raro.
        <picture className="contents">
            <source
                media={`(min-width: ${MOBILE_MAX_WIDTH + 1}px)`}
                srcSet={desktopSrcSet}
            />
            <source
                media={`(max-width: ${MOBILE_MAX_WIDTH}px)`}
                srcSet={mobileSrcSet}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img {...imgProps} alt={alt} />
        </picture>
    );
}

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
                        className={`relative w-full ${styles.frame}`}
                        style={
                            {
                                "--mobile-ratio": `${slide.images.mobile.width} / ${slide.images.mobile.height}`,
                                "--desktop-ratio": `${slide.images.desktop.width} / ${slide.images.desktop.height}`,
                            } as React.CSSProperties
                        }
                    >
                        <HeroSlidePicture
                            images={slide.images}
                            alt={slide.alt}
                            priority={index === 0}
                        />
                    </div>
                </CarouselSlide>
            ))}
        </Carousel>
    );
}
