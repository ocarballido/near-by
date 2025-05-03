'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import { useDropdown } from '@/hooks/useDropdown';
import { useRouter } from 'next/navigation';

import { USER_MENU_OPTIONS } from '@/config/config-constants';
import { createSPASassClient } from '@/lib/supabase/client';

import Avatar from '@/components/atoms/avatar';
import IconAccountCircle from '@/components/atoms/icon/account-circle';
import IconPersonAdd from '@/components/atoms/icon/person-add';
import IconNewRelease from '@/components/atoms/icon/new-releases';
import IconHome from '@/components/atoms/icon/home';
import IconLanguage from '@/components/atoms/icon/language';
import IconLogout from '@/components/atoms/icon/logout';
import DropdownMenu from '@/components/atoms/dropdown-menu';
import DropdownItemButton from '../dropdown-item-button';

interface MenuOption {
	label: string;
	url: string;
	icon: string;
}

const ICON_COMPONENTS: Record<string, React.ComponentType> = {
	IconAccountCircle,
	IconPersonAdd,
	IconHome,
	IconNewRelease,
	IconLanguage,
	IconLogout,
};

const UserMenu = () => {
	const t = useTranslations();

	const pathname = usePathname();
	const router = useRouter();

	const { open, toggleDropdown, dropdownRef } = useDropdown();

	const handleLogout = async () => {
		try {
			const client = await createSPASassClient();
			await client.logout();
		} catch (error) {
			console.error('Error logging out:', error);
		}
	};

	return (
		<div ref={dropdownRef} className="relative">
			<Avatar onClick={toggleDropdown} />
			<DropdownMenu open={open} className="absolute z-50 right-0 top-11">
				{USER_MENU_OPTIONS.map((option: MenuOption) => {
					const IconComponent = ICON_COMPONENTS[option.icon];
					return (
						<DropdownItemButton
							key={option.label}
							active={pathname === option.url}
							onClick={() => {
								toggleDropdown();
								router.push(option.url);
							}}
							label={t(option.label)}
							icon={IconComponent ? <IconComponent /> : null}
						/>
					);
				})}
				<DropdownItemButton
					onClick={handleLogout}
					label={t('Cerrar Sesión')}
					icon={<IconLogout />}
				/>
			</DropdownMenu>
		</div>
	);
};

export default UserMenu;
