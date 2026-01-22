// src/types/sidebar.ts

export type IconKey =
	| 'IconAccountCircle'
	| 'IconAdd'
	| 'IconApartment'
	| 'IconArrowLeftAlt'
	| 'IconArrowRightAlt'
	| 'IconBorderColor'
	| 'IconCancel'
	| 'IconChatBubble'
	| 'IconCheck'
	| 'IconCheckCircle'
	| 'IconChevronBackward'
	| 'IconChevronForward'
	| 'IconClose'
	| 'IconComedyMask'
	| 'IconDelete'
	| 'IconDeleteForever'
	| 'IconDirections'
	| 'IconEmergency'
	| 'IconEdit'
	| 'IconError'
	| 'IconFamilyRestroom'
	| 'IconForkSpoon'
	| 'IconHealing'
	| 'IconHelp'
	| 'IconHome'
	| 'IconInfo'
	| 'IconInterests'
	| 'IconKeyboardArrowDown'
	| 'IconKeyboardArrowUp'
	| 'IconLanguage'
	| 'IconLocalAtm'
	| 'IconLocalDining'
	| 'IconLocationOn'
	| 'IconLogout'
	| 'IconMap'
	| 'IconMenu'
	| 'IconMuseum'
	| 'IconNature'
	| 'IconNewRelease'
	| 'IconNightLife'
	| 'IconOpenInNew'
	| 'IconPersonAdd'
	| 'IconPets'
	| 'IconSearch'
	| 'IconShoppingBag'
	| 'IconTrain';

export interface SidebarMenuItemConfig {
	label: string;
	url: string;
	icon: IconKey;
}

export type SidebarSubCategory = {
	id: string;
	name: string;
	// si en tu DB es 'info' | 'location', puedes estrecharlo
	type: string;
};

export type SidebarCategoryWithSubCategories = {
	id: string;
	name: string;
	icon: string | null;
	order_index: number;
	type: 'info' | 'location';
	sub_categories: SidebarSubCategory[];
};
