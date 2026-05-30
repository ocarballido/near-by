import { notFound, redirect } from 'next/navigation';
import { createSSRClient } from '@/lib/supabase/server';
import type { Tables } from '@/lib/types';
import UpdateInfoForm from '@/components/organisms/form/info';
import { CATEGORIES_SUB_CATEGORIES } from '@/config/config-constants';

type PD = Tables<'property_data'>;
type SubCategory = Tables<'sub_categories'>;

type PageProps = {
	params: Promise<{ infoSlug: string[] }>;
};

export default async function InfoPage({ params }: PageProps) {
	const { infoSlug } = await params;
	const [propertyId, categoryId, subCategoryId] = infoSlug ?? [];

	const {
		LODGING: { SUB_CATEGORIES },
	} = CATEGORIES_SUB_CATEGORIES;

	if (!propertyId || !categoryId || !subCategoryId || !infoSlug)
		return notFound();
	if (infoSlug.length > 4) return notFound();

	const supabase = await createSSRClient();
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) redirect('/auth/login');

	const { data: info } = (await supabase
		.from('property_data')
		.select('name,description')
		.eq('property_id', propertyId)
		.eq('category_id', categoryId)
		.eq('sub_category_id', subCategoryId)
		.eq('type', 'info')
		.maybeSingle()) as unknown as {
		data: Pick<PD, 'name' | 'description'> | null;
	};

	const subcategory = Object.values(SUB_CATEGORIES).find(
		(item) => item.id === subCategoryId,
	);

	return (
		<UpdateInfoForm
			propertyId={propertyId}
			categoryId={categoryId}
			subCategoryId={subCategoryId}
			name={subcategory?.name ?? null}
			initialContent={info?.description ?? ''}
		/>
	);
}
