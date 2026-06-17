"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useSidebarData } from "@/lib/context/EditMenuContext";
import { useSidebar } from "@/lib/context/SidebarContext";

import IconApartment from "@/components/atoms/icon/apartment";
import IconHealing from "@/components/atoms/icon/healing";
import IconForkSpoon from "@/components/atoms/icon/fork-spoon";
import IconMuseum from "@/components/atoms/icon/museum";
import IconNature from "@/components/atoms/icon/nature";
import IconLocalAtm from "@/components/atoms/icon/local-atm";
import IconTrain from "@/components/atoms/icon/train";
import IconNightLife from "@/components/atoms/icon/nightlife";
import IconComedyMask from "@/components/atoms/icon/comedy-mask";
import IconEmergency from "@/components/atoms/icon/e911-emergency";
import IconFamilyRestroom from "@/components/atoms/icon/family-restroom";
import IconPets from "@/components/atoms/icon/pets";
import IconInterests from "@/components/atoms/icon/interests";
import IconShoppingBag from "@/components/atoms/icon/shopping-bag";
import CategoryAccordion from "@/components/molecules/category-accordion";
import GroupItem from "@/components/molecules/group-item";
import ButtonLink from "@/components/molecules/button-link";
import IconOpenInNew from "@/components/atoms/icon/open-in-new";
import Button from "@/components/molecules/button";
import IconClose from "@/components/atoms/icon/close";

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

    const [openCategoryId, setOpenCategoryId] = useState<string | null>(
        categoryId ?? null,
    );

    const handleCategoryToggle = (id: string) => {
        setOpenCategoryId((prev) => (prev === id ? null : id));
    };

    const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL}/public/${propertyId}/welcome/highlights`;

    return (
        <>
            <div className="flex gap-1 items-center md:hidden">
                <Button
                    label={t("Ocultar menú")}
                    color="primary"
                    onClick={closeSidebar}
                    iconLeft={<IconClose />}
                    className="w-fit shrink-0"
                />
                <ButtonLink
                    className="gap-1 w-full"
                    color="primary"
                    iconRight={<IconOpenInNew />}
                    label={t("Sitio público")}
                    href={publicUrl}
                    target="_blank"
                />
            </div>
            {sidebarData &&
                sidebarData.map((category) => {
                    const iconName = category.icon as IconName;
                    const IconComponent = ICON_COMPONENTS[iconName];

                    const hasContent = category.sub_categories.some(
                        (sub) => (subCategoryCounts[sub.id] ?? 0) > 0,
                    );

                    const isActive = category.id === categoryId;
                    const isOpen = category.id === openCategoryId;

                    return (
                        <CategoryAccordion
                            key={category.name}
                            open={isOpen}
                            active={isActive}
                            name={t(category.name)}
                            hasContent={hasContent}
                            onClick={() => handleCategoryToggle(category.id)}
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
                                        onClick={() => {
                                            closeSidebar();
                                            router.push(
                                                `/app/properties/${propertyId}/${category.id}/${subcategory.id}`,
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
