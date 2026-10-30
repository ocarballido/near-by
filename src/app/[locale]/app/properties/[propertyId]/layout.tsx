import { notFound } from 'next/navigation';

import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { getOwnedProperty } from '@/lib/properties/get-owned-property';
import PropertyOnboardingModal from '@/components/organisms/property-onboarding-modal/PropertyOnboardingModal';
import PropertyMenuBootstrap from '@/components/providers/PropertyMenuBootstrap';

import type { Tables } from '@/lib/types';

type PropertyDataRow = Pick<Tables<'property_data'>, 'id' | 'name' | 'type'>;

type LayoutProps = {
	params: Promise<{ propertyId: string }>;
	children: React.ReactNode;
};

export default async function PropertyEditorLayout({
	children,
	params,
}: LayoutProps) {
	const { propertyId } = await params;

	// Antes de cualquier otra lectura: sin propiedad propia no se carga nada
	const property = await getOwnedProperty(propertyId);
	if (!property) notFound();

	let hasLocations = false;
	let previewLocations: PropertyDataRow[] = [];
	let totalInfo = 0;

	try {
		const supabase = await createServerAdminClient();

		const { data: allData } = await supabase
			.from('property_data')
			.select('id, name, type')
			.eq('property_id', propertyId)
			.order('created_at', { ascending: true })
			.overrideTypes<PropertyDataRow[], { merge: false }>();

		const rows = allData ?? [];
		const locations = rows.filter((r) => r.type === 'location');

		hasLocations = locations.length > 0;
		previewLocations = locations.slice(0, 4);
		totalInfo = rows.filter((r) => r.type === 'info').length;
	} catch (error) {
		console.error(
			'PropertyEditorLayout: failed to fetch onboarding data',
			error,
		);
		// Fallback seguro: el modal no aparece y la página sigue funcionando
	}

	return (
		<>
			<PropertyOnboardingModal
				initialHasLocations={hasLocations}
				propertyId={propertyId}
				propertyName={property.name}
				previewLocations={previewLocations}
				totalInfo={totalInfo}
			/>
			<PropertyMenuBootstrap
				property={{
					id: property.id,
					name: property.name,
					check_in_time: property.check_in_time,
					check_out_time: property.check_out_time,
				}}
			/>
			{children}
		</>
	);
}
