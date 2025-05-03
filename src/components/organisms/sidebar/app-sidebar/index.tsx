import { useTranslations } from 'next-intl';

import { SIDEBAR_MENU } from '@/config/config-constants';

import IconHome from '@/components/atoms/icon/home';
import IconAccountCircle from '@/components/atoms/icon/account-circle';
import IconAdd from '@/components/atoms/icon/add';
import IconApartment from '@/components/atoms/icon/apartment';
import IconNewRelease from '@/components/atoms/icon/new-releases';
import IconLanguage from '@/components/atoms/icon/language';
import SidebarMenuItem from '@/components/molecules/sidebar-menu-item';

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

				return (
					<SidebarMenuItem
						key={item.label}
						icon={<IconComponent />}
						href={item.url}
						label={t(item.label)}
					/>
				);
			})}
		</>
	);
};

export default AppSidebar;
