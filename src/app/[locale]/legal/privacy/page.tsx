import { useTranslations } from 'next-intl';

import logo from '../../../../../public/static/img/logo-color-2x.webp';

import Link from 'next/link';
import Image from 'next/image';
import LandingAppBar from '@/components/organisms/landing-appbar';

export default function PrivacidadPage() {
	const t = useTranslations();

	return (
		<div className="roboto p-4">
			<LandingAppBar />
			<div className="max-w-[900px] mt-4 rounded-lg p-4 ml-auto mr-auto font-body">
				<h1 className="text-2xl font-bold mb-4 font-heading">
					{t('Política de privacidad')}
				</h1>
				<p className="mb-4">
					{t(
						'Actualmente, esta aplicación es un proyecto personal y sin fines comerciales',
					)}
				</p>
				<p className="mb-4">
					{t(
						'Los datos introducidos por los usuarios se utilizan exclusivamente para el funcionamiento de la aplicación',
					)}
				</p>
				<p className="mb-4">
					{t(
						'El responsable del tratamiento de los datos es el creador de la aplicación, que actúa a título personal',
					)}
				</p>
				<p className="text-sm text-gray-500">
					{t(
						'Esta política podrá actualizarse en el futuro si el proyecto evoluciona a una versión comercial',
					)}
				</p>
			</div>
		</div>
	);
}
