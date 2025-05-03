'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import { useRouter } from 'next/navigation';
import { useDropdown } from '@/hooks/useDropdown';

import {
	PRIVATE_MENU_OPTIONS,
	USER_MENU_OPTIONS,
} from '@/config/config-constants';

import ButtonIcon from '@/components/atoms/button-icon';
import IconApartment from '@/components/atoms/icon/apartment';
import IconAccountCircle from '@/components/atoms/icon/account-circle';
import IconPersonAdd from '@/components/atoms/icon/person-add';
import IconNewRelease from '@/components/atoms/icon/new-releases';
import IconLanguage from '@/components/atoms/icon/language';
import IconLogout from '@/components/atoms/icon/logout';
import IconClose from '@/components/atoms/icon/close';
import IconHome from '@/components/atoms/icon/home';
import IconMenu from '@/components/atoms/icon/menu';
import IconAdd from '@/components/atoms/icon/add';
import DropdownMenu from '@/components/atoms/dropdown-menu';
import DropdownItemButton from '../dropdown-item-button';
import LanguageSelector from '../language-selector';

interface MenuOption {
	label: string;
	url: string;
	icon: string;
}

const ICON_COMPONENTS: Record<string, React.ComponentType> = {
	IconApartment,
	IconAdd,
	IconAccountCircle,
	IconPersonAdd,
	IconHome,
	IconNewRelease,
	IconLanguage,
	IconLogout,
};

const PrivateMenu = () => {
	const t = useTranslations();

	const pathname = usePathname();
	const router = useRouter();

	const { open, toggleDropdown, dropdownRef } = useDropdown();

	return (
		<div ref={dropdownRef} className="relative">
			<ButtonIcon
				color="white"
				icon={open ? <IconClose /> : <IconMenu />}
				onClick={toggleDropdown}
			/>
			<DropdownMenu
				open={open}
				className="left-0 top-0 fixed flex rounded-none w-full h-full p-4 sm:p-2 sm:absolute sm:top-11 sm:rounded-2xl sm:w-max sm:h-max"
			>
				<div className="flex sm:hidden">
					<ButtonIcon
						className="mr-auto"
						icon={<IconClose />}
						onClick={toggleDropdown}
					/>
					<div className="flex sm:hidden">
						<LanguageSelector />
					</div>
				</div>
				{PRIVATE_MENU_OPTIONS.map((option: MenuOption) => {
					const IconComponent = ICON_COMPONENTS[option.icon];
					return (
						<DropdownItemButton
							key={option.label}
							active={
								pathname === option.url &&
								option.label !== 'Web Pública'
							}
							onClick={() => {
								toggleDropdown();
								router.push(option.url);
							}}
							label={t(option.label)}
							icon={IconComponent ? <IconComponent /> : null}
						/>
					);
				})}
				<div className="flex flex-col gap-2 sm:hidden">
					{USER_MENU_OPTIONS.map((option: MenuOption) => {
						const IconComponent = ICON_COMPONENTS[option.icon];
						return (
							<DropdownItemButton
								key={option.label}
								active={
									pathname.includes(option.url) &&
									option.label !== 'Web Pública'
								}
								onClick={() => {
									toggleDropdown();
									router.push(option.url);
								}}
								label={t(option.label)}
								icon={IconComponent ? <IconComponent /> : null}
							/>
						);
					})}
				</div>
			</DropdownMenu>
		</div>
	);
};

export default PrivateMenu;
