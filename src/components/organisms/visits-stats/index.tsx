import { getTranslations, getLocale } from "next-intl/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types";

import { createServerAdminClient } from "@/lib/supabase/serverAdminClient";
import { getSeasonalTip } from "@/lib/get-seasonal-tip";

import WeeklyVisits from "@/components/atoms/weekly-visits";
import TipCard from "@/components/molecules/tip-card";

type WeekRow = {
    week_label: string;
    week_start: string;
    week_end: string;
    visit_count: string | number;
};

type VisitsStatsProps = {
    // Ya verificado con getUser() en la página
    userId: string;
};

const VisitsStats = async ({ userId }: VisitsStatsProps) => {
    const t = await getTranslations();
    const locale = await getLocale();

    // La RPC solo es ejecutable con service_role
    const supabase = await createServerAdminClient();
    const db = supabase as unknown as SupabaseClient<Database>;

    const { data, error } = await db
        .rpc("get_property_visits_by_user", { p_user_id: userId })
        .overrideTypes<WeekRow[], { merge: false }>();

    if (error || !data) {
        console.error(
            "[VisitsStats] get_property_visits_by_user failed:",
            error,
        );
        return null;
    }

    const rows = data.map((row) => ({
        ...row,
        visit_count: Number(row.visit_count),
    }));

    const totalVisits = rows.reduce((acc, r) => acc + (r.visit_count ?? 0), 0);

    // seasonal-tips.json solo tiene es, en y fr
    const tipLocale = locale === "en" || locale === "fr" ? locale : "es";

    const tip = getSeasonalTip(new Date(), tipLocale);

    // Sin visitas, el aviso va antes del tip estacional
    const alerts = [
        ...(totalVisits === 0
            ? [
                  {
                      emoji: t("visitsEmptyState.emoji"),
                      title: t("visitsEmptyState.title"),
                      text: t("visitsEmptyState.description"),
                  },
              ]
            : []),
        ...(tip ? [tip] : []),
    ];

    const labelMap: Record<string, string> = {
        this_week: t("visitsThisWeek"),
        last_week: t("visitsLastWeek"),
        two_weeks_ago: t("visitsTwoWeeksAgo"),
    };

    const formatDateRange = (start: string, end: string) => {
        const s = new Date(start).toLocaleDateString(locale, {
            day: "2-digit",
            month: "short",
        });
        const e = new Date(end).toLocaleDateString(locale, {
            day: "2-digit",
            month: "short",
        });
        return `${s} - ${e}`;
    };

    return (
        <div className="flex flex-col gap-4 p-4 rounded-2xl bg-white shadow-xs">
            <h2 className="font-heading font-bold text-sm leading-4 text-gray-800">
                {t("visitsTitle")}
            </h2>

            <div className="flex flex-col gap-3 w-full sm:flex-row sm:gap-6">
                {rows.map((row) => (
                    <WeeklyVisits
                        key={row.week_label}
                        title={labelMap[row.week_label] ?? row.week_label}
                        timeWindow={formatDateRange(
                            row.week_start,
                            row.week_end,
                        )}
                        value={row.visit_count}
                    />
                ))}
            </div>

            {alerts.map((alert) => (
                <TipCard
                    key={alert.title}
                    emoji={alert.emoji}
                    title={alert.title}
                    text={alert.text}
                />
            ))}
        </div>
    );
};

export default VisitsStats;
