import { useTranslations } from 'next-intl';

import { SIDEBAR_MENU } from '@/config/config-constants';

import IconHome from '@/components/atoms/icon/home';
import IconAccountCircle from '@/components/atoms/icon/account-circle';
import IconAdd from '@/components/atoms/icon/add';
import IconApartment from '@/components/atoms/icon/apartment';
import IconNewRelease from '@/components/atoms/icon/new-releases';
import IconLanguage from '@/components/atoms/icon/language';
import SidebarMenuItem from '@/components/molecules/sidebar-menu-item';
import ButtonLink from '@/components/molecules/button-link';
import IconHelp from '@/components/atoms/icon/help';
import CreatePropertyEntry from '@/components/molecules/property-entry';
import DemoHomeModal from '../../supademo/home-modal';

import { DEMOS } from '@/config/config-constants';
import Feature from '@/components/molecules/card/feature';
import Typography from '@/components/atoms/typography';

const ICON_COMPONENTS = {
	IconHome,
	IconAccountCircle,
	IconAdd,
	IconNewRelease,
	IconApartment,
	IconLanguage,
} as const;

type IconName = keyof typeof ICON_COMPONENTS;

const AppSidebar = () => {
	const t = useTranslations();

	return (
		<>
			{SIDEBAR_MENU.map((item) => {
				const iconName = item.icon as IconName;
				const IconComponent = ICON_COMPONENTS[iconName];
				const url = item.url;

				if (url === '/app/properties/new') {
					return (
						<CreatePropertyEntry
							href="/app/properties/new"
							key={item.label}
							link={
								<SidebarMenuItem
									key={item.label}
									icon={<IconComponent />}
									href={item.url}
									label={t(item.label)}
								/>
							}
							action={
								<div
									className={`rounded-md w-full transition-all flex items-center gap-2 hover:bg-secondary-200 hover:cursor-pointer disabled:pointer-events-none font-medium text-sm text-md py-4 px-3.5`}
								>
									<IconAdd />
									{t(item.label)}
								</div>
							}
						/>
					);
				} else {
					return (
						<SidebarMenuItem
							key={item.label}
							icon={<IconComponent />}
							href={item.url}
							label={t(item.label)}
						/>
					);
				}
			})}
			<SidebarMenuItem
				icon={<IconHelp />}
				href="/app/feedback/dashboard"
				label={t('feedback.cta')}
			/>
			<DemoHomeModal demos={DEMOS} buttonColor="secondary" />
			<Feature
				color="gradient"
				icon={<IconHome color="white" />}
				// title={t('fiveStarReviews.title')}
				// body={t('fiveStarReviews.description')}
				className="md:row-span-2"
				isFeatured
				image="/static/img/5-stars.webp"
				imageMinHeight="250px"
			>
				<Typography component="h3" className="-mt-6 text-lg!">
					{t('fiveStarReviews.title')}
				</Typography>
				<Typography size="sm" className="mb-3">
					{t('fiveStarReviews.description')}
				</Typography>
				<ButtonLink
					label={t('Mis propiedades')}
					href={`/app/properties`}
					color="secondary"
					className="w-full"
					iconLeft={<IconApartment />}
				/>
			</Feature>
		</>
	);
};

export default AppSidebar;
