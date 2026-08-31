import { redirect } from "next/navigation";
import { createSSRClient } from "@/lib/supabase/server";
import { trackEvent } from "@/lib/analytics/mixpanel";

import PropertiesContent from "@/components/templates/properties-content";
import AppContentTemplate from "@/components/templates/app-content";

import {
    deriveEnrichmentMetrics,
    calculatePropertyScore,
    getPropertyTier,
    hasConfiguredCheckInOut,
    type PropertyDataRow,
} from "@/utils/property-tier";

type PropertyWithData = {
    id: string;
    name: string;
    slug: string | null;
    check_in_date: string | null;
    check_in_time: string | null;
    check_out_date: string | null;
    check_out_time: string | null;
    address: string | null;
    image_url: string | null;
    property_data: PropertyDataRow[] | null;
};

type PageProps = {
    searchParams?: Promise<{ fromAuth?: string }>;
};

export default async function Properties({ searchParams }: PageProps) {
    const { fromAuth } = (await searchParams) ?? {};
    const shouldForceFirstProperty = fromAuth === "1";

    const supabase = await createSSRClient();
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) redirect("/auth/login");

    if (shouldForceFirstProperty) {
        try {
            await trackEvent({
                event: "onboarding_start",
                distinctId: user.id,
                props: { page: "properties_home", fromAuth: 1 },
            });
        } catch {
            // no romper
        }
    }

    const { data, error } = await supabase
        .from("properties")
        .select(
            `
      id,
      name,
      slug,
      address,
      image_url,
      check_in_date,
      check_in_time,
      check_out_date,
      check_out_time,
      property_data ( type, sub_category_id, featured, must_visit )
    `,
        )
        .eq("user_id", user.id)
        .overrideTypes<PropertyWithData[], { merge: false }>();

    if (error) throw new Error("Error cargando propiedades: " + error.message);

    const rows = data ?? [];

    if (shouldForceFirstProperty && rows.length === 0) {
        redirect("/app/properties/new?fromAuth=1");
    }

    const properties = rows.map((p) => {
        const propertyData = p.property_data ?? [];

        const types = new Set(
            propertyData
                .map((x) => (x?.type ?? "").toString().trim().toLowerCase())
                .filter(Boolean),
        );

        const hasCustomImage = Boolean(p.image_url);
        const hasCheckInOut = hasConfiguredCheckInOut({
            checkInDate: p.check_in_date,
            checkInTime: p.check_in_time,
            checkOutDate: p.check_out_date,
            checkOutTime: p.check_out_time,
        });

        const metrics = deriveEnrichmentMetrics(propertyData, {
            hasCustomImage,
            hasCheckInOut,
        });
        const tier = getPropertyTier(calculatePropertyScore(metrics));

        return {
            id: p.id,
            name: p.name,
            slug: p.slug ?? "",
            address: p.address ?? "",
            checkInDate: p.check_in_date ?? "",
            checkInTime: p.check_in_time ?? "",
            checkOutDate: p.check_out_date ?? "",
            checkOutTime: p.check_out_time ?? "",
            image_url: p.image_url ?? undefined,
            hasLocation: types.has("location"),
            hasInfo: types.has("info"),
            tier,
        };
    });

    return (
        <AppContentTemplate>
            <div className="p-4 font-roboto rounded-lg grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 auto-rows-min">
                <PropertiesContent properties={properties} />
            </div>
        </AppContentTemplate>
    );
}
