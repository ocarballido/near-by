import { notFound } from 'next/navigation';

import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';

import UpdateInfoForm from '@/components/organisms/form/info';

type PageProps = {
	params: Promise<{ infoSlug: string[] }>;
};

export default async function InfoPage({ params }: PageProps) {
	const { infoSlug } = await params;
	const [propertyId, categoryId, subCategoryId] = infoSlug;

	const supabase = await createServerAdminClient();
	const { data: info } = await supabase
		.from('property_data')
		.select('name,description')
		.eq('sub_category_id', subCategoryId)
		.single();

	const { data: subcategoryName } = await supabase
		.from('sub_categories')
		.select('name')
		.eq('id', subCategoryId)
		.single();

	if (!propertyId || !categoryId || !subCategoryId || !infoSlug) {
		return notFound();
	}

	if (infoSlug.length > 4) {
		return notFound();
	}

	return (
		<>
			<UpdateInfoForm
				propertyId={propertyId}
				categoryId={categoryId}
				subCategoryId={subCategoryId}
				name={subcategoryName?.name ?? null}
				initialContent={info?.description ?? ''}
			/>
		</>
	);
}
