'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSidebarData } from '@/lib/context/EditMenuContext';

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
import ButtonLink from '@/components/molecules/button-link';
import GroupItem from '@/components/molecules/group-item';
// import { LODGING_CATEGORY_ID } from '@/config/config-constants';

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
};

const PropertySidebar = ({ propertyId }: PropertySidebarProps) => {
	const t = useTranslations();

	const {
		sidebarData,
		activeCategoryId,
		activeSubCategoryType,
		setActiveCategoryId,
		activeSubCategoryId,
		setActiveSubCategoryId,
		setActiveSubCategoryType,
		activeSubCategoryName,
		setActiveSubCategoryName,
	} = useSidebarData();

	const router = useRouter();

	useEffect(() => {
		if (sidebarData) {
			setActiveCategoryId(
				activeCategoryId ? activeCategoryId : sidebarData[0].id
			);
			setActiveSubCategoryId(
				activeSubCategoryId
					? activeSubCategoryId
					: sidebarData[0].sub_categories[0].id
			);
			setActiveSubCategoryType(
				activeSubCategoryType
					? activeSubCategoryType
					: sidebarData[0].sub_categories[0].type
			);
			setActiveSubCategoryName(
				activeSubCategoryName
					? activeSubCategoryName
					: sidebarData[0].sub_categories[0].type
			);
		}
	}, [
		activeCategoryId,
		activeSubCategoryId,
		activeSubCategoryName,
		activeSubCategoryType,
		setActiveCategoryId,
		setActiveSubCategoryId,
		setActiveSubCategoryName,
		setActiveSubCategoryType,
		sidebarData,
	]);

	return (
		<>
			<ButtonLink
				label={t('Mis Propiedades')}
				href="/app/properties"
				iconLeft={<IconApartment />}
				className="hidden md:flex w-full"
			/>
			{sidebarData &&
				sidebarData.map((category) => {
					const iconName = category.icon as IconName;
					const IconComponent = ICON_COMPONENTS[iconName];

					return (
						<CategoryAccordion
							key={category.name}
							open={category.id === activeCategoryId}
							name={t(category.name)}
							onClick={() => setActiveCategoryId(category.id)}
							icon={<IconComponent />}
						>
							{category.sub_categories.map((subcategory) => {
								return (
									<GroupItem
										key={subcategory.id}
										label={t(subcategory.name)}
										active={
											subcategory.id ===
											activeSubCategoryId
										}
										editeable={
											subcategory.type === 'info' &&
											subcategory.id ===
												activeSubCategoryId
										}
										onClick={() => {
											setActiveSubCategoryId(
												subcategory.id
											);
											setActiveSubCategoryType(
												subcategory.type
											);
											setActiveCategoryId(category.id);
											setActiveSubCategoryName(
												subcategory.name
											);
										}}
										handleEdit={(e) => {
											e.stopPropagation();
											router.push(
												`/app/info/${propertyId}/${category.id}/${subcategory.id}`
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
