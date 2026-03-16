'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
import type { AutoplayOptionsType } from 'embla-carousel-autoplay';
import { CarouselContext } from './carousel.context';

type CarouselProps = {
	children: React.ReactNode;
	options?: EmblaOptionsType;
	autoplay?: boolean | AutoplayOptionsType;
	showArrows?: React.ReactNode;
	showPagination?: React.ReactNode;
	className?: string;
};

export function Carousel({
	children,
	options,
	autoplay = false,
	showArrows,
	showPagination,
	className = '',
}: CarouselProps) {
	const plugins = useMemo(() => {
		if (!autoplay) return [];
		const opts: AutoplayOptionsType =
			typeof autoplay === 'object'
				? autoplay
				: { delay: 4000, stopOnInteraction: true };
		return [Autoplay(opts)];
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const [emblaRef, emblaApi] = useEmblaCarousel(options ?? {}, plugins);

	const [selectedIndex, setSelectedIndex] = useState(0);
	const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
	const [canScrollPrev, setCanScrollPrev] = useState(false);
	const [canScrollNext, setCanScrollNext] = useState(false);

	const onSelect = useCallback((api: EmblaCarouselType) => {
		setSelectedIndex(api.selectedScrollSnap());
		setCanScrollPrev(api.canScrollPrev());
		setCanScrollNext(api.canScrollNext());
	}, []);

	useEffect(() => {
		if (!emblaApi) return;
		setScrollSnaps(emblaApi.scrollSnapList());
		onSelect(emblaApi);
		emblaApi.on('select', onSelect);
		emblaApi.on('reInit', onSelect);
		return () => {
			emblaApi.off('select', onSelect);
			emblaApi.off('reInit', onSelect);
		};
	}, [emblaApi, onSelect]);

	const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
	const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
	const scrollTo = useCallback(
		(i: number) => emblaApi?.scrollTo(i),
		[emblaApi],
	);

	return (
		<CarouselContext.Provider
			value={{
				emblaApi,
				selectedIndex,
				scrollSnaps,
				canScrollPrev,
				canScrollNext,
				scrollPrev,
				scrollNext,
				scrollTo,
			}}
		>
			<div
				className={`relative ${className}`}
				style={{
					minWidth: 0,
				}} /* evita desbordamiento en contextos flex/grid */
			>
				{/* VIEWPORT — overflow hidden via style, no Tailwind */}
				<div
					ref={emblaRef}
					style={{ overflow: 'hidden', width: '100%' }}
				>
					{/* CONTAINER — todo via style, nada de Tailwind aquí */}
					<div
						style={{
							display: 'flex',
							touchAction: 'pan-y pinch-zoom',
						}}
					>
						{children}
					</div>
				</div>

				{showArrows}
				{showPagination}
			</div>
		</CarouselContext.Provider>
	);
}
