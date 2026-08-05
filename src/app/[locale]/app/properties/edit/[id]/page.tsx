// app/[locale]/app/edit/[id]/page.tsx
import { notFound, redirect } from "next/navigation";
import AddPropertyForm from "@/components/organisms/form/property";
import AppContentTemplate from "@/components/templates/app-content";

import { createSSRClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/types";

type FullProperty = Tables<"properties">;

type PageProps = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ from?: string }>;
};

export const dynamic = "force-dynamic";

export default async function EditProperty({
    params,
    searchParams,
}: PageProps) {
    const { id: propertyId } = await params;
    const { from } = await searchParams;

    const supabase = await createSSRClient();
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect("/auth/login");
    }

    const { data: property, error: propErr } = await supabase
        .from("properties")
        .select(
            "id,user_id,name,address,latitude,longitude,image_url,check_in_date,check_in_time,check_out_date,check_out_time,access_instructions",
        )
        .eq("id", propertyId)
        .single()
        .overrideTypes<FullProperty, { merge: false }>();

    if (propErr || !property?.id) notFound();

    // Nº de localizaciones existentes (solo necesitamos saber si hay >0, no listarlas)
    const { count: locationsCount, error: locationsCountErr } = await supabase
        .from("property_data")
        .select("id", { count: "exact", head: true })
        .eq("property_id", propertyId)
        .eq("type", "location");

    if (locationsCountErr) {
        console.error(
            "EditProperty: failed to count locations",
            locationsCountErr,
        );
    }

    const hasLocations = (locationsCount ?? 0) > 0;

    const initialValues = {
        name: property.name ?? "",
        address: property.address ?? "",
        latitude: property.latitude ?? null,
        longitude: property.longitude ?? null,
        check_in_date: property.check_in_date ?? null,
        check_in_time: property.check_in_time ?? null,
        check_out_date: property.check_out_date ?? null,
        check_out_time: property.check_out_time ?? null,
        image_url: property.image_url ?? null,
        access_instructions: property.access_instructions ?? null,
    };

    return (
        <AppContentTemplate showSidebar={false}>
            <div className="p-1.5 font-roboto flex flex-col grow items-center gap-3 py-6">
                <AddPropertyForm
                    propertyId={propertyId}
                    initialValues={initialValues}
                    hasLocations={hasLocations}
                    redirectAfter={
                        from === "properties" ? "/app/properties" : undefined
                    }
                />
            </div>
        </AppContentTemplate>
    );
}
