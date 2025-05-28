import { notFound } from 'next/navigation';

import MagicFinderForm from '@/components/organisms/form/magic-finder';

type PageProps = {
	params: Promise<{ magicFinderSlug: string[] }>;
};

export default async function LocationPage({ params }: PageProps) {
	const { magicFinderSlug } = await params;
	const [propertyId, lat, lng, categoryId, subCategoryId] = magicFinderSlug;

	if (
		!propertyId ||
		!lat ||
		!lng ||
		!categoryId ||
		!subCategoryId ||
		!magicFinderSlug
	) {
		return notFound();
	}

	if (magicFinderSlug.length > 6) {
		return notFound();
	}

	return (
		<>
			<MagicFinderForm
				propertyId={propertyId}
				categoryId={categoryId}
				subCategoryId={subCategoryId}
				lat={lat}
				lng={lng}
			/>
		</>
	);
}
