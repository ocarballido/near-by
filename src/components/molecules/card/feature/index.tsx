import Image from 'next/image';
import FancyIcon from '@/components/atoms/icon/fancy-icon';
import { ReactNode } from 'react';
import Typography from '@/components/atoms/typography';

type FeaturePropType = {
	icon?: React.ReactNode;
	color: 'primary' | 'info' | 'warning' | 'error' | 'gradient';
	number?: number;
	isFeatured?: boolean;
	title?: string;
	body?: string;
	className?: string;
	image?: string;
	imageMinHeight?: string;
	children?: ReactNode;
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
	imageMinHeight = '400px',
	children,
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
				<div
					className="relative grow h-full w-full rounded-md overflow-hidden bg-gradient-to-tr from-[#ffa263] to-[#6cffc9]"
					style={{ minHeight: imageMinHeight }}
				>
					<Image
						alt="Mountains"
						src={image}
						fill={true}
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						className="object-cover"
					/>
				</div>
			)}
			<div className="p-6 flex flex-col gap-2">
				<Typography component="h3" size="lg">
					{title}
				</Typography>
				<Typography className="opacity-70" weight="medium">
					{body}
				</Typography>
				{children}
			</div>
		</div>
	);
};

export default Feature;
