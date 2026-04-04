'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useSidebarData } from '@/lib/context/EditMenuContext';
import { useSidebar } from '@/lib/context/SidebarContext';

import IconApartment from '@/components/atoms/icon/apartment';
import IconHealing from '@/components/atoms/icon/healing';
import IconForkSpoon from '@/components/atoms/icon/fork-spoon';
import IconMuseum from '@/components/atoms/icon/museum';
import IconNature from '@/components/atoms/icon/nature';
import IconLocalAtm from '@/components/atoms/icon/local-atm';
import IconTrain from '@/components/atoms/icon/train';
import IconNightLife from '@/components/atoms/icon/nightlife';
import IconComedyMask from '@/components/atoms/icon/comedy-mask';
import IconEmergency from '@/components/atoms/icon/e911-emergency';
import IconFamilyRestroom from '@/components/atoms/icon/family-restroom';
import IconPets from '@/components/atoms/icon/pets';
import IconInterests from '@/components/atoms/icon/interests';
import IconShoppingBag from '@/components/atoms/icon/shopping-bag';
import CategoryAccordion from '@/components/molecules/category-accordion';
import GroupItem from '@/components/molecules/group-item';

const ICON_COMPONENTS = {
	IconHealing,
	IconForkSpoon,
	IconApartment,
	IconMuseum,
	IconNature,
	IconLocalAtm,
	IconTrain,
	IconNightLife,
	IconComedyMask,
	IconEmergency,
	IconFamilyRestroom,
	IconPets,
	IconInterests,
	IconShoppingBag,
} as const;

type IconName = keyof typeof ICON_COMPONENTS;

type PropertySidebarProps = {
	propertyId?: string;
	categoryId?: string;
	subCategoryId?: string;
};

const PropertySidebar = ({
	propertyId,
	categoryId,
	subCategoryId,
}: PropertySidebarProps) => {
	const t = useTranslations();
	const { sidebarData, subCategoryCounts } = useSidebarData();
	const { closeSidebar } = useSidebar();
	const router = useRouter();

	return (
		<>
			{sidebarData &&
				sidebarData.map((category) => {
					const iconName = category.icon as IconName;
					const IconComponent = ICON_COMPONENTS[iconName];

					const hasContent = category.sub_categories.some(
						(sub) => (subCategoryCounts[sub.id] ?? 0) > 0,
					);

					return (
						<CategoryAccordion
							key={category.name}
							open={category.id === categoryId}
							name={t(category.name)}
							hasContent={hasContent}
							onClick={() => {
								closeSidebar();
								router.push(
									`/app/properties/${propertyId}/${category.id}/${category.sub_categories[0].id}`,
								);
							}}
							icon={<IconComponent />}
						>
							{category.sub_categories.map((subcategory) => {
								const count =
									subCategoryCounts[subcategory.id] ?? 0;
								return (
									<GroupItem
										key={subcategory.id}
										label={t(subcategory.name)}
										count={count}
										active={
											subcategory.id === subCategoryId
										}
										editeable={
											subcategory.type === 'info' &&
											subcategory.id === subCategoryId
										}
										onClick={() => {
											closeSidebar();
											router.push(
												`/app/properties/${propertyId}/${category.id}/${subcategory.id}`,
											);
										}}
										handleEdit={(e) => {
											e.stopPropagation();
											router.push(
												`/app/info/${propertyId}/${category.id}/${subcategory.id}`,
											);
										}}
									/>
								);
							})}
						</CategoryAccordion>
					);
				})}
		</>
	);
};

export default PropertySidebar;
