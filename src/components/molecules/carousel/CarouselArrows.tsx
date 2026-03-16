'use client';

import { useCarousel } from './carousel.context';

type CarouselArrowsProps = {
	className?: string;
	prevIcon?: React.ReactNode;
	nextIcon?: React.ReactNode;
};

export function CarouselArrows({
	className = '',
	prevIcon,
	nextIcon,
}: CarouselArrowsProps) {
	const { canScrollPrev, canScrollNext, scrollPrev, scrollNext } =
		useCarousel();

	return (
		<div className={`flex gap-2 ${className}`}>
			<button
				type="button"
				onClick={scrollPrev}
				disabled={!canScrollPrev}
				aria-label="Slide anterior"
				className="disabled:opacity-30 transition-opacity cursor-pointer"
			>
				{prevIcon ?? (
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<path d="M15 18l-6-6 6-6" />
					</svg>
				)}
			</button>
			<button
				type="button"
				onClick={scrollNext}
				disabled={!canScrollNext}
				aria-label="Slide siguiente"
				className="disabled:opacity-30 transition-opacity cursor-pointer"
			>
				{nextIcon ?? (
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<path d="M9 18l6-6-6-6" />
					</svg>
				)}
			</button>
		</div>
	);
}
