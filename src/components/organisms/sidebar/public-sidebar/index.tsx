"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSidebar } from "@/lib/context/SidebarContext";
import { usePublicSidebarData } from "@/lib/context/EditPublicMenuContext";
import { useRouter } from "next/navigation";

import clsx from "clsx";

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
import IconHome from "@/components/atoms/icon/home";
import IconMap from "@/components/atoms/icon/map";
import HousePublic from "@/components/molecules/card/house-public";

import { CATEGORIES_SUB_CATEGORIES } from "@/config/config-constants";

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
    address: string;
    image?: string | null;
    latitude: number;
    longitude: number;
    name: string;
    checkInDate?: string;
    checkInTime?: string;
    checkOutDate?: string;
    checkOutTime?: string;
};

const PublicSidebar = ({
    propertyId,
    categoryId,
    subCategoryId,
    address,
    latitude,
    longitude,
    name,
    checkInDate,
    checkInTime,
    checkOutDate,
    checkOutTime,
    image = "/static/img/default-property-2x.webp",
}: PublicSidebarProps) => {
    const t = useTranslations();
    const router = useRouter();
    const { isOpen: isSidebarOpen, closeSidebar } = useSidebar();
    const {
        sidebarData,
        setActiveSubCategoryType,
        hasInfoContent,
        subCategoryCounts,
    } = usePublicSidebarData();

    const [openCategoryId, setOpenCategoryId] = useState<string | null>(
        categoryId ?? null,
    );

    const handleCategoryToggle = (id: string): void => {
        setOpenCategoryId((prev) => (prev === id ? null : id));
    };

    const isCategoryOpen = (id: string): boolean => id === openCategoryId;
    const isCategoryActive = (id: string): boolean => id === categoryId;

    const sidebarContentStyles = clsx(
        { "translate-x-0": isSidebarOpen },
        { "-translate-x-full": !isSidebarOpen },
    );

    return (
        <>
            <aside
                className={`fixed bottom-0 left-0 right-0 top-0 p-4 z-10 overflow-y-scroll md:top-0 md:p-0 md:overflow-y-auto md:relative md:w-full md:max-w-80 grow flex gap-2 flex-col md:h-fit transition-all duration-300 md:translate-x-0 bg-[#EFEFEF] ${sidebarContentStyles}`}
            >
                <HousePublic
                    address={address}
                    latitude={latitude}
                    longitude={longitude}
                    name={name}
                    image={image}
                    checkInDate={checkInDate}
                    checkInTime={checkInTime}
                    checkOutDate={checkOutDate}
                    checkOutTime={checkOutTime}
                    className="hidden md:flex"
                />
                <div className="flex gap-2 items-center md:hidden">
                    <Button
                        label={t("Ocultar menú")}
                        color="white"
                        onClick={closeSidebar}
                        iconLeft={<IconClose />}
                        className="shadow-sm grow"
                    />
                </div>

                <CategoryAccordion
                    open={isCategoryOpen("welcome")}
                    active={isCategoryActive("welcome")}
                    name="Welcome"
                    onClick={() => handleCategoryToggle("welcome")}
                    icon={<IconHome />}
                >
                    <GroupItem
                        label="Highlights"
                        active={subCategoryId === "highlights"}
                        onClick={() => {
                            closeSidebar();
                            router.push(
                                `/public/${propertyId}/welcome/highlights`,
                            );
                        }}
                    />
                </CategoryAccordion>

                {hasInfoContent && (
                    <CategoryAccordion
                        open={isCategoryOpen(
                            CATEGORIES_SUB_CATEGORIES.LODGING.id,
                        )}
                        active={isCategoryActive(
                            CATEGORIES_SUB_CATEGORIES.LODGING.id,
                        )}
                        name={t("El Alojamiento")}
                        onClick={() =>
                            handleCategoryToggle(
                                CATEGORIES_SUB_CATEGORIES.LODGING.id,
                            )
                        }
                        icon={<IconApartment />}
                    >
                        <GroupItem
                            label={t("El Alojamiento")}
                            active={
                                categoryId ===
                                CATEGORIES_SUB_CATEGORIES.LODGING.id
                            }
                            onClick={() => {
                                closeSidebar();
                                router.push(
                                    `/public/${propertyId}/${CATEGORIES_SUB_CATEGORIES.LODGING.id}/info`,
                                );
                            }}
                        />
                    </CategoryAccordion>
                )}

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

                <CategoryAccordion
                    open={isCategoryOpen("custom-plans")}
                    active={isCategoryActive("custom-plans")}
                    name={t("Planes personalizados")}
                    onClick={() => handleCategoryToggle("custom-plans")}
                    icon={<IconMap />}
                >
                    <GroupItem
                        label={t("Crear plan")}
                        active={subCategoryId === "create-plan"}
                        onClick={() => {
                            closeSidebar();
                            router.push(
                                `/public/${propertyId}/custom-plans/create-plan`,
                            );
                        }}
                    />
                </CategoryAccordion>
            </aside>
        </>
    );
};

export default PublicSidebar;
