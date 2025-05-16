import { useTranslations } from 'next-intl';

import loginRegister from '../../../public/static/img/login-register-2x.webp';

import ButtonLink from '@/components/molecules/button-link';
import Image from 'next/image';

export default function NotFoundPage() {
	const t = useTranslations();

	return (
		<div className="min-h-screen roboto p-4 flex justify-center items-center font-body">
			<section
				aria-labelledby="not-found"
				className="flex flex-col gap-4 p-2 items-center max-w-[800px] ml-auto mr-auto bg-white rounded-lg"
			>
				<div className="bg-gradient-to-tr from-[#FF6B06] to-[#31C48D] rounded-lg max-h-[350px] overflow-hidden w-full">
					<Image
						alt="Mountains"
						src={loginRegister}
						sizes="100vw"
						style={{
							width: '100%',
							height: 'auto',
						}}
					/>
				</div>
				<div className="p-4 flex flex-col gap-3 items-center">
					<p className="text-6xl text-primary-500">404</p>
					<h1
						id="not-found"
						className="text-2xl font-bold max-w-[800px] ml-auto mr-auto px-4 text-center font-heading"
					>
						{t('¡Uy! Página no encontrada')}
					</h1>
					<p className="font-medium text-gray-600">
						{t(
							'Lo sentimos, la página que buscas no existe o ha sido movida'
						)}
					</p>
					<ButtonLink label={t('Volver al inicio')} href="/" />
				</div>
			</section>
		</div>
	);
}
