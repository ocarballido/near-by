import { cookies } from "next/headers";
import type { Metadata } from "next";

import PublicContentTemplate from "@/components/templates/public-content";
import { getPublicSidebarData } from "@/utils/get-public-sidebar-data";
import { EditPublicMenuProvider } from "@/lib/context/EditPublicMenuContext";
import { createServerAdminClient } from "@/lib/supabase/serverAdminClient";
import ItineraryForm from "@/components/organisms/form/custom-plan";
import { getTranslations } from "next-intl/server";

import { trackEvent } from "@/lib/analytics/mixpanel";
import type { Database, TablesInsert } from "@/lib/types";
import type { SupabaseClient } from "@supabase/supabase-js";

import {
    fetchPropertyBase,
    fetchInfoSectionsData,
    fetchArrivalGuideData,
    fetchTimeWindowItems,
    buildTimeWindowWidgetData,
    fetchWelcomeHighlightsTabsData,
    type HighlightGroup,
} from "./_data";
import { fetchWeather } from "@/components/templates/weather-widget/_data";
import WelcomeSection from "./WelcomeSection";
import SubcategorySection from "./SubcategorySection";
import PublicAppBar from "@/components/organisms/public-appbar";
import LodgingSection from "./LodgingSection";
import { getDisplayZoneFromString } from "@/utils/get-zone";
import {
    CATEGORIES_SUB_CATEGORIES,
    PILOT_PROPERTY_ID,
} from "@/config/config-constants";
import PublicCountsBootstrap from "@/components/providers/PublicCountsBootstrap";
import { getPropertySubCategoryCounts } from "@/utils/get-property-subcategory-counts";
import GuestChat from "@/components/organisms/guest-chat/GuestChat";
import ArrivalGuide from "@/components/organisms/arrival-guide/ArrivalGuide";
import TimeWindowSection from "@/components/molecules/time-window-section";
import { SidebarProvider } from "@/lib/context/SidebarContext";
import PublicGuideNav, {
    type PublicNavItem,
} from "@/components/organisms/public-guide-nav";
import SidebarMenuBar from "@/components/organisms/sidebar/sidebar-menu-bar";

type PageMode = "welcome" | "custom-plans" | "subcategory" | "lodging";

type HighlightsData = {
    featuredGroups: HighlightGroup[];
    mustVisitGroups: HighlightGroup[];
};

interface GenerateMetadataProps {
    params: Promise<{ locale: string; slug: string[] }>;
}

const getMode = (categoryId?: string): PageMode => {
    if (categoryId === "welcome") return "welcome";
    if (categoryId === "custom-plans") return "custom-plans";
    if (categoryId === CATEGORIES_SUB_CATEGORIES.LODGING.id) return "lodging";
    return "subcategory";
};

interface PageProps {
    params: Promise<{ locale: string; slug: string[] }>;
    searchParams?: Promise<{ open?: string }>;
}

export async function generateMetadata({
    params,
}: GenerateMetadataProps): Promise<Metadata> {
    const { slug, locale } = await params;
    const [propertyId] = slug;

    const t = await getTranslations({ locale, namespace: "Property" });
    const { property } = await fetchPropertyBase(propertyId);

    const ogImage =
        property.image_url ?? "/static/img/default-property-2x.webp";
    const zone = getDisplayZoneFromString(property.address);

    const description = zone
        ? t("meta_description_with_zone", { name: property.name, zone })
        : t("meta_description", { name: property.name });

    const localeMap: Record<string, string> = {
        es: "es_ES",
        en: "en_US",
        fr: "fr_FR",
    };
    const ogLocale = localeMap[locale] ?? `${locale}_${locale.toUpperCase()}`;

    return {
        title: `${property.name} · BNBexplorer`,
        description,
        metadataBase: new URL("https://bnbexplorer.com"),
        openGraph: {
            title: property.name,
            description,
            url: `https://bnbexplorer.com/${locale}/public/${propertyId}/welcome/highlights`,
            siteName: "BNBexplorer",
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: property.name,
                },
            ],
            locale: ogLocale,
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title: property.name,
            description,
            images: [ogImage],
        },
    };
}

export default async function Property({ params, searchParams }: PageProps) {
    const cookieStore = await cookies();
    const anonId = cookieStore.get("be_anon_id")?.value ?? "anon-missing";

    const { slug, locale } = await params;
    const { open } = (await searchParams) ?? {};
    const [propertyId, categoryId, subCategoryId] = slug;

    // Se calcula aquí (antes del Promise.all) porque decide qué fetches
    // extra hacen falta — mode nunca depende de ningún dato remoto.
    const mode = getMode(categoryId);

    // Analytics: no bloqueamos render. La propiedad piloto tiene su propio
    // evento para no mezclar sus visitas con las de las guías reales.
    void trackEvent({
        event:
            propertyId === PILOT_PROPERTY_ID
                ? "pilot_property_visited"
                : "tenant_visit_public_page",
        distinctId: anonId,
        props: { property_id: propertyId, page: "public_property" },
    }).catch((e) => console.error("Mixpanel trackEvent failed:", e));

    if (process.env.NODE_ENV === "production") {
        void (async () => {
            try {
                const supabase = await createServerAdminClient();
                const db = supabase as unknown as SupabaseClient<Database>;
                const payload: TablesInsert<"property_visits"> = {
                    property_id: propertyId,
                };
                await db.from("property_visits").insert(payload);
            } catch (e) {
                console.error("property_visits insert failed:", e);
            }
        })();
    }

    const propertyPromise = fetchPropertyBase(propertyId);

    // Un único fetch a Open-Meteo (weather ya incluye el timezone) en vez
    // de dos llamadas separadas al mismo servicio para la misma propiedad.
    const weatherPromise = propertyPromise.then(({ lat, lng }) =>
        fetchWeather(lat, lng),
    );

    // Condicional: solo pagamos esta consulta cuando realmente hace falta
    // (modo "welcome"), pero sigue viviendo DENTRO del Promise.all para
    // no reintroducir un escalón secuencial cuando sí aplica.
    const highlightsPromise: Promise<HighlightsData | null> =
        mode === "welcome"
            ? fetchWelcomeHighlightsTabsData(propertyId, locale)
            : Promise.resolve(null);

    const [
        sidebarData,
        { property, lat, lng },
        infoGroups,
        counts,
        weather,
        timeWindowItems,
        arrivalGuideData,
        highlightsData,
    ] = await Promise.all([
        getPublicSidebarData(propertyId),
        propertyPromise,
        fetchInfoSectionsData(propertyId, locale),
        getPropertySubCategoryCounts(propertyId),
        weatherPromise,
        // Las queries del widget no esperan a Open-Meteo: el timezone solo
        // se necesita para calcular las franjas, ya fuera del Promise.all
        fetchTimeWindowItems(propertyId, locale),
        propertyPromise.then(({ property }) =>
            fetchArrivalGuideData(propertyId, property, locale),
        ),
        highlightsPromise,
    ]);

    const timeWindowData = weather
        ? buildTimeWindowWidgetData(timeWindowItems, weather.timezone)
        : null;

    const hasInfoContent = infoGroups.length > 0;

    // "Explorar" entra por la primera subcategoría con contenido (sidebarData
    // ya viene filtrado y ordenado) y sigue activo en cualquier subcategoría
    const firstPlacesCategory = sidebarData[0];
    const firstPlacesSubCategory = firstPlacesCategory?.sub_categories[0];

    const navItems: PublicNavItem[] = [
        {
            id: "welcome",
            href: `/public/${propertyId}/welcome/highlights`,
            active: mode === "welcome",
        },
        ...(hasInfoContent
            ? [
                  {
                      id: "lodging",
                      href: `/public/${propertyId}/${CATEGORIES_SUB_CATEGORIES.LODGING.id}/info`,
                      active: mode === "lodging",
                  } satisfies PublicNavItem,
              ]
            : []),
        ...(firstPlacesCategory && firstPlacesSubCategory
            ? [
                  {
                      id: "places",
                      href: `/public/${propertyId}/${firstPlacesCategory.id}/${firstPlacesSubCategory.id}`,
                      active: mode === "subcategory",
                  } satisfies PublicNavItem,
              ]
            : []),
        {
            id: "plans",
            href: `/public/${propertyId}/custom-plans/create-plan`,
            active: mode === "custom-plans",
        },
    ];

    // Categoría activa en "Explorar": da nombre a la barra del sidebar en mobile
    const activePlacesCategory =
        mode === "subcategory"
            ? sidebarData.find((category) => category.id === categoryId)
            : undefined;
    const t = await getTranslations();

    return (
        <SidebarProvider>
            <EditPublicMenuProvider initialData={sidebarData}>
                <PublicAppBar
                    propertyId={propertyId}
                    propertyName={property.name}
                    propertyLogoUrl={property.logo_url}
                />
                <PublicCountsBootstrap counts={counts} />
                <PublicContentTemplate
                    propertyId={propertyId}
                    categoryId={categoryId}
                    subCategoryId={subCategoryId}
                    navItems={navItems}
                >
                    {/* Cabecera a sangre: el contenedor redondeado la recorta */}
                    {(timeWindowData || activePlacesCategory) && (
                        <div className="shrink-0">
                            {timeWindowData && (
                                <TimeWindowSection
                                    data={timeWindowData}
                                    propertyId={propertyId}
                                    anonId={anonId}
                                />
                            )}
                            {activePlacesCategory && (
                                <SidebarMenuBar
                                    label={t(activePlacesCategory.name)}
                                />
                            )}
                        </div>
                    )}
                    {/* Desktop: nav bajo el widget, fijo arriba al hacer scroll.
                        z-1 lo pone sobre el contenido sin tapar el overlay del
                        sidebar (z-10). En mobile/tablet va al pie (template) */}
                    <div className="hidden lg:block sticky top-0 z-1 shrink-0">
                        <PublicGuideNav items={navItems} placement="top" />
                    </div>
                    <div className="px-4 py-6 font-roboto flex flex-col grow gap-4 w-full max-w-[1140px] mx-auto">
                        {mode === "welcome" && highlightsData && (
                            <WelcomeSection
                                propertyId={propertyId}
                                propertyName={property.name}
                                address={getDisplayZoneFromString(
                                    property.address,
                                )}
                                image={property.image_url}
                                categoryId={categoryId}
                                lat={lat}
                                lng={lng}
                                infoGroups={infoGroups}
                                weather={weather}
                                featuredGroups={highlightsData.featuredGroups}
                                mustVisitGroups={highlightsData.mustVisitGroups}
                                checkInDate={
                                    property.check_in_date ?? undefined
                                }
                                checkInTime={
                                    property.check_in_time ?? undefined
                                }
                                checkOutDate={
                                    property.check_out_date ?? undefined
                                }
                                checkOutTime={
                                    property.check_out_time ?? undefined
                                }
                            />
                        )}
                        {mode === "custom-plans" && (
                            <ItineraryForm
                                locale={locale}
                                lat={lat}
                                lng={lng}
                                anonId={anonId}
                            />
                        )}
                        {mode === "subcategory" && (
                            <SubcategorySection
                                propertyId={propertyId}
                                categoryId={categoryId}
                                subCategoryId={subCategoryId}
                                lat={lat}
                                lng={lng}
                                locale={locale}
                            />
                        )}
                        {mode === "lodging" && (
                            <LodgingSection
                                propertyId={propertyId}
                                defaultOpenId={open}
                            />
                        )}
                    </div>
                </PublicContentTemplate>
                <ArrivalGuide
                    data={arrivalGuideData}
                    propertyId={propertyId}
                    address={property.address}
                />
                <GuestChat
                    propertyId={propertyId}
                    locale={locale}
                    anonId={anonId}
                    timezone={weather?.timezone}
                />
            </EditPublicMenuProvider>
        </SidebarProvider>
    );
}
