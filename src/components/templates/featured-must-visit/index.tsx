'use client';

import { useEffect, useMemo, useState } from 'react';

import FeaturedMustVisitMenu from './menu';
import { PropertyDataPublicBySubCategory } from '@/components/templates/property-data-public';

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
		featuredHeading?: string;
		mustVisitHeading?: string;
	};
};

type TabKey = 'featured' | 'must_visit';

const isDefined = <T,>(v: T | null | undefined): v is T => v != null;

export default function FeaturedMustVisit({
	lat,
	lng,
	featuredGroups,
	mustVisitGroups,
	labels,
}: Props) {
	const hasFeatured = (featuredGroups?.length ?? 0) > 0;
	const hasMustVisit = (mustVisitGroups?.length ?? 0) > 0;

	// ✅ Hooks SIEMPRE se llaman, sin returns antes
	const featuredCount = useMemo(() => {
		return (featuredGroups ?? []).reduce(
			(acc, g) => acc + (g.items?.length ?? 0),
			0,
		);
	}, [featuredGroups]);

	const mustVisitCount = useMemo(() => {
		return (mustVisitGroups ?? []).reduce(
			(acc, g) => acc + (g.items?.length ?? 0),
			0,
		);
	}, [mustVisitGroups]);

	// Estado inicial estable (no depende de returns)
	const [tab, setTab] = useState<TabKey>('featured');

	// Si solo existe uno de los dos, forzamos el tab correcto
	const singleMode: TabKey | null =
		hasFeatured && !hasMustVisit
			? 'featured'
			: !hasFeatured && hasMustVisit
				? 'must_visit'
				: null;

	const activeTab: TabKey = singleMode ?? tab;

	// ✅ Si el usuario está en un tab que ya no existe (por data dinámica), lo corregimos
	useEffect(() => {
		if (!hasFeatured && hasMustVisit && tab !== 'must_visit') {
			setTab('must_visit');
		}
		if (!hasMustVisit && hasFeatured && tab !== 'featured') {
			setTab('featured');
		}
	}, [hasFeatured, hasMustVisit, tab]);

	// ✅ Ahora sí: early return DESPUÉS de hooks
	if (!hasFeatured && !hasMustVisit) return null;

	return (
		<div className="flex flex-col gap-4">
			{/* Menú solo si hay ambos */}
			{!singleMode && (
				<FeaturedMustVisitMenu
					value={activeTab}
					onChange={setTab}
					tabs={[
						hasFeatured
							? {
									key: 'featured' as const,
									label: labels.featuredTab,
									count: featuredCount,
								}
							: null,
						hasMustVisit
							? {
									key: 'must_visit' as const,
									label: labels.mustVisitTab,
									count: mustVisitCount,
								}
							: null,
					].filter(isDefined)}
				/>
			)}

			{activeTab === 'featured' && hasFeatured && (
				<div className="flex flex-col gap-4">
					{labels.featuredHeading && (
						<h2 className="font-heading text-lg font-semibold">
							{labels.featuredHeading}
						</h2>
					)}

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

			{activeTab === 'must_visit' && hasMustVisit && (
				<div className="flex flex-col gap-4">
					{labels.mustVisitHeading && (
						<h2 className="font-heading text-lg font-semibold">
							{labels.mustVisitHeading}
						</h2>
					)}

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
