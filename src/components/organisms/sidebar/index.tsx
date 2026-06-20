"use client";

import clsx from "clsx";

import { useTranslations } from "next-intl";
import { useSidebar } from "@/lib/context/SidebarContext";

import PropertySidebar from "./property-sidebar";
import AppSidebar from "./app-sidebar";

type SidebarProps = {
    propertyId?: string;
    categoryId?: string;
    subCategoryId?: string;
    sidebar: "APP" | "PROPERTY";
};

const Sidebar = ({
    sidebar = "APP",
    propertyId,
    categoryId,
    subCategoryId,
}: SidebarProps) => {
    const t = useTranslations();

    const { isOpen } = useSidebar();

    const sidebarContentStyles = clsx(
        { "translate-x-0": isOpen },
        { "-translate-x-full": !isOpen },
    );

    const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL}/public/${propertyId}/welcome/highlights`;

    return (
        <aside
            className={`fixed bottom-0 left-0 right-0 top-0 p-4 z-10 overflow-y-auto overscroll-contain md:top-0 md:p-0 md:relative md:w-full md:max-w-80 md:h-auto md:min-h-0 md:self-stretch grow flex gap-2 flex-col transition-all duration-300 md:translate-x-0 bg-[#EFEFEF] ${sidebarContentStyles}`}
        >
            {sidebar === "PROPERTY" ? (
                <PropertySidebar
                    propertyId={propertyId}
                    categoryId={categoryId}
                    subCategoryId={subCategoryId}
                />
            ) : (
                <AppSidebar />
            )}
        </aside>
    );
};

export default Sidebar;
