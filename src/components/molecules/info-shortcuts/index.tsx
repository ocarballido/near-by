import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { CATEGORIES_SUB_CATEGORIES } from "@/config/config-constants";
import type { InfoGroup } from "@/app/[locale]/public/[...slug]/_data";

import IconAlarm from "@/components/atoms/icon/alarm";
import IconListBullet from "@/components/atoms/icon/list-bullet";
import IconManual from "@/components/atoms/icon/manual";
import IconRecicle from "@/components/atoms/icon/recicle";
import IconWifi from "@/components/atoms/icon/wifi";

const SUB_CATEGORY_ICONS: Record<string, React.ReactNode> = {
    [CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.MANUAL.id]: (
        <IconManual color="primary" />
    ),
    [CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.RULES.id]: (
        <IconListBullet color="primary" />
    ),
    [CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.SCHEDULE.id]: (
        <IconAlarm color="primary" />
    ),
    [CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.RECYCLE.id]: (
        <IconRecicle color="primary" />
    ),
    [CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.WIFI.id]: (
        <IconWifi color="primary" />
    ),
};

type Props = {
    groups: InfoGroup[];
    propertyId: string;
};

const InfoShortcuts = ({ groups, propertyId }: Props) => {
    const t = useTranslations();

    if (groups.length === 0) return null;

    const lodgingCategoryId = CATEGORIES_SUB_CATEGORIES.LODGING.id;

    // auto-fit: el nº de columnas se adapta al ancho y al nº de accesos
    // (0-5), sin huecos vacíos cuando hay menos de los que caben
    return (
        <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3">
            {groups.map((group) => {
                const icon = SUB_CATEGORY_ICONS[group.sub_category_id] ?? (
                    <IconManual color="primary" />
                );

                return (
                    <Link
                        key={group.sub_category_id}
                        href={`/public/${propertyId}/${lodgingCategoryId}/info?open=${group.sub_category_id}`}
                        className="flex flex-col items-start gap-3 rounded-xl bg-white p-4 shadow-xs ring-1 ring-gray-100 transition-shadow hover:shadow-main focus-visible:outline-2 focus-visible:outline-primary-500"
                    >
                        <span
                            aria-hidden
                            className="rounded-full bg-primary-50 p-2"
                        >
                            {icon}
                        </span>
                        <span className="font-body font-medium text-sm leading-5 text-gray-800">
                            {t(group.sub_category_name)}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
};

export default InfoShortcuts;
