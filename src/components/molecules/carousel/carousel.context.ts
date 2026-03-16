import { createContext, useContext } from 'react';
import type { EmblaCarouselType } from 'embla-carousel';

type CarouselContextValue = {
	emblaApi: EmblaCarouselType | undefined;
	selectedIndex: number;
	scrollSnaps: number[];
	canScrollPrev: boolean;
	canScrollNext: boolean;
	scrollPrev: () => void;
	scrollNext: () => void;
	scrollTo: (index: number) => void;
};

export const CarouselContext = createContext<CarouselContextValue | null>(null);

export function useCarousel() {
	const ctx = useContext(CarouselContext);
	if (!ctx) throw new Error('useCarousel must be used inside <Carousel>');
	return ctx;
}
