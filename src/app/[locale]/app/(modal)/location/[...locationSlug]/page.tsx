import { notFound } from 'next/navigation';
import { getLocale } from 'next-intl/server';

import AddPlaceForm from '@/components/organisms/form/place';
import { getPlaceRecommendations } from '@/app/actions/locations/get-recommendations';

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

	const locale = await getLocale();

	const recoRes = await getPlaceRecommendations(
		propertyId,
		subCategoryId,
		locale,
	);
	const initialRecos = recoRes?.success ? recoRes.data : [];

	return (
		<>
			<AddPlaceForm
				propertyId={propertyId}
				categoryId={categoryId}
				subCategoryId={subCategoryId}
				initialRecos={initialRecos}
			/>
		</>
	);
}
