"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSidebar } from "@/lib/context/SidebarContext";
import { usePublicSidebarData } from "@/lib/context/EditPublicMenuContext";
import { useRouter } from "next/navigation";

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
import IconClose from "@/components/atoms/icon/close";
import CategoryAccordion from "@/components/molecules/category-accordion";
import Button from "@/components/molecules/button";
import GroupItem from "@/components/molecules/group-item";
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

type PublicSidebarProps = {
    propertyId?: string;
    categoryId?: string;
    subCategoryId?: string;
};

/**
 * Sidebar de categorías de localizaciones ("Explorar"). El resto de
 * secciones de la guía se navegan desde el PublicGuideNav.
 */
const PublicSidebar = ({
    propertyId,
    categoryId,
    subCategoryId,
}: PublicSidebarProps) => {
    const t = useTranslations();
    const router = useRouter();
    const { isOpen: isSidebarOpen, openSidebar, closeSidebar } = useSidebar();
    const { sidebarData, setActiveSubCategoryType, subCategoryCounts } =
        usePublicSidebarData();

    const [openCategoryId, setOpenCategoryId] = useState<string | null>(
        categoryId ?? null,
    );

    const handleCategoryToggle = (id: string): void => {
        setOpenCategoryId((prev) => (prev === id ? null : id));
    };

    const isCategoryOpen = (id: string): boolean => id === openCategoryId;
    const isCategoryActive = (id: string): boolean => id === categoryId;

    // Desde el rail: abre el overlay con esa sección desplegada (sin toggle)
    const openCategory = (id: string): void => {
        setOpenCategoryId(id);
        openSidebar();
    };

    // Mismo orden que los acordeones del árbol
    const railItems: SidebarRailItem[] = (sidebarData ?? []).map(
        (category) => {
            const IconComponent = ICON_COMPONENTS[category.icon as IconName];

            return {
                id: category.id,
                label: t(category.name),
                icon: <IconComponent />,
                active: isCategoryActive(category.id),
            };
        },
    );

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
            <div className="flex gap-2 items-center justify-between mb-2">
                <h2 className="pl-2 font-body font-semibold text-xs uppercase tracking-wide text-gray-500">
                    {t("guideNavPlaces")}
                </h2>
                <Button
                    color="text"
                    label={t("Cerrar")}
                    iconLeft={<IconClose />}
                    onClick={closeSidebar}
                    className="lg:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                />
            </div>

            <div className="flex flex-col gap-1">
                {sidebarData &&
                    sidebarData.map((category) => {
                        const iconName = category.icon as IconName;
                        const IconComponent = ICON_COMPONENTS[iconName];

                        return (
                            <CategoryAccordion
                                key={category.name}
                                open={isCategoryOpen(category.id)}
                                active={isCategoryActive(category.id)}
                                name={t(category.name)}
                                onClick={() =>
                                    handleCategoryToggle(category.id)
                                }
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
                                                setActiveSubCategoryType(
                                                    subcategory.type,
                                                );
                                                closeSidebar();
                                                router.push(
                                                    `/public/${propertyId}/${category.id}/${subcategory.id}`,
                                                );
                                            }}
                                        />
                                    );
                                })}
                            </CategoryAccordion>
                        );
                    })}
            </div>
        </SidebarShell>
    );
};

export default PublicSidebar;
