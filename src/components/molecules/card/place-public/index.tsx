import { useTranslations } from 'next-intl';

import Image from 'next/image';
import IconDirections from '@/components/atoms/icon/directions';
import ButtonLink from '../../button-link';

type PlacePublicProps = {
	address: string;
	className?: string;
	href: string;
	image?: string;
	name: string;
};

const PlacePublic = ({
	address,
	className,
	href,
	name,
	image = '/static/img/placeholders/house-placeholder.png',
}: PlacePublicProps) => {
	const t = useTranslations();

	return (
		<div
			className={`w-full flex flex-col gap-4 rounded-xl p-2 relative transition-all hover:bg-gray-100 ${className}`}
		>
			<div className={`w-full flex gap-4 sm:items-center relative`}>
				<div className="w-18 h-18 rounded-md overflow-hidden relative shrink-0">
					<Image
						alt={name}
						className="object-cover z-0 "
						src={image}
						fill
					/>
				</div>
				<div className="flex flex-col gap-0 mr-auto">
					<h5 className="font-heading font-bold text-md">{name}</h5>
					<p className="font-body font-medium text-md mt-0.5 text-secondary-600">
						{address}
					</p>
				</div>
				<ButtonLink
					className="hidden gap-1 sm:flex shrink-0"
					color="primary"
					iconLeft={<IconDirections />}
					label={t('Como llegar')}
					href={href}
				/>
			</div>
			<div className="flex gap-2 w-full sm:hidden">
				<ButtonLink
					className="w-full"
					color="primary"
					iconLeft={<IconDirections />}
					label={t('Como llegar')}
					href={href}
				/>
			</div>
		</div>
	);
};

export default PlacePublic;
