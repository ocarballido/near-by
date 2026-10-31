import { getTranslations } from "next-intl/server";

import { CATEGORIES_SUB_CATEGORIES } from "@/config/config-constants";

import LastEdited from "@/components/molecules/last-edited";
import TipCard from "@/components/molecules/tip-card";

type MyLastActivityProps = {
    lastEdited: { id: string; name: string; updated_at: string } | null;
};

const MyLastActivity = async ({ lastEdited }: MyLastActivityProps) => {
    const t = await getTranslations();

    if (!lastEdited?.updated_at) return null;

    return (
        <div className="flex flex-col gap-4 p-4 rounded-2xl bg-white shadow-xs">
            <h2 className="font-heading font-bold text-sm leading-4 text-gray-800">
                {t("lastActivity.title")}
            </h2>

            <LastEdited
                propertyName={lastEdited.name}
                updatedAt={lastEdited.updated_at}
                href={`/app/properties/${lastEdited.id}/${CATEGORIES_SUB_CATEGORIES.LODGING.id}/${CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.MANUAL.id}`}
            />

            <TipCard
                emoji={t("dashboardPropertyTip.emoji")}
                title={t("dashboardPropertyTip.title")}
                text={t("dashboardPropertyTip.description")}
            />
        </div>
    );
};

export default MyLastActivity;
