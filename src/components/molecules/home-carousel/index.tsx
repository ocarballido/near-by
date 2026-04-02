'use client';

import Image from 'next/image';
import { Carousel, CarouselSlide } from '@/components/molecules/carousel';

const HomeCarousel = () => {
	return (
		<div className=" inset-0 pointer-events-none">
			<Carousel
				options={{ loop: true }}
				fade
				className="h-full w-full"
				autoplay={{
					delay: 3000,
					stopOnInteraction: false,
					stopOnMouseEnter: false,
				}}
			>
				<CarouselSlide className="relative h-full min-h-[600px] md:min-h-[800px] lg:min-h-[900px]">
					<Image
						src="/static/img/home/cave_carousel.webp"
						fill={true}
						alt="Cave"
						className="object-cover"
					/>
				</CarouselSlide>
				<CarouselSlide className="relative h-full min-h-[600px] md:min-h-[800px] lg:min-h-[900px]">
					<Image
						src="/static/img/home/toys_carousel.webp"
						fill={true}
						alt="Cave"
						className="object-cover"
					/>
				</CarouselSlide>
				<CarouselSlide className="relative h-full min-h-[600px] md:min-h-[800px] lg:min-h-[900px]">
					<Image
						src="/static/img/home/celular_carousel.webp"
						fill={true}
						alt="Cave"
						className="object-cover"
					/>
				</CarouselSlide>
				<CarouselSlide className="relative h-full min-h-[600px] md:min-h-[800px] lg:min-h-[900px]">
					<Image
						src="/static/img/home/space_carousel.webp"
						fill={true}
						alt="Cave"
						className="object-cover"
					/>
				</CarouselSlide>
				<CarouselSlide className="relative h-full min-h-[600px] md:min-h-[800px] lg:min-h-[900px]">
					<Image
						src="/static/img/home/iceberg_carousel.webp"
						fill={true}
						alt="Cave"
						className="object-cover"
					/>
				</CarouselSlide>
				<CarouselSlide className="relative h-full min-h-[600px] md:min-h-[800px] lg:min-h-[900px]">
					<Image
						src="/static/img/home/mountain_carousel.webp"
						fill={true}
						alt="Cave"
						className="object-cover"
					/>
				</CarouselSlide>
			</Carousel>
		</div>
	);
};

export default HomeCarousel;
