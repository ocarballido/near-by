import { redirect } from "next/navigation";
import { createSSRClient } from "@/lib/supabase/server";

import PropertiesContent from "@/components/templates/properties-content";
import AppContentTemplate from "@/components/templates/app-content";

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
    property_data: { type: string | null }[] | null;
};

export default async function Properties() {
    const supabase = await createSSRClient();
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) redirect("/auth/login");

    // ✅ Use SSR client so RLS applies (no admin client here)
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
      property_data ( type )
    `,
        )
        // Puedes dejar este filtro (no hace daño), pero con RLS no es “necesario”
        .eq("user_id", user.id)
        .overrideTypes<PropertyWithData[], { merge: false }>();

    if (error) throw new Error("Error cargando propiedades: " + error.message);

    const properties = (data ?? []).map((p) => {
        const types = new Set(
            (p.property_data ?? [])
                .map((x) => (x?.type ?? "").toString().trim().toLowerCase())
                .filter(Boolean),
        );

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
        };
    });

    return (
        <AppContentTemplate>
            <div className="p-4 font-roboto rounded-lg grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-min">
                <PropertiesContent properties={properties} />
            </div>
        </AppContentTemplate>
    );
}
