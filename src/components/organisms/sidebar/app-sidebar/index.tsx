"use client";

import { useTranslations } from "next-intl";
import { useSidebar } from "@/lib/context/SidebarContext";
import { usePaywall } from "@/lib/context/PaywallContext";
import { usePathname } from "@/i18n/routing";

import { PAGES, SIDEBAR_MENU } from "@/config/config-constants";

import IconHome from "@/components/atoms/icon/home";
import IconAccountCircle from "@/components/atoms/icon/account-circle";
import IconAdd from "@/components/atoms/icon/add";
import IconApartment from "@/components/atoms/icon/apartment";
import IconNewRelease from "@/components/atoms/icon/new-releases";
import IconLanguage from "@/components/atoms/icon/language";
import SidebarMenuItem from "@/components/molecules/sidebar-menu-item";
import IconHelp from "@/components/atoms/icon/help";
import CreatePropertyEntry from "@/components/molecules/property-entry";
import DemoHomeModal from "../../supademo/home-modal";

import { DEMOS } from "@/config/config-constants";
import Button from "@/components/molecules/button";
import IconClose from "@/components/atoms/icon/close";
import SidebarRail, {
    type SidebarRailItem,
} from "@/components/molecules/sidebar-rail";
import SidebarShell, { SIDEBAR_PANEL_ID } from "../sidebar-shell";
import Billboard from "./billboard";

const FEEDBACK_URL = "/app/feedback/dashboard";

const ICON_COMPONENTS = {
    IconHome,
    IconAccountCircle,
    IconAdd,
    IconNewRelease,
    IconApartment,
    IconLanguage,
} as const;

type IconName = keyof typeof ICON_COMPONENTS;

const AppSidebar = () => {
    const t = useTranslations();

    const { isOpen, openSidebar, closeSidebar } = useSidebar();
    const { requestCreateProperty } = usePaywall();
    const pathname = usePathname();

    // Los items navegan directamente; "Nueva Propiedad" pasa por el paywall
    // (requestCreateProperty ya navega sin modal cuando no hay restricción)
    const railItems: SidebarRailItem[] = [
        ...SIDEBAR_MENU.map((item) => {
            const IconComponent = ICON_COMPONENTS[item.icon as IconName];

            return {
                id: item.url,
                label: t(item.label),
                icon: <IconComponent />,
                active: item.url === pathname,
                href: item.url === PAGES.newProperty ? undefined : item.url,
            };
        }),
        {
            id: FEEDBACK_URL,
            label: t("feedback.cta"),
            icon: <IconHelp />,
            active: FEEDBACK_URL === pathname,
            href: FEEDBACK_URL,
        },
    ];

    const handleRailItemClick = (id: string) => {
        if (id === PAGES.newProperty) requestCreateProperty(id);
    };

    return (
        <SidebarShell
            rail={
                <SidebarRail
                    items={railItems}
                    isExpanded={isOpen}
                    controlsId={SIDEBAR_PANEL_ID}
                    onMenuClick={openSidebar}
                    onItemClick={handleRailItemClick}
                />
            }
        >
            <div className="flex gap-2 items-start justify-end lg:hidden">
                <Button
                    color="text"
                    label={t("Cerrar")}
                    iconLeft={<IconClose />}
                    onClick={closeSidebar}
                    className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                />
            </div>
            {SIDEBAR_MENU.map((item) => {
                const iconName = item.icon as IconName;
                const IconComponent = ICON_COMPONENTS[iconName];
                const url = item.url;

                if (url === PAGES.newProperty) {
                    return (
                        <CreatePropertyEntry
                            href={PAGES.newProperty}
                            key={item.label}
                            className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                            link={
                                <SidebarMenuItem
                                    key={item.label}
                                    icon={<IconComponent />}
                                    href={item.url}
                                    label={t(item.label)}
                                />
                            }
                            action={
                                <SidebarMenuItem
                                    icon={<IconComponent />}
                                    label={t(item.label)}
                                />
                            }
                        />
                    );
                } else {
                    return (
                        <SidebarMenuItem
                            key={item.label}
                            icon={<IconComponent />}
                            href={item.url}
                            label={t(item.label)}
                        />
                    );
                }
            })}
            <SidebarMenuItem
                icon={<IconHelp />}
                href={FEEDBACK_URL}
                label={t("feedback.cta")}
            />
            <DemoHomeModal demos={DEMOS} buttonColor="secondary" />
            <Billboard />
        </SidebarShell>
    );
};

export default AppSidebar;
