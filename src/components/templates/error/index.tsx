'use client';

import { useLocale, useTranslations } from 'next-intl';

import Image from 'next/image';

import loginRegister from '../../../../public/static/img/login-register-2x.webp';

import { getPathname, usePathname } from '@/i18n/routing';
import Button from '@/components/molecules/button';
import ButtonLink from '@/components/molecules/button-link';

// El huésped vuelve a la portada de su guía y el anfitrión a su panel.
// No se usa router.back(): quien entra a la guía desde un QR no tiene historial
const getHomeHref = (pathname: string) => {
	const [section, propertyId] = pathname.split('/').filter(Boolean);

	return section === 'public' && propertyId
		? `/public/${propertyId}/welcome/highlights`
		: '/app';
};

const ErrorTemplate = () => {
	const t = useTranslations();
	const locale = useLocale();
	const pathname = usePathname();

	const homeHref = getPathname({ href: getHomeHref(pathname), locale });

	return (
		<div className="roboto p-4 flex justify-center items-center font-body">
			<section
				aria-labelledby="error-page"
				className="flex flex-col gap-4 p-2 items-center max-w-[800px] ml-auto mr-auto bg-white rounded-lg"
			>
				<div className="bg-gradient-to-tr from-[#FF6B06] to-[#31C48D] rounded-lg max-h-[350px] overflow-hidden w-full">
					<Image
						alt=""
						src={loginRegister}
						sizes="100vw"
						style={{
							width: '100%',
							height: 'auto',
						}}
					/>
				</div>
				<div className="p-4 flex flex-col gap-3 items-center">
					<div role="alert" className="flex flex-col gap-3 items-center">
						<h1
							id="error-page"
							className="text-2xl font-bold max-w-[800px] ml-auto mr-auto px-4 text-center font-heading"
						>
							{t('errorPageTitle')}
						</h1>
						<p className="font-medium text-gray-600 text-center">
							{t('errorPageDescription')}
						</p>
					</div>
					<div className="flex flex-col md:flex-row gap-2">
						{/* Recarga completa: el error suele venir de datos del
							servidor y la recarga los vuelve a pedir; reset() solo
							garantiza volver a renderizar */}
						<Button
							label={t('errorPageRetry')}
							onClick={() => window.location.reload()}
						/>
						<ButtonLink
							label={t('Volver al inicio')}
							color="secondary"
							href={homeHref}
						/>
					</div>
				</div>
			</section>
		</div>
	);
};

export default ErrorTemplate;
