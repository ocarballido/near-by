import AddPlaceForm from '@/components/organisms/form/place';

type PageProps = {
	params: Promise<{ locationSlug: string[] }>; // params es un Promise
};

export default async function LocationPage({ params }: PageProps) {
	const { locationSlug } = await params;
	const [propertySlug, propertyId, categoryId, subCategoryId] = locationSlug;

	console.log(propertySlug, propertyId, categoryId, subCategoryId);

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
