import { useTranslations } from 'next-intl';

import logo from '../../../../../public/static/img/logo-color-2x.webp';

import Link from 'next/link';
import Image from 'next/image';
import LandingAppBar from '@/components/organisms/landing-appbar';

export default function ContenidoPage() {
	const t = useTranslations();

	return (
		<div className="min-h-screen roboto p-4">
			<LandingAppBar />
			<div className="max-w-[900px] mt-4 rounded-lg p-4 ml-auto mr-auto font-body">
				<h1 className="text-2xl font-bold mb-4 font-heading">
					{t('Aviso sobre Contenidos Subidos por el Usuario')}
				</h1>
				<p className="mb-4">
					{t(
						'Los usuarios son los únicos responsables de los textos e imágenes que suben a la plataforma'
					)}
				</p>
				<p className="mb-4">
					{t(
						'La aplicación no revisa ni valida los contenidos, por lo que cualquier uso indebido será responsabilidad directa del usuario'
					)}
				</p>
				<p className="mb-4">
					{t(
						'Si detectas algún contenido inapropiado o que vulnera derechos, puedes reportarlo al correo indicado en la plataforma para que sea revisado'
					)}
				</p>
			</div>
			<div className="text-center pt-32 pb-4 px-4 flex flex-col gap-4 items-center">
				<Image
					src={logo}
					width={200}
					height={64}
					alt="BNBexplorer logo"
					className="mb-4"
				/>
				<div className="px-4 flex flex-col md:flex-row gap-4 font-body text-sm underline opacity-50">
					<Link href="/legal/conditions">
						{t('Términos y Condiciones')}
					</Link>
					<Link href="/legal/privacy">
						{t('Política de privacidad')}
					</Link>
					<Link href="/legal/content">{t('Contenido')}</Link>
				</div>
				<p className="font-medium font-body text-sm opacity-50">
					BNBexplorer &#169; {new Date().getFullYear()}
				</p>
			</div>
		</div>
	);
}
