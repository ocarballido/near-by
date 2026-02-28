'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

import Image from 'next/image';
import Link from 'next/link';

import Typography from '@/components/atoms/typography';
import { ShareMenu } from '@/components/molecules/button-share';

import logo from '../../../../public/static/img/brand_colored.webp';

const Footer = () => {
	const t = useTranslations();

	const path = usePathname();

	if (path.includes('app')) return;

	return (
		<footer className="text-center py-12 px-4 flex flex-col gap-4 items-center">
			<div className="flex flex-col items-center mb-12">
				<Typography component="h3" size="lg">
					{t('shareButtonTitle')}
				</Typography>
				<Typography className="mb-2">{t('shareButtonText')}</Typography>
				<ShareMenu
					url="https://bnbexplorer.com"
					surface="landing_header"
					distinctId="anon-missing"
				/>
			</div>
			<Image
				src={logo}
				width={300}
				height={48}
				alt="BNBexplorer logo"
				className="mb-4"
			/>
			<div className="px-4 flex flex-col md:flex-row gap-4 font-body text-sm underline opacity-50">
				<Link href="/legal/conditions">
					{t('Términos y Condiciones')}
				</Link>
				<Link href="/legal/privacy">{t('Política de privacidad')}</Link>
				<Link href="/legal/content">{t('Contenido')}</Link>
			</div>
			<p className="font-medium font-body text-sm opacity-50">
				BNBexplorer &#169; {new Date().getFullYear()}
			</p>
		</footer>
	);
};

export default Footer;
