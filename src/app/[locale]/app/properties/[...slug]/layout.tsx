import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import ModalAutoContent from '@/components/templates/modal-auto-content';

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

	const supabase = await createServerAdminClient();

	const { data, error } = await supabase
		.from('property_data')
		.select('id')
		.eq('property_id', propertyId)
		.eq('type', 'location')
		.limit(1);

	const hasLocations = !error && (data?.length ?? 0) > 0;

	return (
		<>
			<ModalAutoContent
				initialHasLocations={hasLocations}
				propertyId={propertyId}
			/>
			{children}
		</>
	);
}
