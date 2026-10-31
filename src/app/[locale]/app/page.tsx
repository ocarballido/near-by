import { redirect } from "next/navigation";
import { createSSRClient } from "@/lib/supabase/server";
import { createServerAdminClient } from "@/lib/supabase/serverAdminClient";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types";
import type { PropertyStatus } from "@/components/molecules/property-info";

import AppContentTemplate from "@/components/templates/app-content";
import PropertiesOverview from "@/components/organisms/properties-overview";
import MyProperties from "@/components/organisms/my-properties";
import MyLastActivity from "@/components/organisms/my-last-activity";
import VisitsStats from "@/components/organisms/visits-stats";
import NewPropertyCard from "@/components/molecules/new-property-card";
import ShareSection from "@/components/molecules/share-section";

type PropertyRow = {
    id: string;
    name: string;
    image_url: string | null;
    updated_at: string | null;
    property_data: { type: string | null }[] | null;
};

export default async function DashboardContent() {
    const ssrClient = await createSSRClient();
    const {
        data: { user },
        error: authError,
    } = await ssrClient.auth.getUser();

    if (authError || !user) redirect("/auth/login");

    const supabase = await createServerAdminClient();
    const db = supabase as unknown as SupabaseClient<Database>;

    const { data, error } = await db
        .from("properties")
        .select("id, name, image_url, updated_at, property_data ( type )")
        .eq("user_id", user.id)
        .overrideTypes<PropertyRow[], { merge: false }>();

    if (error) throw new Error("Error cargando propiedades: " + error.message);

    const properties = (data ?? [])
        .map((p) => {
            const types = (p.property_data ?? []).map((x) =>
                (x?.type ?? "").toString().trim().toLowerCase(),
            );
            const isReady =
                types.includes("location") && types.includes("info");
            const status: PropertyStatus = isReady ? "ready" : "pending";

            return {
                id: p.id,
                name: p.name,
                image: p.image_url || null,
                status,
                updatedAt: p.updated_at,
                updatedTs: p.updated_at ? new Date(p.updated_at).getTime() : -1,
            };
        })
        // Editadas más recientemente primero: MyProperties muestra las
        // primeras y la última actividad es la primera con fecha
        .sort((a, b) => b.updatedTs - a.updatedTs);

    const totalCount = properties.length;
    const completedCount = properties.filter(
        (p) => p.status === "ready",
    ).length;
    const incompleteCount = totalCount - completedCount;

    const latest = properties[0];
    const lastEdited = latest?.updatedAt
        ? { id: latest.id, name: latest.name, updated_at: latest.updatedAt }
        : null;

    return (
        <AppContentTemplate>
            <div className="flex flex-col gap-4 px-4 py-6 -mt-2">
                <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4">
                    <PropertiesOverview
                        totalCount={totalCount}
                        completedCount={completedCount}
                        incompleteCount={incompleteCount}
                    />
                    {totalCount > 0 ? (
                        <MyProperties properties={properties} />
                    ) : (
                        <NewPropertyCard />
                    )}
                </div>
                {/* Sin propiedades no hay actividad ni visitas que mostrar */}
                {totalCount > 0 && (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        <MyLastActivity lastEdited={lastEdited} />
                        <VisitsStats userId={user.id} />
                    </div>
                )}
                <ShareSection userId={user.id} />
            </div>
        </AppContentTemplate>
    );
}
