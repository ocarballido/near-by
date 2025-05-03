'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import IconHome from '@/components/atoms/icon/home';
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

type Subcategory = {
	id: string;
	label: string;
	href: string;
};

type Category = {
	id: string;
	name: string;
	icon: string;
	firstEntryId: string;
};

type PropertySidebarProps = {
	propertySlug?: string;
	categoryId?: string;
	categories?: Category[];
	subCategories?: Subcategory[];
	subcategoryGroupId?: string;
};

const PropertySidebar = ({
	categoryId,
	categories = [],
	subCategories = [],
	subcategoryGroupId,
	propertySlug,
}: PropertySidebarProps) => {
	const t = useTranslations();

	const router = useRouter();

	return (
		<>
			<ButtonLink
				label={t('Mis Alojamientos')}
				href="/app/properties"
				iconLeft={<IconHome />}
				className="hidden md:flex w-full"
			/>
			{categories.map((category) => {
				const iconName = category.icon as IconName;
				const IconComponent = ICON_COMPONENTS[iconName];

				return (
					<CategoryAccordion
						key={category.name}
						open={category.id === categoryId}
						name={t(category.name)}
						href={
							category.firstEntryId
								? `/app/properties/${propertySlug}/${category.id}/${category.firstEntryId}`
								: `/app/properties/${propertySlug}/${category.id}`
						}
						icon={<IconComponent />}
					>
						{subCategories.map((subcategory) => (
							<GroupItem
								key={subcategory.id}
								label={t(subcategory.label)}
								active={subcategory.id === subcategoryGroupId}
								onClick={() => router.push(subcategory.href)}
							/>
						))}
					</CategoryAccordion>
				);
			})}
		</>
	);
};

export default PropertySidebar;
