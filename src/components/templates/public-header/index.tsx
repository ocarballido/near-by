import Image from 'next/image';

import { GOOGLE_MAPS_DIRECTION_URL } from '@/config/config-constants';

import IconDirections from '@/components/atoms/icon/directions';
import IconLocationOn from '@/components/atoms/icon/location-on';
import ButtonLink from '@/components/molecules/button-link';
import Typography from '@/components/atoms/typography';

type PublicHeaderProps = {
	address: string;
	className?: string;
	image?: string | null;
	latitude: number;
	longitude: number;
	name: string;
};

const PublicHeader = ({
	address,
	className,
	latitude,
	longitude,
	name,
	image = '/static/img/default-property-2x.webp',
}: PublicHeaderProps) => {
	const graySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><rect width="4" height="4" fill="#a3e7d0" /></svg>`;
	const grayDataUrl = `data:image/svg+xml;base64,${Buffer.from(
		graySvg,
	).toString('base64')}`;

	return (
		<>
			<div
				className={`flex flex-col gap-6 rounded-xl overflow-hidden p-2 relative transition-all bg-gradient-to-tr from-[#ffa263] to-[#6cffc9] ${className} absolute top-0`}
			>
				<div className="content transition-all flex justify-end gap-2 flex-col relative bg-white/70 z-6 min-w-[300px] w-fit p-4 backdrop-blur-xl rounded-lg">
					<Typography component="h1" size="lg">
						{name}
					</Typography>
					<div className="flex gap-1 mb-2 items-center">
						<IconLocationOn size={20} />
						<Typography>{address}</Typography>
					</div>
					<ButtonLink
						label="Como llegar"
						className="w-fit"
						href={`${GOOGLE_MAPS_DIRECTION_URL}${latitude},${longitude}`}
						iconLeft={<IconDirections />}
						target="_blank"
					/>
				</div>
				<Image
					className="object-cover z-0"
					src={
						image === null
							? '/static/img/default-property-2x.webp'
							: image
					}
					fill={true}
					placeholder="blur"
					blurDataURL={grayDataUrl}
					alt={name}
				/>
			</div>
		</>
	);
};

export default PublicHeader;
