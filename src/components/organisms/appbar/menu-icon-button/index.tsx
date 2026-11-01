"use client";

import { useTranslations } from "next-intl";
import { useSidebar } from "@/lib/context/SidebarContext";
import { usePathname, useRouter } from "next/navigation";

import Button from "@/components/molecules/button";
import IconMenu from "@/components/atoms/icon/menu";
import { useMemo } from "react";
import IconArrowLeftAlt from "@/components/atoms/icon/arrow-left-alt";

const HIDDEN_SEGMENTS = [
    "info",
    "location",
    "magic-finder",
    "feedback",
    "new",
    "edit",
];

const MenuIconButton = () => {
    const t = useTranslations();
    const { openSidebar } = useSidebar();

    const pathName = usePathname();
    const router = useRouter();

    const segments = useMemo(
        () => pathName.split("/").filter(Boolean),
        [pathName],
    );

    const doShow = useMemo(() => {
        // En /app/details siempre se muestra "Cancelar"
        if (segments.includes("app") && segments.includes("details"))
            return false;

        const hasHiddenSegment = segments.some((segment) =>
            HIDDEN_SEGMENTS.includes(segment),
        );
        return !hasHiddenSegment;
    }, [segments]);

    // Gestión de una propiedad (properties/[id]/[cat]/[sub]): en mobile las
    // categorías se abren desde el BottomNav
    const isPropertyManagement = useMemo(() => {
        const index = segments.indexOf("properties");
        return index !== -1 && segments.length - index === 4;
    }, [segments]);

    if (isPropertyManagement) return null;

    return doShow ? (
        <Button
            label=""
            color="text"
            onClick={openSidebar}
            iconLeft={<IconMenu />}
            className="flex md:hidden px-2!"
        />
    ) : (
        <Button
            label={t("Cancelar")}
            color="primary"
            onClick={() => router.back()}
            iconLeft={<IconArrowLeftAlt />}
            className="flex md:hidden"
        />
    );
};

export default MenuIconButton;
