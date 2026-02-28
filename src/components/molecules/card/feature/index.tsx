import Image from 'next/image';
import FancyIcon from '@/components/atoms/icon/fancy-icon';

type FeaturePropType = {
	icon?: React.ReactNode;
	color: 'primary' | 'info' | 'warning' | 'error' | 'gradient';
	number?: number;
	isFeatured?: boolean;
	title?: string;
	body?: string;
	className?: string;
	image?: string;
};

const Feature = ({
	icon,
	color = 'gradient',
	number = 1,
	isFeatured = false,
	title,
	body,
	className,
	image = '',
}: FeaturePropType) => {
	return (
		<div
			className={`flex flex-1 flex-col p-2 bg-white rounded-xl items-center justify-center text-center relative ${className}`}
		>
			<FancyIcon
				icon={icon}
				color={color}
				isFeatured={isFeatured}
				number={number}
			/>
			{isFeatured && (
				<div className="relative grow min-h-[400px] h-full w-full rounded-md overflow-hidden">
					<Image
						alt="Mountains"
						src={image}
						fill={true}
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						className="object-cover"
					/>
				</div>
			)}
			<div className="p-6">
				<h3 className="text-2xl font-bold mb-2">{title}</h3>
				<p className="font-body font-medium opacity-70">{body}</p>
			</div>
		</div>
	);
};

export default Feature;
