import logo from '../../../../../public/static/img/logo-color-2x.webp';

import Link from 'next/link';
import Image from 'next/image';
import LandingAppBar from '@/components/organisms/landing-appbar';

export default function PrivacidadPage() {
	return (
		<div className="min-h-screen roboto p-4">
			<LandingAppBar />
			<div className="max-w-[900px] mt-4 rounded-lg p-4 ml-auto mr-auto font-body">
				<h1 className="text-2xl font-bold mb-4 font-heading">
					Política de Privacidad
				</h1>
				<p className="mb-4">
					Esta aplicación ha sido creada como un proyecto personal y
					sin ánimo de lucro. No se recogen datos con fines
					comerciales, pero es necesario tratar ciertos datos
					personales (como correo electrónico y contraseña) para
					permitir el acceso y uso de la plataforma.
				</p>
				<p className="mb-4">
					Los datos introducidos por los usuarios se utilizan
					exclusivamente para el funcionamiento de la aplicación. En
					ningún caso se cederán a terceros.
				</p>
				<p className="mb-4">
					El responsable del tratamiento de los datos es el creador de
					la aplicación, que actúa a título personal. Puedes solicitar
					la eliminación de tus datos escribiendo al correo indicado
					en la plataforma.
				</p>
				<p className="text-sm text-gray-500">
					Esta política podrá actualizarse en el futuro si el proyecto
					evoluciona a una versión comercial.
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
