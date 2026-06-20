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

    const doShow = useMemo(() => {
        const segments = pathName.split("/").filter(Boolean);

        // En /public siempre se muestra el botón normal del menú
        if (segments.includes("public")) return true;

        // En /app/details siempre se muestra "Cancelar"
        if (segments.includes("app") && segments.includes("details"))
            return false;

        const hasHiddenSegment = segments.some((segment) =>
            HIDDEN_SEGMENTS.includes(segment),
        );
        return !hasHiddenSegment;
    }, [pathName]);

    return doShow ? (
        <Button
            label=""
            color="primary"
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
