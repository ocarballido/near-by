import clsx from 'clsx';

type FeaturePropType = {
	icon?: React.ReactNode;
	color: 'primary' | 'info' | 'warning' | 'error' | 'gradient';
	number?: number;
	isFeatured?: boolean;
};

const FancyIcon = ({ color, icon, isFeatured, number }: FeaturePropType) => {
	const bulletBorderStyles = clsx({
		'bg-gradient-to-tr from-[#FF6B06]/10 to-[#31C48D]/10':
			color === 'gradient',
		'bg-primary-400/10': color === 'primary',
		'bg-info-400/10': color === 'info',
		'bg-warning-400/10': color === 'warning',
		'bg-error-400/10': color === 'error',
		'absolute top-4 left-4 mt-0 z-1': isFeatured,
		'mt-4': !isFeatured,
	});
	const bulletBgStyles = clsx({
		'bg-gradient-to-tr from-[#FF6B06] to-[#31C48D]': color === 'gradient',
		'bg-primary-400': color === 'primary',
		'bg-info-400': color === 'info',
		'bg-warning-400': color === 'warning',
		'bg-error-400': color === 'error',
	});

	return (
		<div
			className={`flex justify-center items-center w-18 h-18 rounded-full ${bulletBorderStyles}`}
		>
			<span
				className={`flex text-white justify-center items-center w-12 h-12 rounded-full font-bold text-xl ${bulletBgStyles}`}
			>
				{icon ? icon : number}
			</span>
		</div>
	);
};

export default FancyIcon;
