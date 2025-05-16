import logo from '../../../../../public/static/img/logo-color-2x.webp';

import Link from 'next/link';
import Image from 'next/image';
import LandingAppBar from '@/components/organisms/landing-appbar';

export default function ContenidoPage() {
	return (
		<div className="min-h-screen roboto p-4">
			<LandingAppBar />
			<div className="max-w-[900px] mt-4 rounded-lg p-4 ml-auto mr-auto font-body">
				<h1 className="text-2xl font-bold mb-4 font-heading">
					Aviso sobre Contenidos Subidos por el Usuario
				</h1>
				<p className="mb-4">
					Los usuarios son los únicos responsables de los textos e
					imágenes que suben a la plataforma. Deben asegurarse de
					contar con los derechos necesarios para publicar dicho
					contenido.
				</p>
				<p className="mb-4">
					La aplicación no revisa ni valida los contenidos, por lo que
					cualquier uso indebido será responsabilidad directa del
					usuario.
				</p>
				<p className="mb-4">
					Si detectas algún contenido inapropiado o que vulnera
					derechos, puedes reportarlo al correo indicado en la
					plataforma para que sea revisado.
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
