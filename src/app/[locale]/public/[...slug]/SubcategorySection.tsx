import { PropertyDataPublicBySubCategory } from '@/components/templates/property-data-public';
import { fetchSubcategoryPageData } from './_data';

type Props = {
	propertyId: string;
	categoryId: string;
	subCategoryId: string;
	lat: number;
	lng: number;
	locale: string;
};

export default async function SubcategorySection({
	propertyId,
	categoryId,
	subCategoryId,
	lat,
	lng,
	locale,
}: Props) {
	const data = await fetchSubcategoryPageData(
		propertyId,
		categoryId,
		subCategoryId,
		locale,
	);

	return (
		<PropertyDataPublicBySubCategory
			propertyData={data.propertyData}
			type={data.categoryType?.type ?? 'location'}
			lat={lat}
			categoryId={categoryId}
			subCategoryId={subCategoryId}
			lng={lng}
			sub_category_name={data.subCategory?.name}
			hasTranslations={data.hasTranslations}
		/>
	);
}
