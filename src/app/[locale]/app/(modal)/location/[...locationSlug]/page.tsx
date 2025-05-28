import { notFound } from 'next/navigation';

import AddPlaceForm from '@/components/organisms/form/place';

type PageProps = {
	params: Promise<{ locationSlug: string[] }>;
};

export default async function LocationPage({ params }: PageProps) {
	const { locationSlug } = await params;
	const [propertyId, categoryId, subCategoryId] = locationSlug;

	if (!propertyId || !categoryId || !subCategoryId || !locationSlug) {
		return notFound();
	}

	if (locationSlug.length > 3) {
		return notFound();
	}

	return (
		<>
			<AddPlaceForm
				propertyId={propertyId}
				categoryId={categoryId}
				subCategoryId={subCategoryId}
			/>
		</>
	);
}
