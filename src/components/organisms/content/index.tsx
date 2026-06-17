"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useSidebar } from "@/lib/context/SidebarContext";
import { usePathname } from "next/navigation";

const Content = ({
    children,
    propertyId,
    categoryId,
    subCategoryId,
}: {
    children: React.ReactNode;
    propertyId?: string;
    categoryId?: string;
    subCategoryId?: string;
}) => {
    const t = useTranslations();

    const pathname = usePathname();

    const publicLink = useMemo(() => {
        const pathWithoutLocale = pathname.slice(4, pathname.length);
        const isPathProperties = pathWithoutLocale.includes("properties");
        const pathSplitted = pathWithoutLocale.split("/");
        const pathLength = pathSplitted.length;

        if (isPathProperties && pathLength === 5) {
            return {
                showPublicLink: true,
                url: `/public/${propertyId}/${categoryId}/${subCategoryId}`,
            };
        }

        return {
            showPublicLink: false,
            url: "",
        };
    }, [categoryId, pathname, propertyId, subCategoryId]);

    const { openSidebar } = useSidebar();

    return (
        <main className="flex flex-col gap-2 w-full grow rounded-xl overflow-hidden bg-gray-50 p-0.5">
            {children}
        </main>
    );
};

export default Content;
