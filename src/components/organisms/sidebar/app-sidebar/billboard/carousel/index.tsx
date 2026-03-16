import { useTranslations } from 'next-intl';

import { Carousel } from '@/components/molecules/carousel';
import { CarouselPagination } from '@/components/molecules/carousel';
import { CarouselSlide } from '@/components/molecules/carousel';
import Typography from '@/components/atoms/typography';
import ButtonLink from '@/components/molecules/button-link';
import IconApartment from '@/components/atoms/icon/apartment';

import { BILLBOARD_CAROUSEL } from '@/config/config-constants';

const BillboardCarousel = () => {
	const t = useTranslations();

	return (
		<div className="w-full">
			<Carousel
				options={{ loop: true }}
				className="min-w-0 -mt-5"
				autoplay={{ delay: 5000, stopOnInteraction: false }}
				showPagination={<CarouselPagination className="mt-6" />}
			>
				{BILLBOARD_CAROUSEL.map((tip) => (
					<CarouselSlide className="pl-4" key={tip.title}>
						<Typography component="h3" className="text-lg! mb-3">
							{t(tip.title)}
						</Typography>
						<Typography size="sm" className="mb-3">
							{t(tip.description)}
						</Typography>
						<ButtonLink
							label={t('Mis propiedades')}
							href={`/app/properties`}
							color="secondary"
							className="w-full"
							iconLeft={<IconApartment />}
						/>
					</CarouselSlide>
				))}
			</Carousel>
		</div>
	);
};

export default BillboardCarousel;
