import logo from '../../../../../public/static/img/logo-color-2x.webp';

import Link from 'next/link';
import Image from 'next/image';
import LandingAppBar from '@/components/organisms/landing-appbar';

export default function CondicionesPage() {
	return (
		<div className="min-h-screen roboto p-4">
			<LandingAppBar />
			<div className="max-w-[900px] mt-4 rounded-lg p-4 ml-auto mr-auto font-body">
				<h1 className="text-2xl font-bold mb-4 font-heading">
					Términos y Condiciones de Uso
				</h1>
				<p className="mb-4">
					Al registrarte en esta plataforma, aceptas utilizarla de
					forma responsable y respetuosa. No está permitido utilizar
					la aplicación con fines ilegales, para distribuir contenido
					ofensivo o que infrinja derechos de terceros.
				</p>
				<p className="mb-4">
					El uso de esta herramienta es gratuito y personal. El
					creador de la plataforma se reserva el derecho a modificar,
					suspender o eliminar el servicio en cualquier momento, sin
					previo aviso.
				</p>
				<p className="text-sm text-gray-500">
					Estos términos podrán actualizarse si el proyecto evoluciona
					a un servicio comercial.
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
					<Link href="/legal/conditions">Condiciones</Link>
					<Link href="/legal/privacy">Privacidad</Link>
					<Link href="/legal/content">Contenido</Link>
				</div>
				<p className="font-medium font-body text-sm opacity-50">
					BNBexplorer &#169; {new Date().getFullYear()}
				</p>
			</div>
		</div>
	);
}
