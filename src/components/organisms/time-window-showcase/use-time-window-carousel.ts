"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";

type UseTimeWindowCarouselReturn = {
    emblaRef: (node: HTMLElement | null) => void;
    selectedIndex: number;
    canScrollPrev: boolean;
    canScrollNext: boolean;
    scrollPrev: () => void;
    scrollNext: () => void;
    scrollTo: (index: number) => void;
};

/**
 * Wiring de Embla aislado para esta sección de landing, deliberadamente
 * independiente del componente compartido Carousel (@/components/molecules/carousel).
 * Se acepta la duplicación de lógica frente al riesgo de modificar un
 * componente reutilizado en otros puntos del producto sin visibilidad total
 * de esos usos. Navegación 100% manual (sin autoplay).
 */
export function useTimeWindowCarousel(
    options?: EmblaOptionsType,
): UseTimeWindowCarouselReturn {
    const [emblaRef, emblaApi] = useEmblaCarousel(options ?? {});

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const onSelect = useCallback((api: EmblaCarouselType) => {
        setSelectedIndex(api.selectedScrollSnap());
        setCanScrollPrev(api.canScrollPrev());
        setCanScrollNext(api.canScrollNext());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect(emblaApi);
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
        return () => {
            emblaApi.off("select", onSelect);
            emblaApi.off("reInit", onSelect);
        };
    }, [emblaApi, onSelect]);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
    const scrollTo = useCallback(
        (index: number) => emblaApi?.scrollTo(index),
        [emblaApi],
    );

    return {
        emblaRef,
        selectedIndex,
        canScrollPrev,
        canScrollNext,
        scrollPrev,
        scrollNext,
        scrollTo,
    };
}
