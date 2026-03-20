'use client';

import { useState } from 'react';

import WelcomeTabsMenu, { TabKey } from './menu';
import { PropertyDataPublicBySubCategory } from '@/components/templates/property-data-public';
import EventsTab from './event-tab';

type PublicItem = {
	id: string;
	name: string;
	address: string;
	description?: string;
	image_url?: string;
	latitude?: number;
	longitude?: number;
	type?: 'info' | 'location';
	featured?: boolean;
	must_visit?: boolean;
};

type Group = {
	sub_category_id: string;
	sub_category_name: string;
	items: PublicItem[];
};

type Props = {
	lat: number;
	lng: number;
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

export default function WelcomeTabs({
	lat,
	lng,
	featuredGroups,
	mustVisitGroups,
	labels,
}: Props) {
	const hasFeatured = (featuredGroups?.length ?? 0) > 0;
	const hasMustVisit = (mustVisitGroups?.length ?? 0) > 0;

	const [tab, setTab] = useState<TabKey>('events');

	const tabs = [
		hasFeatured
			? {
					key: 'featured' as const,
					label: labels.featuredTab,
					count: featuredGroups.reduce(
						(acc, g) => acc + g.items.length,
						0,
					),
				}
			: null,
		hasMustVisit
			? {
					key: 'must_visit' as const,
					label: labels.mustVisitTab,
					count: mustVisitGroups.reduce(
						(acc, g) => acc + g.items.length,
						0,
					),
				}
			: null,
		{ key: 'events' as const, label: labels.eventsTab },
	].filter(isDefined);

	return (
		<div className="flex flex-col gap-4">
			<WelcomeTabsMenu value={tab} onChange={setTab} tabs={tabs} />

			{tab === 'events' && <EventsTab lat={lat} lng={lng} />}

			{tab === 'featured' && hasFeatured && (
				<div className="flex flex-col gap-4">
					{featuredGroups.map((group) => (
						<PropertyDataPublicBySubCategory
							key={group.sub_category_id}
							propertyData={group.items}
							lat={lat}
							lng={lng}
							type="location"
							sub_category_name={group.sub_category_name}
						/>
					))}
				</div>
			)}

			{tab === 'must_visit' && hasMustVisit && (
				<div className="flex flex-col gap-4">
					{mustVisitGroups.map((group) => (
						<PropertyDataPublicBySubCategory
							key={group.sub_category_id}
							propertyData={group.items}
							lat={lat}
							lng={lng}
							type="location"
							sub_category_name={group.sub_category_name}
						/>
					))}
				</div>
			)}
		</div>
	);
}
