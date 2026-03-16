import Feature from '@/components/molecules/card/feature';
import BillboardCarousel from './carousel';
import IconHome from '@/components/atoms/icon/home';

const Billboard = () => {
	return (
		<Feature
			color="gradient"
			icon={<IconHome color="white" />}
			className="md:row-span-2"
			isFeatured
			image="/static/img/5-stars.webp"
			imageMinHeight="250px"
		>
			<BillboardCarousel />
		</Feature>
	);
};

export default Billboard;
