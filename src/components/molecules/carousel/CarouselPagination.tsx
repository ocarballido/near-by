'use client';

import { useCarousel } from './carousel.context';

type CarouselPaginationProps = {
	className?: string;
};

export function CarouselPagination({
	className = '',
}: CarouselPaginationProps) {
	const { scrollSnaps, selectedIndex, scrollTo } = useCarousel();

	if (scrollSnaps.length <= 1) return null;

	return (
		<div className={`flex justify-center gap-2 ${className}`}>
			{scrollSnaps.map((_, i) => (
				<button
					key={i}
					type="button"
					onClick={() => scrollTo(i)}
					aria-label={`Ir al slide ${i + 1}`}
					aria-current={i === selectedIndex ? 'true' : undefined}
					className={`w-2 h-2 rounded-full transition-all duration-200 bg-primary-500 ${
						i === selectedIndex
							? 'opacity-100 scale-125'
							: 'opacity-30'
					}`}
				/>
			))}
		</div>
	);
}
