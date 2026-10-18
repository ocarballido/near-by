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
import IconEdit from "@/components/atoms/icon/edit";
import CategoryAccordion from "@/components/molecules/category-accordion";
import GroupItem from "@/components/molecules/group-item";
import SidebarLinkItem from "@/components/molecules/sidebar-link-item";
import ButtonLink from "@/components/molecules/button-link";
import IconOpenInNew from "@/components/atoms/icon/open-in-new";
import ButtonIcon from "@/components/atoms/button-icon";
import IconClose from "@/components/atoms/icon/close";
import SidebarRail, {
    type SidebarRailItem,
} from "@/components/molecules/sidebar-rail";
import SidebarShell, { SIDEBAR_PANEL_ID } from "../sidebar-shell";

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
    const { isOpen: isSidebarOpen, openSidebar, closeSidebar } = useSidebar();
    const router = useRouter();

    const [openCategoryId, setOpenCategoryId] = useState<string | null>(
        categoryId ?? null,
    );

    const handleCategoryToggle = (id: string) => {
        setOpenCategoryId((prev) => (prev === id ? null : id));
    };

    // Desde el rail: abre el overlay con esa sección desplegada (sin toggle)
    const openCategory = (id: string) => {
        setOpenCategoryId(id);
        openSidebar();
    };

    const railItems: SidebarRailItem[] = (sidebarData ?? []).map(
        (category) => {
            const IconComponent = ICON_COMPONENTS[category.icon as IconName];

            return {
                id: category.id,
                label: t(category.name),
                icon: <IconComponent />,
                active: category.id === categoryId,
            };
        },
    );

    const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL}/public/${propertyId}/welcome/highlights`;

    return (
        <SidebarShell
            rail={
                <SidebarRail
                    items={railItems}
                    isExpanded={isSidebarOpen}
                    controlsId={SIDEBAR_PANEL_ID}
                    onMenuClick={openSidebar}
                    onItemClick={openCategory}
                />
            }
        >
            <div className="flex gap-1 items-start justify-between lg:hidden">
                <ButtonLink
                    className="gap-1"
                    color="primary"
                    iconRight={<IconOpenInNew />}
                    label={t("Sitio público")}
                    href={publicUrl}
                    target="_blank"
                />
                <ButtonIcon
                    color="secondary"
                    icon={<IconClose />}
                    onClick={closeSidebar}
                    ariaLabel={t("closeMenu")}
                    className="shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                />
            </div>
            {sidebarData &&
                sidebarData.map((category, index) => {
                    const iconName = category.icon as IconName;
                    const IconComponent = ICON_COMPONENTS[iconName];

                    const isFirstCategory = index === 0;

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
                            {isFirstCategory && propertyId && (
                                <SidebarLinkItem
                                    key="property-edit-link"
                                    href={`/app/properties/edit/${propertyId}?from=manage`}
                                    label={t("Datos del alojamiento")}
                                    icon={<IconEdit size={24} />}
                                    onClick={closeSidebar}
                                />
                            )}
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
        </SidebarShell>
    );
};

export default PropertySidebar;
