import { notFound } from 'next/navigation';

import AddPlaceForm from '@/components/organisms/form/place';

type PageProps = {
	params: Promise<{ locationSlug: string[] }>;
};

export default async function LocationPage({ params }: PageProps) {
	const { locationSlug } = await params;
	const [propertySlug, propertyId, categoryId, subCategoryId] = locationSlug;

	if (
		!propertySlug ||
		!propertyId ||
		!categoryId ||
		!subCategoryId ||
		!locationSlug
	) {
		return notFound();
	}

	if (locationSlug.length > 4) {
		return notFound();
	}

	return (
		<>
			<AddPlaceForm
				propertyId={propertyId}
				propertySlug={propertySlug}
				categoryId={categoryId}
				subCategoryId={subCategoryId}
			/>
		</>
	);
}
