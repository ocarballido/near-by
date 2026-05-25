import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import PropertyOnboardingModal from '@/components/organisms/property-onboarding-modal/PropertyOnboardingModal';

import type { Tables } from '@/lib/types';

type PropertyDataRow = Pick<Tables<'property_data'>, 'id' | 'name' | 'type'>;

type PageProps = {
	params: Promise<{ slug: string[] }>;
	children: React.ReactNode;
};

export default async function PropertyEditorLayout({
	children,
	params,
}: PageProps) {
	const { slug } = await params;
	const [propertyId] = slug;

	let hasLocations = false;
	let previewLocations: PropertyDataRow[] = [];
	let totalInfo = 0;
	let propertyName = '';

	try {
		const supabase = await createServerAdminClient();

		const [{ data: allData }, { data: property }] = await Promise.all([
			supabase
				.from('property_data')
				.select('id, name, type')
				.eq('property_id', propertyId)
				.order('created_at', { ascending: true }),
			supabase
				.from('properties')
				.select('name')
				.eq('id', propertyId)
				.single()
				.overrideTypes<{ name: string }, { merge: false }>(),
		]);

		const rows = (allData ?? []) as PropertyDataRow[];
		const locations = rows.filter((r) => r.type === 'location');

		hasLocations = locations.length > 0;
		previewLocations = locations.slice(0, 4);
		totalInfo = rows.filter((r) => r.type === 'info').length;
		propertyName = property?.name ?? '';
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
				propertyName={propertyName}
				previewLocations={previewLocations}
				totalInfo={totalInfo}
			/>
			{children}
		</>
	);
}
