import Image from 'next/image';

import { GOOGLE_MAPS_DIRECTION_URL } from '@/config/config-constants';

import IconDirections from '@/components/atoms/icon/directions';
import IconLocationOn from '@/components/atoms/icon/location-on';
import ButtonLink from '@/components/molecules/button-link';

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
		graySvg
	).toString('base64')}`;

	return (
		<>
			<div
				className={`flex flex-col gap-6 rounded-xl overflow-hidden p-4 relative transition-all [&>.content]:p-3 [&>.content]:rounded-lg ${className}`}
			>
				<h2 className="z-6 text-white font-bold font-heading text-2xl">
					{name}
				</h2>
				<div className="content transition-all flex justify-end gap-2 flex-col relative bg-white z-6 min-w-[300px] w-fit">
					<div className="w-20 h-20 relative rounded-md overflow-hidden mb-2">
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
					<div className="flex gap-2 mb-2">
						<IconLocationOn />
						<p className="font-body font-medium text-md mt-0.5">
							{address}
						</p>
					</div>
					<ButtonLink
						label="Como llegar"
						className="w-fit"
						href={`${GOOGLE_MAPS_DIRECTION_URL}${latitude},${longitude}`}
						iconLeft={<IconDirections />}
						target="_blank"
					/>
				</div>
				<div className="absolute left-0 top-0 bottom-0 right-0 bg-black/40 z-5"></div>
				<Image
					className="object-cover z-0 blur-lg"
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
