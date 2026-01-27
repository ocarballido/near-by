import React from 'react';
import { useTranslations } from 'next-intl';

import Image from 'next/image';

import headerImage from '../../../public/static/img/header-trimed-2x.webp';
import headerImageMobile from '../../../public/static/img/heroMobile.webp';
import rooftopCentered from '../../../public/static/img/rooftop-centered.png';
import multyProperty from '../../../public/static/img/multy-property-2x.webp';
import blur from '../../../public/static/img/home/blur_01.webp';
import why from '../../../public/static/img/home/why_bnbexplorer.webp';
import how from '../../../public/static/img/home/how_bnbexplorer.webp';

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
import ChimneyEffect from '@/components/atoms/chimney';
import ModalVideo from '@/components/templates/modal-video';

import IconChatBubble from '@/components/atoms/icon/chat-bubble';
import IconStarShine from '@/components/atoms/icon/star-shine';
import IconCheckCircle from '@/components/atoms/icon/check-circle';
import IconFavorite from '@/components/atoms/icon/favorite';
import IconInterests from '@/components/atoms/icon/interests';

import Feature from '@/components/molecules/card/feature';
import ListItem from '@/components/molecules/list-item';
import FancyBadge from '@/components/atoms/fancy-badge';
import BadgeCheck from '@/components/atoms/BadgeCheck';
import { ShareMenu } from '@/components/molecules/button-share';
import IconCancel from '@/components/atoms/icon/cancel';
import Quote from '@/components/molecules/quote';

import styles from './page.module.css';

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
						{t('page_home.section_hero.title')}
					</h2>
					<h3 className="font-heading font-medium text-xl md:text-2xl max-w-[800px] ml-auto mr-auto px-4 text-white">
						{t('page_home.section_hero.subtitle')}
					</h3>
					<div className="px-4 flex flex-col gap-2">
						<ButtonLink
							label={t('page_home.mainAction')}
							href="/app"
							color="primary"
						/>
						<div className="flex gap-1">
							<ButtonLink
								label={t('page_home.pilotHouseAction')}
								href="https://www.bnbexplorer.com/es/public/37a03a95-cd39-4d40-a22b-7628cbb50245/welcome/highlights"
								color="white"
								className="w-full"
								target="_blank"
							/>
							<ModalVideo />
						</div>
					</div>
					<div className="relative w-full">
						<PlaceTooltip
							label={t('page_home.section_hero.tooltip1')}
							className="absolute left-[10%] top-[10%] sm:left-[25%] md:left-[25%] md:top-[20%]"
						/>
						<PlaceTooltip
							label={t('page_home.section_hero.tooltip2')}
							className="absolute hidden sm:flex left-[2%] top-[30%] md:top-[50%] sm:left-[5%] md:left-[15%]"
						/>
						<PlaceTooltip
							label={t('page_home.section_hero.tooltip3')}
							className="absolute left-[10%] sm:left-[20%] md:left-[25%] top-[65%] sm:top-[60%] md:top-[80%]"
						/>
						<PlaceTooltip
							label={t('page_home.section_hero.tooltip4')}
							className="absolute right-[5%] top-[10%] sm:right-[15%] sm:top-[5%] md:right-[20%] md:top-[20%]"
						/>
						<PlaceTooltip
							label={t('page_home.section_hero.tooltip5')}
							className="hidden sm:flex absolute right-[5%] top-[35%] md:top-[50%] md:right-[15%]"
						/>
						<PlaceTooltip
							label={t('page_home.section_hero.tooltip6')}
							className="absolute right-[15%] top-[65%] sm:top-[60%] md:top-[80%] sm:right-[30%] md:right-[25%]"
						/>
						<Image
							alt="Explore locations"
							className="hidden sm:block"
							src={headerImage}
							sizes="100vw"
							style={{
								width: '80%',
								height: 'auto',
								marginLeft: 'auto',
								marginRight: 'auto',
							}}
						/>
						<Image
							alt="Explore locations"
							className="block sm:hidden"
							src={headerImageMobile}
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
				className="flex flex-col gap-8 rounded-lg mt-2 py-16 px-4 items-center max-w-[1400px] ml-auto mr-auto relative"
			>
				<Image
					src={blur}
					fill={true}
					alt="Blur image"
					className="-z-1 object-cover md:object-fill md:h-full md:w-auto"
				/>
				<h2
					id="why"
					className="font-heading text-4xl font-bold max-w-[800px] ml-auto mr-auto px-4 text-center"
				>
					{t('page_home.section_why.title')}
				</h2>
				<h3 className="font-heading font-medium text-xl md:text-2xl max-w-[800px] ml-auto mr-auto px-4 text-center">
					{t('page_home.section_why.subtitle')}
				</h3>
				<div className="grid grid-cols-1 grid-rows-1 md:grid-cols-2 md:grid-rows-2 gap-2 max-w-[900px]">
					<Feature
						color="gradient"
						icon={<IconChatBubble color="white" />}
						title={t('page_home.section_why.cardTitle1')}
						body={t('page_home.section_why.cardSubtitle1')}
						className="md:row-span-2"
						isFeatured
						image={why.src}
					/>
					<Feature
						color="gradient"
						icon={<IconStarShine color="white" />}
						title={t('page_home.section_why.cardTitle2')}
						body={t('page_home.section_why.cardSubtitle2')}
					/>
					<Feature
						color="gradient"
						icon={<IconCheckCircle color="white" />}
						title={t('page_home.section_why.cardTitle3')}
						body={t('page_home.section_why.cardSubtitle3')}
						className="md:col-start-2 md:row-start-2"
					/>
				</div>
				<ButtonLink
					label={t('page_home.mainAction')}
					href="/app"
					iconLeft={<IconAccountCircle />}
				/>
			</section>
			<section
				aria-labelledby="ready-to-go"
				className="flex flex-col md:flex-row justify-center items-center rounded-lg mt-2 px-4 max-w-[1400px] ml-auto mr-auto relative overflow-hidden bg-gradient-to-t from-[#84E1BC] to-[#265EF8]"
			>
				<div className="flex flex-col-reverse lg:flex-row gap-4 items-stretch max-w-[1000px]">
					<div className="flex flex-col gap-6 text-white px-6 py-6 lg:py-20 justify-center">
						<FancyBadge
							firstText={t('page_home.section_reade_to_go.badge')}
						/>
						<h2
							id="features"
							className="font-heading text-4xl font-bold"
						>
							{t('page_home.section_reade_to_go.title')}
						</h2>
						<h3 className="text-3xl">
							{t('page_home.section_reade_to_go.subtitle')}
						</h3>
						<p className="font-body font-medium">
							{t('page_home.section_reade_to_go.body')}
						</p>
						<div className="flex flex-wrap gap-1">
							<BadgeCheck
								label={t('Manual de alojamiento')}
								checked
							/>
							<BadgeCheck label={t('Normas de uso')} checked />
							<BadgeCheck label={t('Horario')} checked />
							<BadgeCheck label={t('Reciclaje')} checked />
							<BadgeCheck label={t('Restaurantes')} checked />
							<BadgeCheck label={t('Cafeterías')} checked />
							<BadgeCheck label={t('Supermercados')} checked />
							<BadgeCheck
								label={t('section_ready_to_go.and_more_badge')}
								checked
							/>
						</div>
						<ButtonLink
							label={t('page_home.mainAction')}
							href="/app"
							iconLeft={<IconAccountCircle />}
							color="white"
							className="w-fit"
						/>
					</div>

					<div className="w-full h-full mr-0">
						<Image
							alt={t('Enlace público')}
							src="/static/img/house-crane.webp"
							width={800}
							height={800}
							className="mx-auto"
						/>
					</div>
				</div>
			</section>
			<section
				aria-labelledby="how"
				className="flex flex-col gap-8 rounded-lg mt-2 py-16 px-4 text-center items-center max-w-[1400px] ml-auto mr-auto relative"
			>
				<Image
					src={blur}
					fill={true}
					alt="Blur image"
					className="-z-1 object-cover md:object-fill md:h-full md:w-auto"
				/>
				<h2
					id="how"
					className="font-heading text-4xl font-bold max-w-[800px] ml-auto mr-auto px-4"
				>
					{t('page_home.section_how.title')}
				</h2>
				<div className="grid grid-cols-1 grid-rows-1 md:grid-cols-2 md:grid-rows-2 gap-2 max-w-[900px]">
					<Feature
						color="gradient"
						number={1}
						title={t('page_home.section_how.cardTitle1')}
						body={t('page_home.section_how.cardSubtitle1')}
					/>
					<Feature
						color="gradient"
						number={2}
						title={t('page_home.section_how.cardTitle2')}
						body={t('page_home.section_how.cardSubtitle2')}
						className="md:col-start-1 md:row-start-2"
					/>
					<Feature
						color="gradient"
						number={3}
						title={t('page_home.section_how.cardTitle3')}
						body={t('page_home.section_how.cardSubtitle3')}
						className="md:row-span-2 md:col-start-2 md:row-start-1"
						isFeatured
						image={how.src}
					/>
				</div>
				<ButtonLink
					label={t('page_home.mainAction')}
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
					{t('page_home.section_features.title')}
				</h2>
				<div className="flex flex-col gap-4 md:gap-0 max-w-[960px] px-4">
					<div className="flex flex-col md:flex-row items-stretch">
						<div className="flex-1 flex flex-col justify-center gap-4 py-8 relative">
							<h3 className="text-3xl pr-6 pl-4">
								{t(
									'page_home.section_features.titleFeatureOne',
								)}
							</h3>
							<p className="font-body font-medium opacity-70 pr-6 pl-4">
								{t('page_home.section_features.bodyFeatureOne')}
							</p>
							<ButtonLink
								label={t('page_home.mainAction')}
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
									'page_home.section_features.titleFeatureTwo',
								)}
							</h3>
							<p className="font-body font-medium opacity-70 pr-4 pl-6">
								{t(
									'page_home.section_features.bodyFeatureTwo1',
								)}
							</p>
							<p className="font-body font-medium opacity-70 pr-4 pl-6">
								{t(
									'page_home.section_features.bodyFeatureTwo2',
								)}
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
								{t(
									'page_home.section_features.titleFeatureThree',
								)}
							</h3>
							<p className="font-body font-medium opacity-70 pr-6 pl-4">
								{t(
									'page_home.section_features.bodyFeatureThree',
								)}
							</p>
							<ButtonLink
								label={t('page_home.mainAction')}
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
								{t(
									'page_home.section_features.titleFeatureFour',
								)}
							</h3>
							<p className="font-body font-medium opacity-70 pr-4 pl-6">
								{t(
									'page_home.section_features.bodyFeatureFour1',
								)}
							</p>
							<p className="font-body font-medium opacity-70 pr-4 pl-6">
								{t(
									'page_home.section_features.bodyFeatureFour2',
								)}
							</p>
							<ButtonLink
								label={t('page_home.mainAction')}
								href="/app"
								iconLeft={<IconAccountCircle />}
								className="w-fit ml-6 -mb-3"
							/>
							<ButtonLink
								label={t('page_home.pilotHouseAction')}
								href="https://www.bnbexplorer.com/es/public/37a03a95-cd39-4d40-a22b-7628cbb50245/welcome/highlights"
								color="secondary"
								className="w-fit ml-6"
								target="_blank"
							/>
							<span className="w-[32px] h-[32px] bg-primary-400 absolute top-0 left-0 hidden md:block">
								<span className="w-[32px] h-[32px] bg-white rounded-tl-xl block"></span>
							</span>
						</div>
					</div>
				</div>
			</section>
			<section
				aria-labelledby="artificial-inteligence"
				className={`flex flex-col md:flex-row justify-start items-center rounded-lg mt-2 px-4 max-w-[1400px] ml-auto mr-auto relative overflow-hidden py-8 ${styles.ai_section}`}
			>
				<div className="w-full flex justify-center items-center relative max-w-[800px]">
					<ChimneyEffect
						mode="bubble"
						size={120}
						frequency={250}
						duration={4000}
						className="absolute top-[56%] left-[50%]"
					/>
					<Image
						alt={t('Enlace público')}
						src={rooftopCentered}
						sizes="100vw"
						style={{
							height: 'auto',
						}}
					/>
				</div>

				<div className="flex flex-col gap-8 max-w-[400px] md:max-w-sm items-center text-center relative w-full mr-0">
					<div className="absolute -inset-1 z-[-1] rounded-md bg-gradient-to-tr from-[#FF6B06] to-[#31C48D] blur-xl opacity-30"></div>
					<Feature
						color="gradient"
						icon={<IconFavorite color="white" />}
						body={t('page_home.section_ai.body1')}
					/>
					<Feature
						color="gradient"
						icon={<IconInterests color="white" />}
						body={t('page_home.section_ai.body2')}
					/>
				</div>
			</section>
			<section
				aria-labelledby="benefits"
				className="flex flex-col gap-8 rounded-lg mt-2 px-4 py-12 items-center max-w-[1400px] ml-auto mr-auto bg-gray-50 relative"
			>
				<Image
					src={blur}
					fill={true}
					alt="Blur image"
					className="z-0 object-cover md:object-fill md:h-full md:w-auto"
				/>
				<div className="relative z-1 flex flex-col gap-8">
					<h2
						id="benefits"
						className="font-heading text-4xl font-bold max-w-[800px] ml-auto mr-auto px-4 text-center"
					>
						{t('page_home.section_benefits.title')}
					</h2>
					<h3 className="font-heading font-medium text-xl md:text-2xl max-w-[800px] ml-auto mr-auto px-4 text-center">
						{t('page_home.section_benefits.subtitle')}
					</h3>
					<div className="flex flex-col items-center rounded-xl bg-white overflow-hidden shadow-2xl/20">
						<div className="flex items-center p-4 gap-4 font-bold w-full bg-primary-400">
							<p className="w-full text-xl text-white">
								{t('Ventajas')}
							</p>
							<p className="w-full text-xl text-white">
								{t('Detalles')}
							</p>
						</div>
						<div className="flex w-full items-center p-4 gap-4 font-body">
							<ListItem
								icon={<IconCancel color="error" />}
								label={t(
									'page_home.section_benefits.negative1',
								)}
							/>
							<ListItem
								icon={<IconCheckCircle color="primary" />}
								label={t(
									'page_home.section_benefits.positive1',
								)}
							/>
						</div>
						<div className="flex w-full items-center p-4 gap-4 font-body bg-primary-50">
							<ListItem
								icon={<IconCancel color="error" />}
								label={t(
									'page_home.section_benefits.negative2',
								)}
							/>
							<ListItem
								icon={<IconCheckCircle color="primary" />}
								label={t(
									'page_home.section_benefits.positive2',
								)}
							/>
						</div>
						<div className="flex w-full items-center p-4 gap-4 font-body">
							<ListItem
								icon={<IconCancel color="error" />}
								label={t(
									'page_home.section_benefits.negative3',
								)}
							/>
							<ListItem
								icon={<IconCheckCircle color="primary" />}
								label={t(
									'page_home.section_benefits.positive3',
								)}
							/>
						</div>
						<div className="flex w-full items-center p-4 gap-4 font-body bg-primary-50">
							<ListItem
								icon={<IconCancel color="error" />}
								label={t(
									'page_home.section_benefits.negative4',
								)}
							/>
							<ListItem
								icon={<IconCheckCircle color="primary" />}
								label={t(
									'page_home.section_benefits.positive4',
								)}
							/>
						</div>
						<div className="flex w-full items-center p-4 gap-4 font-body">
							<ListItem
								icon={<IconCancel color="error" />}
								label={t(
									'page_home.section_benefits.negative5',
								)}
							/>
							<ListItem
								icon={<IconCheckCircle color="primary" />}
								label={t(
									'page_home.section_benefits.positive5',
								)}
							/>
						</div>
						<div className="flex w-full items-center p-4 gap-4 font-body bg-primary-50">
							<ListItem
								icon={<IconCancel color="error" />}
								label={t(
									'page_home.section_benefits.negative6',
								)}
							/>
							<ListItem
								icon={<IconCheckCircle color="primary" />}
								label={t(
									'page_home.section_benefits.positive6',
								)}
							/>
						</div>
						<div className="flex w-full items-center p-4 gap-4 font-body">
							<ListItem
								icon={<IconCancel color="error" />}
								label={t(
									'page_home.section_benefits.negative7',
								)}
							/>
							<ListItem
								icon={<IconCheckCircle color="primary" />}
								label={t(
									'page_home.section_benefits.positive7',
								)}
							/>
						</div>
					</div>
					<ButtonLink
						label={t('page_home.mainAction')}
						href="/app"
						iconLeft={<IconAccountCircle />}
						className="w-fit mx-auto"
					/>
				</div>
			</section>
			<section
				aria-labelledby="quotes"
				className="flex flex-col gap-8 rounded-lg mt-2 px-4 py-12 items-center max-w-[1400px] ml-auto mr-auto"
			>
				<div className="flex flex-col lg:flex-row items-center max-w-[1200px] gap-6 ml-auto mr-auto">
					<div className="w-full lg:max-w-[500px] flex flex-col justify-center gap-4 p-6 relative">
						<h2
							id="quotes"
							className="font-heading text-4xl font-bold"
						>
							{t('page_home.section_quotes.title')}
						</h2>
						<h3 className="text-xl md:text-2xl">
							{t('page_home.section_quotes.subtitle')}
						</h3>
						<ButtonLink
							label={t('page_home.mainAction')}
							href="/app"
							iconLeft={<IconAccountCircle />}
							className="w-fit"
						/>
					</div>
					<div className="w-full flex flex-col items-center">
						<div className="flex flex-col gap-2 sm:flex-row items-center">
							<Quote
								title={t(
									'page_home.section_quotes.quote1Title',
								)}
								body={t('page_home.section_quotes.quote1Body')}
								person={t(
									'page_home.section_quotes.quote1Person',
								)}
								image={testimony01.src}
								isFeatured
							/>
							<div className="flex flex-col gap-2">
								<Quote
									title={t(
										'page_home.section_quotes.quote2Title',
									)}
									body={t(
										'page_home.section_quotes.quote2Body',
									)}
									person={t(
										'page_home.section_quotes.quote2Person',
									)}
									image={testimony02.src}
								/>
								<Quote
									title={t(
										'page_home.section_quotes.quote3Title',
									)}
									body={t(
										'page_home.section_quotes.quote3Body',
									)}
									person={t(
										'page_home.section_quotes.quote3Person',
									)}
									image={testimony03.src}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="text-center pt-24 pb-4 px-4 flex flex-col gap-4 items-center">
					<div className="flex flex-col items-center mb-12">
						<p className="font-bold">{t('shareButtonTitle')}</p>
						<p className="mb-3">{t('shareButtonText')}</p>
						<ShareMenu
							url="https://bnbexplorer.com"
							surface="landing_header"
							distinctId="anon-missing"
						/>
					</div>
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
			</section>
		</div>
	);
}
