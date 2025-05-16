import React from 'react';
import { useTranslations } from 'next-intl';

import Image from 'next/image';

import headerImage from '../../../public/static/img/header-trimed-2x.webp';
import multyProperty from '../../../public/static/img/multy-property-2x.webp';
import categories from '../../../public/static/img/categories-2x.webp';
import uiEdit from '../../../public/static/img/ui-edit-2x.webp';
import publicUi from '../../../public/static/img/public-ui-2x.webp';
import testimony01 from '../../../public/static/img/testimony-01.webp';
import testimony02 from '../../../public/static/img/testimony-02.webp';
import testimony03 from '../../../public/static/img/testimony-03.webp';
import logo from '../../../public/static/img/logo-color-2x.webp';

import LandingAppBar from '@/components/organisms/landing-appbar';
import Link from 'next/link';
import ButtonLink from '@/components/molecules/button-link';
import PlaceTooltip from '@/components/atoms/place-tooltip';
import IconAccountCircle from '@/components/atoms/icon/account-circle';
import FilterCategories from '@/components/templates/filter-categories';
// import ModalVideo from '@/components/templates/modal-video';

export default function Home() {
	const t = useTranslations();

	return (
		<div className="min-h-screen roboto p-4">
			<LandingAppBar />
			<section
				aria-labelledby="BNB-explorer"
				className="bg-gradient-to-tr from-[#FF6B06] to-[#31C48D] rounded-lg mt-2 px-0 pt-12"
			>
				<div className="flex flex-col gap-8 text-center items-center max-w-[1400px] ml-auto mr-auto">
					<h2
						id="BNB-explorer"
						className="font-heading text-4xl md:text-6xl font-bold max-w-[800px] ml-auto mr-auto px-4 text-white"
					>
						{t('Tu guía de huéspedes reinventada')}
					</h2>
					<h3 className="font-heading font-medium text-xl md:text-2xl max-w-[800px] ml-auto mr-auto px-4 text-white">
						{t(
							'Gestiona y comparte toda la información local de tus alojamientos Airbnb en segundos, sin complicaciones técnicas'
						)}
					</h3>
					<div className="px-4">
						<ButtonLink
							label={t('Crea tu primer dashboard gratis')}
							href="/app"
							color="primary"
							className="w-fit"
						/>
						{/* <ModalVideo /> */}
					</div>
					<div className="relative w-full">
						<PlaceTooltip
							label={t('Bar')}
							className="absolute left-[10%] top-[-8%] sm:left-[25%] md:left-[25%] md:top-[20%]"
						/>
						<PlaceTooltip
							label={t('Souvenirs')}
							className="absolute hidden sm:flex left-[2%] top-[30%] md:top-[50%] sm:left-[5%] md:left-[15%]"
						/>
						<PlaceTooltip
							label={t('Hospital')}
							className="absolute left-[10%] sm:left-[20%] md:left-[25%] top-[45%] sm:top-[60%] md:top-[80%]"
						/>
						<PlaceTooltip
							label={t('Emergencias')}
							className="absolute right-[5%] top-[-8%] sm:right-[15%] sm:top-[5%] md:right-[20%] md:top-[20%]"
						/>
						<PlaceTooltip
							label={t('Embajada')}
							className="hidden sm:flex absolute right-[5%] top-[35%] md:top-[50%] md:right-[15%]"
						/>
						<PlaceTooltip
							label={t('Cafetería')}
							className="absolute right-[15%] top-[45%] sm:top-[60%] md:top-[80%] sm:right-[30%] md:right-[25%]"
						/>
						<Image
							alt={t(
								'BNBexplorar, Header con casa con localizaciones'
							)}
							src={headerImage}
							sizes="100vw"
							style={{
								width: '80%',
								height: 'auto',
								marginLeft: 'auto',
								marginRight: 'auto',
							}}
						/>
					</div>
				</div>
			</section>
			<section
				aria-labelledby="why"
				className="flex flex-col gap-8 rounded-lg mt-2 px-0 py-16 items-center max-w-[1400px] ml-auto mr-auto"
			>
				<h2
					id="why"
					className="font-heading text-4xl font-bold max-w-[800px] ml-auto mr-auto px-4 text-center"
				>
					{t('¿Por qué esta herramienta?')}
				</h2>
				<h3 className="font-heading font-medium text-xl md:text-2xl max-w-[800px] ml-auto mr-auto px-4 text-center">
					{t(
						'Lleva tu hospitalidad al siguiente nivel con recomendaciones locales'
					)}
				</h3>
				<div className="flex flex-col md:flex-row gap-4 justify-center max-w-[1000px]">
					<div className="flex flex-1 flex-col p-2 rounded-lg bg-white shadow-lg">
						<div className="flex flex-col gap-2 p-4 rounded-md bg-linear-to-r from-teal-600 to-primary-500">
							<div className="flex justify-center items-center w-[62px] h-[62px] rounded-full bg-white">
								<Image
									alt={t('Ahorra tiempo')}
									src="/static/img/save-time.svg"
									width={30}
									height={30}
								/>
							</div>
							<h4 className="text-white font-bold text-xl">
								{t('Ahorra tiempo')}
							</h4>
						</div>
						<h5 className="font-body py-3 opacity-70 font-medium">
							{t(
								'Centraliza todas las consultas de “¿dónde como?”, “¿qué visito?” en un panel intuitivo'
							)}
						</h5>
					</div>
					<div className="flex flex-1 flex-col p-2 rounded-lg bg-white shadow-lg">
						<div className="flex flex-col gap-2 p-4 rounded-md bg-linear-to-r from-teal-600 to-primary-500">
							<div className="flex justify-center items-center w-[62px] h-[62px] rounded-full bg-white">
								<Image
									alt={t('Mejora tu reputación')}
									src="/static/img/favorite.svg"
									width={30}
									height={30}
								/>
							</div>
							<h4 className="text-white font-bold text-xl">
								{t('Mejora tu reputación')}
							</h4>
						</div>
						<h5 className="font-body py-3 opacity-70 font-medium">
							{t(
								'Ofrecer una experiencia local personalizada se traduce en valoraciones de 5 estrellas'
							)}
						</h5>
					</div>
					<div className="flex flex-1 flex-col p-2 rounded-lg bg-white shadow-lg">
						<div className="flex flex-col gap-2 p-4 rounded-md bg-linear-to-r from-teal-600 to-primary-500">
							<div className="flex justify-center items-center w-[62px] h-[62px] rounded-full bg-white">
								<Image
									alt={t('Comunicación cero esfuerzo')}
									src="/static/img/star_shine.svg"
									width={30}
									height={30}
								/>
							</div>
							<h4 className="text-white font-bold text-xl">
								{t('Comunicación cero esfuerzo')}
							</h4>
						</div>
						<h5 className="font-body py-3 opacity-70 font-medium">
							{t(
								'Olvídate de largos mensajes; envía tu link y deja que la app responda por ti'
							)}
						</h5>
					</div>
				</div>
			</section>
			<section
				aria-labelledby="how"
				className="flex flex-col gap-8 rounded-lg mt-2 px-0 py-12 text-center items-center max-w-[1400px] ml-auto mr-auto bg-gray-50 border-2 border-white"
			>
				<h2
					id="how"
					className="font-heading text-4xl font-bold max-w-[800px] ml-auto mr-auto px-4"
				>
					{t('Cómo funciona')}
				</h2>
				<div className="px-8 py-4 bg-primary-50 rounded-full w-fit border-2 border-primary-200 text-2xl text-primary-500">
					{t('en 3 sencillos pasos')}
				</div>
				<div className="flex flex-col md:flex-row gap-4 items-center max-w-[1000px]">
					<div className="flex flex-1 flex-col gap-4 p-4 items-center text-center">
						<div className="flex justify-center items-center w-18 h-18 rounded-full bg-primary-100">
							<span className="flex justify-center items-center w-12 h-12 rounded-full bg-linear-270 from-primary-400 to-teal-600 font-bold text-white text-xl">
								1
							</span>
						</div>
						<h3 className="text-xl font-bold">
							{t('Añade tus propiedades')}
						</h3>
						<p className="font-body font-medium opacity-70">
							{t(
								'Crea cada alojamiento con nombre, descripción, foto y dirección (validación de Google Maps)'
							)}
						</p>
					</div>
					<div className="flex flex-1 flex-col gap-4 p-4 items-center text-center">
						<div className="flex justify-center items-center w-18 h-18 rounded-full bg-primary-100">
							<span className="flex justify-center items-center w-12 h-12 rounded-full bg-linear-270 from-primary-400 to-teal-600 font-bold text-white text-xl">
								2
							</span>
						</div>
						<h3 className="text-xl font-bold">
							{t('Organiza tus categorías')}
						</h3>
						<p className="font-body font-medium opacity-70">
							{t(
								'Ya vienen cargadas tus 17 categorías esenciales: Salud y Bienestar, Comida y Bebida, Arte y Cultura'
							)}
						</p>
					</div>
					<div className="flex flex-1 flex-col gap-4 p-4 items-center text-center">
						<div className="flex justify-center items-center w-18 h-18 rounded-full bg-primary-100">
							<span className="flex justify-center items-center w-12 h-12 rounded-full bg-linear-270 from-primary-400 to-teal-600 font-bold text-white text-xl">
								3
							</span>
						</div>
						<h3 className="text-xl font-bold">
							{t('Comparte tu URL pública')}
						</h3>
						<p className="font-body font-medium opacity-70">
							{t(
								'Generamos automáticamente un link único por propiedad'
							)}
						</p>
					</div>
				</div>
				<ButtonLink
					label={t('Comienza gratis!')}
					href="/app"
					iconLeft={<IconAccountCircle />}
				/>
			</section>
			<section
				aria-labelledby="features"
				className="flex flex-col gap-8 rounded-lg mt-2 px-0 py-12 items-center max-w-[1400px] ml-auto mr-auto bg-white"
			>
				<h2
					id="features"
					className="font-heading text-4xl font-bold max-w-[800px] ml-auto mr-auto px-4 text-center"
				>
					{t('Características destacadas')}
				</h2>
				<div className="flex flex-col gap-4 md:gap-0 max-w-[960px] px-4">
					<div className="flex flex-col md:flex-row items-stretch">
						<div className="flex-1 flex flex-col justify-center gap-4 py-8 relative">
							<h3 className="text-3xl pr-6 pl-4">
								{t('Multi-alojamiento sin límites')}
							</h3>
							<p className="font-body font-medium opacity-70 pr-6 pl-4">
								{t('Añade tantas propiedades como quieras')}
							</p>
							<ButtonLink
								label={t('Comienza gratis!')}
								href="/app"
								iconLeft={<IconAccountCircle />}
								className="w-fit ml-4"
							/>
							<span className="w-[32px] h-[32px] bg-primary-400 absolute bottom-0 right-0 hidden md:block">
								<span className="w-[32px] h-[32px] bg-white rounded-br-xl block"></span>
							</span>
						</div>
						<div className="flex-1 flex flex-col justify-center bg-linear-to-r to-teal-600 from-primary-400 rounded-2xl md:rounded-bl-none md:min-h-[550px]">
							<Image
								alt={t('Multi propiedad')}
								src={multyProperty}
								sizes="100vw"
								style={{
									width: '120%',
									height: 'auto',
								}}
							/>
						</div>
					</div>
					<div className="flex flex-col md:flex-row items-stretch">
						<div className="flex-1 flex flex-col justify-center md:min-h-[550px] bg-linear-to-r from-teal-600 to-primary-400 rounded-xl md:rounded-tr-none md:rounded-br-none order-1 md:order-0">
							<Image
								alt={t('Categorías')}
								src={categories}
								sizes="100vw"
								style={{
									width: '120%',
									height: 'auto',
								}}
							/>
						</div>
						<div className="flex-1 flex flex-col justify-center gap-4 py-8 relative">
							<h3 className="text-3xl pr-4 pl-6">
								{t(
									'Categorías & Subcategorías pre-configuradas'
								)}
							</h3>
							<p className="font-body font-medium opacity-70 pr-4 pl-6">
								{t('Olvídate de empezar de cero')}
							</p>
							<p className="font-body font-medium opacity-70 pr-4 pl-6">
								{t('Categorías generales estándar')}
							</p>
							<p className="font-body font-medium opacity-70 pr-4 pl-6">
								{t('Subgrupos listos para editar')}
							</p>
							<span className="w-[32px] h-[32px] bg-primary-400 absolute top-0 left-0 hidden md:block">
								<span className="w-[32px] h-[32px] bg-white rounded-tl-xl block"></span>
							</span>
							<span className="w-[32px] h-[32px] bg-primary-400 absolute bottom-0 left-0 hidden md:block">
								<span className="w-[32px] h-[32px] bg-white rounded-bl-xl block"></span>
							</span>
							<FilterCategories />
						</div>
					</div>
					<div className="flex flex-col md:flex-row items-stretch">
						<div className="flex-1 flex flex-col justify-center gap-4 py-8 relative">
							<h3 className="text-3xl pr-6 pl-4">
								{t('Edición fácil y ágil')}
							</h3>
							<p className="font-body font-medium opacity-70 pr-6 pl-4">
								{t(
									'Editar, eliminar o añadir ubicaciones en un par de clics'
								)}
							</p>
							<p className="font-body font-medium opacity-70 pr-6 pl-4">
								{t(
									'Interfaz limpia pensada para ser intuitiva, sin curva de aprendizaje'
								)}
							</p>
							<ButtonLink
								label={t('Comienza gratis!')}
								href="/app"
								iconLeft={<IconAccountCircle />}
								className="w-fit ml-4"
							/>
							<span className="w-[32px] h-[32px] bg-primary-400 absolute top-0 right-0 hidden md:block">
								<span className="w-[32px] h-[32px] bg-white rounded-tr-xl block"></span>
							</span>
							<span className="w-[32px] h-[32px] bg-primary-400 absolute bottom-0 right-0 hidden md:block">
								<span className="w-[32px] h-[32px] bg-white rounded-br-xl block"></span>
							</span>
						</div>
						<div className="flex-1 flex flex-col justify-center bg-linear-to-r to-teal-600 from-primary-400 rounded-xl md:rounded-tl-none md:rounded-bl-none md:min-h-[550px]">
							<Image
								alt={t('Editar')}
								src={uiEdit}
								sizes="100vw"
								style={{
									width: '120%',
									height: 'auto',
								}}
							/>
						</div>
					</div>
					<div className="flex flex-col md:flex-row items-stretch">
						<div className="flex-1 flex flex-col justify-center min-h-[550px] bg-linear-to-r from-teal-600 to-primary-400 rounded-xl md:rounded-tr-none order-1 md:order-0">
							<Image
								alt={t('Enlace público')}
								src={publicUi}
								sizes="100vw"
								style={{
									width: '120%',
									height: 'auto',
								}}
							/>
						</div>
						<div className="flex-1 flex flex-col justify-center gap-4 py-8 relative">
							<h3 className="text-3xl pr-4 pl-6">
								{t('Links públicos al instante')}
							</h3>
							<p className="font-body font-medium opacity-70 pr-4 pl-6">
								{t('Cada alojamiento recibe su propia URL')}
							</p>
							<p className="font-body font-medium opacity-70 pr-4 pl-6">
								{t(
									'Sin contraseñas ni logins: tu huésped abre el enlace y descubre lo mejor del barrio'
								)}
							</p>
							<ButtonLink
								label={t('Comienza gratis!')}
								href="/app"
								iconLeft={<IconAccountCircle />}
								className="w-fit ml-6"
							/>
							<span className="w-[32px] h-[32px] bg-primary-400 absolute top-0 left-0 hidden md:block">
								<span className="w-[32px] h-[32px] bg-white rounded-tl-xl block"></span>
							</span>
						</div>
					</div>
				</div>
			</section>
			<section
				aria-labelledby="benefits"
				className="flex flex-col gap-8 rounded-lg mt-2 px-4 py-12 items-center max-w-[1400px] ml-auto mr-auto bg-gradient-to-tr from-[#FF6B06] to-[#31C48D]"
			>
				<h2
					id="benefits"
					className="font-heading text-4xl font-bold max-w-[800px] ml-auto mr-auto px-4 text-white"
				>
					{t('Beneficios para ti')}
				</h2>
				<h3 className="font-heading font-medium text-xl md:text-2xl max-w-[800px] ml-auto mr-auto px-4 text-center text-white">
					{t(
						'Saca el máximo partido a tus propiedades con menos esfuerzo'
					)}
				</h3>
				<div className="flex flex-col items-center p-2 rounded-lg bg-white gap-2">
					<div className="flex items-center p-2 rounded-md gap-4 font-bold w-full">
						<p className="w-full">{t('Beneficios')}</p>
						<p className="w-full">{t('Detalles')}</p>
					</div>
					<div className="flex w-full items-center p-4 rounded-md gap-4 bg-gray-100 font-body">
						<p className="font-bold opacity-70  w-full">
							{t('Más recomendaciones 5 estrellas')}
						</p>
						<p className="opacity-70  w-full">
							{t('Clientes satisfechos = mejor reputación')}
						</p>
					</div>
					<div className="flex  w-full items-center p-4 rounded-md gap-4 bg-gray-100 font-body">
						<p className="font-bold opacity-70  w-full">
							{t('Gestión desde cualquier lugar')}
						</p>
						<p className="opacity-70  w-full">
							{t(
								'Accede al panel desde móvil, tablet u ordenador'
							)}
						</p>
					</div>
					<div className="flex  w-full items-center p-4 rounded-md gap-4 bg-gray-100 font-body">
						<p className="font-bold opacity-70  w-full">
							{t('Actualizaciones en tiempo real')}
						</p>
						<p className="opacity-70  w-full">
							{t(
								'Cambia un horario, un contacto de emergencia… ¡se actualiza al instante!'
							)}
						</p>
					</div>
					<div className="flex  w-full items-center p-4 rounded-md gap-4 bg-gray-100 font-body">
						<p className="font-bold opacity-70  w-full">
							{t('Experiencia local inmersiva')}
						</p>
						<p className="opacity-70  w-full">
							{t(
								'Tus huéspedes descubren rincones auténticos y viven como locales'
							)}
						</p>
					</div>
					<div className="flex  w-full items-center p-4 rounded-md gap-4 bg-gray-100 font-body">
						<p className="font-bold opacity-70  w-full">
							{t('Planificación ágil')}
						</p>
						<p className="opacity-70  w-full">
							{t(
								'Inquilinos organizan su viaje con antelación usando un único enlace'
							)}
						</p>
					</div>
					<div className="flex  w-full items-center p-4 rounded-md gap-4 bg-gray-100 font-body">
						<p className="font-bold opacity-70  w-full">
							{t('Fidelización de huéspedes')}
						</p>
						<p className="opacity-70  w-full">
							{t(
								'Ofrecer valor añadido fomenta reservas recurrentes y recomendaciones'
							)}
						</p>
					</div>
				</div>
				<ButtonLink
					label={t('Comienza gratis!')}
					href="/app"
					iconLeft={<IconAccountCircle />}
					color="white"
				/>
			</section>
			<section
				aria-labelledby="quotes"
				className="flex flex-col gap-8 rounded-lg mt-2 px-4 py-12 items-center max-w-[1400px] ml-auto mr-auto bg-gray-50 border-2 border-white"
			>
				<div className="flex flex-col lg:flex-row items-center max-w-[1200px] gap-6 ml-auto mr-auto">
					<div className="w-full lg:max-w-[500px] flex flex-col justify-center gap-4 p-6 relative">
						<h2
							id="quotes"
							className="font-heading text-4xl font-bold"
						>
							{t('Testimonios')}
						</h2>
						<h3 className="text-xl md:text-2xl">
							{t(
								'Historias de anfitriones que ya disfrutan de sus ventajas'
							)}
						</h3>
						<ButtonLink
							label={t('Comienza gratis!')}
							href="/app"
							iconLeft={<IconAccountCircle />}
							className="w-fit"
						/>
					</div>
					<div className="w-full flex flex-col items-center">
						<div className="flex flex-col gap-2 sm:flex-row items-center">
							<div className="flex flex-col gap-4 p-4 rounded-lg bg-white shadow-xl">
								<div className="w-[100px] h-[100px] rounded-full border-8 border-primary-200 overflow-hidden">
									<Image
										alt={t('Houst01')}
										src={testimony01}
										sizes="100vw"
										style={{
											width: '100%',
											height: 'auto',
										}}
									/>
								</div>
								<p className="font-body opacity-70">
									{t('Quote01')}
								</p>
								<p className="font-bold text-lg">
									{t('Houst01')}
								</p>
							</div>
							<div className="flex flex-col gap-2">
								<div className="flex flex-col gap-4 p-4 rounded-lg bg-white shadow-xl">
									<div className="w-[64px] h-[64px] rounded-full border-8 border-primary-200 overflow-hidden">
										<Image
											alt={t('Houst02')}
											src={testimony02}
											sizes="100vw"
											style={{
												width: '100%',
												height: 'auto',
											}}
										/>
									</div>
									<p className="font-body opacity-70">
										{t('Quote02')}
									</p>
									<p className="font-bold text-lg">
										{t('Houst02')}
									</p>
								</div>
								<div className="flex flex-col gap-4 p-4 rounded-lg bg-white shadow-xl">
									<div className="w-[64px] h-[64px] rounded-full border-8 border-primary-200 overflow-hidden">
										<Image
											alt={t('Houst03')}
											src={testimony03}
											sizes="100vw"
											style={{
												width: '100%',
												height: 'auto',
											}}
										/>
									</div>
									<p className="font-body opacity-70">
										{t('Quote03')}
									</p>
									<p className="font-bold text-lg">
										{t('Houst03')}
									</p>
								</div>
							</div>
						</div>
					</div>
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
			</section>
		</div>
	);
}
