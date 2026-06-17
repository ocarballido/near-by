"use client";

import { useTranslations } from "next-intl";
import { useSidebar } from "@/lib/context/SidebarContext";
import { usePathname, useRouter } from "next/navigation";

import Button from "@/components/molecules/button";
import IconMenu from "@/components/atoms/icon/menu";
import { useMemo } from "react";
import IconArrowLeftAlt from "@/components/atoms/icon/arrow-left-alt";

const MenuIconButton = () => {
    const t = useTranslations();
    const { openSidebar } = useSidebar();

    const pathName = usePathname();
    const router = useRouter();

    const doShow = useMemo(() => {
        switch (true) {
            case pathName.includes("info"):
                return false;
            case pathName.includes("location"):
                return false;
            case pathName.includes("magic-finder"):
                return false;
            case pathName.includes("feedback"):
                return false;
            case pathName.includes("new"):
                return false;
            case pathName.includes("edit"):
                return false;
            default:
                return true;
        }
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
