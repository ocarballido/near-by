import { redirect } from "next/navigation";
import { createSSRClient } from "@/lib/supabase/server";
import { createServerAdminClient } from "@/lib/supabase/serverAdminClient";
import { trackEvent } from "@/lib/analytics/mixpanel";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types";

import AppContentTemplate from "@/components/templates/app-content";
import PropertyVisitsStats from "@/components/molecules/property-visits-stats";
import PropertiesCount from "@/components/molecules/properties-count";
import PropertiesStatus from "@/components/molecules/properties-status";
import LastActivity from "@/components/molecules/last-activity";
import ShareSection from "@/components/molecules/share-section";

type PageProps = {
    searchParams?: Promise<{ fromAuth?: string }>;
};

type PropertyRow = {
    id: string;
    name: string;
    updated_at: string | null;
    property_data: { type: string | null }[] | null;
};

export default async function DashboardContent({ searchParams }: PageProps) {
    const { fromAuth } = (await searchParams) ?? {};
    const shouldForceFirstProperty = fromAuth === "1";

    const ssrClient = await createSSRClient();
    const {
        data: { user },
        error: authError,
    } = await ssrClient.auth.getUser();

    if (authError || !user) redirect("/auth/login");

    if (shouldForceFirstProperty) {
        try {
            await trackEvent({
                event: "onboarding_start",
                distinctId: user.id,
                props: { page: "dashboard_home", fromAuth: 1 },
            });
        } catch {
            // no romper
        }
    }

    // Fetch centralizado — una sola query para todos los componentes
    const supabase = await createServerAdminClient();
    const db = supabase as unknown as SupabaseClient<Database>;

    const { data, error } = await db
        .from("properties")
        .select("id, name, updated_at, property_data ( type )")
        .eq("user_id", user.id)
        .overrideTypes<PropertyRow[], { merge: false }>();

    if (error) throw new Error("Error cargando propiedades: " + error.message);

    const rows = data ?? [];

    // Redirect si no hay propiedades y viene de auth
    if (shouldForceFirstProperty && rows.length === 0) {
        redirect("/app/properties/new?fromAuth=1");
    }

    // Calcular datos derivados una sola vez
    let completedCount = 0;
    let lastEdited: { id: string; name: string; updated_at: string } | null =
        null;
    let lastEditedTs = -1;

    for (const p of rows) {
        const types = (p.property_data ?? []).map((x) =>
            (x?.type ?? "").toString().trim().toLowerCase(),
        );
        const hasLocation = types.includes("location");
        const hasInfo = types.includes("info");
        if (hasLocation && hasInfo) completedCount++;

        if (p.updated_at) {
            const ts = new Date(p.updated_at).getTime();
            if (ts > lastEditedTs) {
                lastEditedTs = ts;
                lastEdited = {
                    id: p.id,
                    name: p.name,
                    updated_at: p.updated_at,
                };
            }
        }
    }

    const totalCount = rows.length;
    const incompleteCount = totalCount - completedCount;

    return (
        <AppContentTemplate>
            <div className="p-1.5 font-roboto flex flex-col grow items-center gap-3 overflow-hidden pb-6">
                <PropertiesCount totalCount={totalCount} />
                <PropertiesStatus
                    completedCount={completedCount}
                    incompleteCount={incompleteCount}
                />
                <LastActivity lastEdited={lastEdited} />
                <PropertyVisitsStats />
                <ShareSection userId={user.id} />
            </div>
        </AppContentTemplate>
    );
}
