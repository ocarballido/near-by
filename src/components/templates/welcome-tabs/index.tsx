"use client";

import { useState } from "react";

import WelcomeTabsMenu, { TabKey } from "./menu";
import { PropertyDataPublicBySubCategory } from "@/components/templates/property-data-public";
import EventsTab from "./event-tab";

type PublicItem = {
    id: string;
    name: string;
    address: string;
    description?: string;
    image_url?: string;
    latitude?: number;
    longitude?: number;
    type?: "info" | "location";
    featured?: boolean;
    must_visit?: boolean;
};

type Group = {
    sub_category_id: string;
    sub_category_name: string;
    category_id: string | null;
    icon: string | null;
    items: PublicItem[];
};

type FlatItem = PublicItem & {
    sub_category_name: string;
    category_id: string | null;
    icon: string | null;
};

type Props = {
    lat: number;
    lng: number;
    categoryId: string;
    featuredGroups: Group[];
    mustVisitGroups: Group[];
    labels: {
        featuredTab: string;
        mustVisitTab: string;
        eventsTab: string;
        featuredHeading?: string;
        mustVisitHeading?: string;
    };
};

const isDefined = <T,>(v: T | null | undefined): v is T => v != null;

const flattenGroups = (groups: Group[]): FlatItem[] =>
    groups.flatMap((group) =>
        group.items.map((item) => ({
            ...item,
            sub_category_name: group.sub_category_name,
            category_id: group.category_id,
            icon: group.icon,
        })),
    );

export default function WelcomeTabs({
    lat,
    lng,
    featuredGroups,
    mustVisitGroups,
    labels,
}: Props) {
    const hasFeatured = (featuredGroups?.length ?? 0) > 0;
    const hasMustVisit = (mustVisitGroups?.length ?? 0) > 0;

    const defaultTab = (): TabKey => {
        if (hasFeatured) return "featured";
        if (hasMustVisit) return "must_visit";
        return "events";
    };

    const [tab, setTab] = useState<TabKey>(defaultTab);

    const tabs = [
        hasFeatured
            ? {
                  key: "featured" as const,
                  label: labels.featuredTab,
                  count: featuredGroups.reduce(
                      (acc, g) => acc + g.items.length,
                      0,
                  ),
              }
            : null,
        hasMustVisit
            ? {
                  key: "must_visit" as const,
                  label: labels.mustVisitTab,
                  count: mustVisitGroups.reduce(
                      (acc, g) => acc + g.items.length,
                      0,
                  ),
              }
            : null,
        { key: "events" as const, label: labels.eventsTab },
    ].filter(isDefined);

    const featuredItems = flattenGroups(featuredGroups);
    const mustVisitItems = flattenGroups(mustVisitGroups);

    return (
        <div className="flex flex-col gap-4">
            <WelcomeTabsMenu value={tab} onChange={setTab} tabs={tabs} />

            {tab === "events" && <EventsTab lat={lat} lng={lng} />}

            {tab === "featured" && hasFeatured && (
                <PropertyDataPublicBySubCategory
                    propertyData={featuredItems}
                    lat={lat}
                    lng={lng}
                    type="location"
                    showBadge
                />
            )}

            {tab === "must_visit" && hasMustVisit && (
                <PropertyDataPublicBySubCategory
                    propertyData={mustVisitItems}
                    lat={lat}
                    lng={lng}
                    type="location"
                    showBadge
                />
            )}
        </div>
    );
}
