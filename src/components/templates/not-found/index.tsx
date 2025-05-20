'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import Image from 'next/image';

import loginRegister from '../../../../public/static/img/login-register-2x.webp';

import ButtonLink from '@/components/molecules/button-link';
import Button from '@/components/molecules/button';

const NotFoundTemplate = () => {
	const t = useTranslations();
	const router = useRouter();

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
					<div className="flex flex-col md:flex-row gap-2">
						<Button
							label={t('Volver atrás')}
							color="secondary"
							onClick={() => router.back()}
						/>
						<ButtonLink label={t('Volver al inicio')} href="/" />
					</div>
				</div>
			</section>
		</div>
	);
};

export default NotFoundTemplate;
