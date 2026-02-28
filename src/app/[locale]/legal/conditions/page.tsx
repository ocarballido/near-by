import { useTranslations } from 'next-intl';

import logo from '../../../../../public/static/img/logo-color-2x.webp';

import Link from 'next/link';
import Image from 'next/image';
import LandingAppBar from '@/components/organisms/landing-appbar';

export default function CondicionesPage() {
	const t = useTranslations();

	return (
		<div className="roboto p-4">
			<LandingAppBar />
			<div className="max-w-[900px] mt-4 rounded-lg p-4 ml-auto mr-auto font-body">
				<h1 className="text-2xl font-bold mb-4 font-heading">
					{t('Términos y Condiciones de Uso')}
				</h1>
				<p className="mb-4">
					{t(
						'Al registrarte en esta plataforma, aceptas utilizarla de forma responsable y respetuosa',
					)}
				</p>
				<p className="mb-4">
					{t('El uso de esta herramienta es gratuito y personal')}
				</p>
				<p className="text-sm text-gray-500">
					{t(
						'Estos términos podrán actualizarse si el proyecto evoluciona a un servicio comercial',
					)}
				</p>
			</div>
		</div>
	);
}
