import { notFound } from 'next/navigation';

import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import type { Tables } from '@/lib/types';

import UpdateInfoForm from '@/components/organisms/form/info';

type PD = Tables<'property_data'>;

type PageProps = {
	params: Promise<{ infoSlug: string[] }>;
};

export default async function InfoPage({ params }: PageProps) {
	const { infoSlug } = await params;
	const [propertyId, categoryId, subCategoryId] = infoSlug;

	const supabase = await createServerAdminClient();
	const { data: info } = (await supabase
		.from('property_data')
		.select('name,description')
		.eq('property_id', propertyId)
		.eq('category_id', categoryId)
		.eq('sub_category_id', subCategoryId)
		.eq('type', 'info')
		.single()) as unknown as {
		data: Pick<PD, 'name' | 'description'> | null;
	};

	const { data: subcategoryName } = (await supabase
		.from('sub_categories')
		.select('name')
		.eq('id', subCategoryId)
		.single()) as unknown as {
		data: Pick<PD, 'name' | 'description'> | null;
	};

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
