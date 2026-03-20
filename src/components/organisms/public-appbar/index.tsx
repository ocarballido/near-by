import Image from 'next/image';

import Link from 'next/link';
import LandingAuthButton from '../landing-auth-buttons/LandingAuthButton';
import LanguageSelector from '@/components/molecules/language-selector';

type PublicAppBarProps = {
	className?: string;
};

const PublicAppBar = ({ className = '' }: PublicAppBarProps) => {
	return (
		<div
			className={`w-full shadow-xs ml-auto mr-auto flex items-center rounded-lg p-4 bg-white transition-all ${className}`}
		>
			<Link href="/" className="flex items-center mr-auto">
				<div className="relative mr-3 w-[40px] h-[50px]">
					<Image
						src="/static/img/symbol_shadow_colored@2x.webp"
						fill
						alt="Icon Logo"
						sizes="40px"
						style={{ objectFit: 'contain' }}
					/>
				</div>
				<h1 className="hidden md:block font-heading font-medium text-primary-500 text-md">
					BNBexplorer
				</h1>
			</Link>
			<LanguageSelector />
		</div>
	);
};

export default PublicAppBar;
