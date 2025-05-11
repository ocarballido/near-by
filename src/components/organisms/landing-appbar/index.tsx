import Image from 'next/image';

import LandingAuthButton from '../landing-auth-buttons/LandingAuthButton';

type LandingAppBarProps = {
	className?: string;
};

const LandingAppBar = ({ className = '' }: LandingAppBarProps) => {
	return (
		<div
			className={`w-full shadow-xs ml-auto mr-auto max-w-[1400px] flex items-center rounded-lg p-4 bg-white transition-all ${className}`}
		>
			<Image
				src="/static/img/icon.webp"
				width={40}
				height={40}
				alt="Icon Logo"
				style={{ marginRight: '1rem' }}
			/>
			<h1 className="font-heading font-medium text-primary-500 text-md">
				BNBexplorer
			</h1>
			<LandingAuthButton />
		</div>
	);
};

export default LandingAppBar;
