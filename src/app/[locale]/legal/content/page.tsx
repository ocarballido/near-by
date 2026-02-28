import { useTranslations } from 'next-intl';

import logo from '../../../../../public/static/img/logo-color-2x.webp';

import Link from 'next/link';
import Image from 'next/image';
import LandingAppBar from '@/components/organisms/landing-appbar';

export default function ContenidoPage() {
	const t = useTranslations();

	return (
		<div className="roboto p-4">
			<LandingAppBar />
			<div className="max-w-[900px] mt-4 rounded-lg p-4 ml-auto mr-auto font-body">
				<h1 className="text-2xl font-bold mb-4 font-heading">
					{t('Aviso sobre Contenidos Subidos por el Usuario')}
				</h1>
				<p className="mb-4">
					{t(
						'Los usuarios son los únicos responsables de los textos e imágenes que suben a la plataforma',
					)}
				</p>
				<p className="mb-4">
					{t(
						'La aplicación no revisa ni valida los contenidos, por lo que cualquier uso indebido será responsabilidad directa del usuario',
					)}
				</p>
				<p className="mb-4">
					{t(
						'Si detectas algún contenido inapropiado o que vulnera derechos, puedes reportarlo al correo indicado en la plataforma para que sea revisado',
					)}
				</p>
			</div>
		</div>
	);
}
