'use client';

import { useTranslations } from 'next-intl';
import { useSidebar } from '@/lib/context/SidebarContext';
import { usePublicSidebarData } from '@/lib/context/EditPublicMenuContext';
import { useRouter } from 'next/navigation';

import clsx from 'clsx';

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
import IconClose from '@/components/atoms/icon/close';
import CategoryAccordion from '@/components/molecules/category-accordion';
import Button from '@/components/molecules/button';
import GroupItem from '@/components/molecules/group-item';
import IconHome from '@/components/atoms/icon/home';
import IconMap from '@/components/atoms/icon/map';

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

type PublicSidebarProps = {
	propertyId?: string;
	categoryId?: string;
	subCategoryId?: string;
};

const PublicSidebar = ({
	propertyId,
	categoryId,
	subCategoryId,
}: PublicSidebarProps) => {
	const t = useTranslations();

	const router = useRouter();

	const { isOpen, closeSidebar } = useSidebar();

	const sidebarContentStyles = clsx(
		{ 'translate-x-0': isOpen },
		{ '-translate-x-full': !isOpen }
	);

	const { sidebarData, setActiveSubCategoryType } = usePublicSidebarData();

	return (
		<>
			<aside
				className={`fixed bottom-0 left-0 right-0 top-0 p-4 z-10 overflow-y-scroll md:top-0 md:p-0 md:overflow-y-auto md:relative md:w-full md:max-w-80 grow flex gap-2 flex-col md:h-fit bg-gray-100 transition-all duration-300 md:translate-x-0 ${sidebarContentStyles}`}
			>
				<div className="flex gap-2 items-center md:hidden">
					<Button
						label={t('Ocultar menú')}
						color="white"
						onClick={closeSidebar}
						iconLeft={<IconClose />}
						className="shadow-sm grow"
					/>
				</div>

				<CategoryAccordion
					open={categoryId === 'welcome'}
					name="Welcome"
					onClick={() => {
						closeSidebar();
						router.push(`/public/${propertyId}/welcome/highlights`);
					}}
					icon={<IconHome />}
				>
					<GroupItem
						label="Highlights"
						active={subCategoryId === 'highlights'}
						onClick={() => {
							closeSidebar();
							router.push(
								`/public/${propertyId}/welcome/highlights`
							);
						}}
					/>
				</CategoryAccordion>

				<CategoryAccordion
					open={categoryId === 'custom-plans'}
					name={t('Planes personalizados')}
					onClick={() => {
						closeSidebar();
						router.push(
							`/public/${propertyId}/custom-plans/create-plan`
						);
					}}
					icon={<IconMap />}
				>
					<GroupItem
						label={t('Crear plan')}
						active={subCategoryId === 'create-plan'}
						onClick={() => {
							closeSidebar();
							router.push(
								`/public/${propertyId}/custom-plans/create-plan`
							);
						}}
					/>
				</CategoryAccordion>

				{sidebarData &&
					sidebarData.map((category) => {
						const iconName = category.icon as IconName;
						const IconComponent = ICON_COMPONENTS[iconName];

						return (
							<CategoryAccordion
								key={category.name}
								open={categoryId === category.id}
								name={t(category.name)}
								onClick={() => {
									setActiveSubCategoryType(category.type);
									closeSidebar();
									router.push(
										`/public/${propertyId}/${category.id}/${category.sub_categories[0].id}`
									);
								}}
								icon={<IconComponent />}
							>
								{category.sub_categories.map((subcategory) => {
									return (
										<GroupItem
											key={subcategory.id}
											label={t(subcategory.name)}
											active={
												subcategory.id === subCategoryId
											}
											onClick={() => {
												setActiveSubCategoryType(
													subcategory.type
												);
												closeSidebar();
												router.push(
													`/public/${propertyId}/${category.id}/${subcategory.id}`
												);
											}}
										/>
									);
								})}
							</CategoryAccordion>
						);
					})}
			</aside>
		</>
	);
};

export default PublicSidebar;
