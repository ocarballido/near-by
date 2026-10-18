"use client";

import { useTranslations } from "next-intl";
import ButtonLink from "@/components/molecules/button-link";
import { CATEGORIES_SUB_CATEGORIES } from "@/config/config-constants";
import type { InfoGroup } from "@/app/[locale]/public/[...slug]/_data";

import IconAlarm from "@/components/atoms/icon/alarm";
import IconListBullet from "@/components/atoms/icon/list-bullet";
import IconManual from "@/components/atoms/icon/manual";
import IconRecicle from "@/components/atoms/icon/recicle";
import IconWifi from "@/components/atoms/icon/wifi";

const SUB_CATEGORY_ICONS: Record<string, React.ReactNode> = {
    // El color de los iconos lo pone el ButtonLink según su variante
    [CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.MANUAL.id]: (
        <IconManual />
    ),
    [CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.RULES.id]: (
        <IconListBullet />
    ),
    [CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.SCHEDULE.id]: (
        <IconAlarm />
    ),
    [CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.RECYCLE.id]: (
        <IconRecicle />
    ),
    [CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.WIFI.id]: <IconWifi />,
};

type Props = {
    groups: InfoGroup[];
    propertyId: string;
};

const InfoShortcuts = ({ groups, propertyId }: Props) => {
    const t = useTranslations();

    if (groups.length === 0) return null;

    const lodgingCategoryId = CATEGORIES_SUB_CATEGORIES.LODGING.id;

    return (
        <div className="flex flex-wrap gap-2 w-full">
            {groups.map((group) => {
                const icon = SUB_CATEGORY_ICONS[group.sub_category_id] ?? (
                    <IconManual />
                );

                return (
                    <ButtonLink
                        key={group.sub_category_id}
                        href={`/public/${propertyId}/${lodgingCategoryId}/info?open=${group.sub_category_id}`}
                        label={t(group.sub_category_name)}
                        color="secondary"
                        size="sm"
                        iconLeft={icon}
                        className="text-nowrap"
                    />
                );
            })}
        </div>
    );
};

export default InfoShortcuts;
