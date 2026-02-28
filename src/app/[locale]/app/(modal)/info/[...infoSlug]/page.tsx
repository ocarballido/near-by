import { notFound, redirect } from 'next/navigation';

import { createSSRClient } from '@/lib/supabase/server';
import type { Tables } from '@/lib/types';

import UpdateInfoForm from '@/components/organisms/form/info';

type PD = Tables<'property_data'>;
type SubCategory = Tables<'sub_categories'>;

type PageProps = {
	params: Promise<{ infoSlug: string[] }>;
};

export default async function InfoPage({ params }: PageProps) {
	const { infoSlug } = await params;

	// Guards
	if (!infoSlug || infoSlug.length < 3 || infoSlug.length > 4)
		return notFound();

	const [propertyId, categoryId, subCategoryId] = infoSlug;
	if (!propertyId || !categoryId || !subCategoryId) return notFound();

	// Auth (cookie-based)
	const supabase = await createSSRClient();
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) redirect('/auth/login');

	// property_data "info" may NOT exist yet -> maybeSingle
	const infoPromise = supabase
		.from('property_data')
		.select('name,description')
		.eq('property_id', propertyId)
		.eq('category_id', categoryId)
		.eq('sub_category_id', subCategoryId)
		.eq('type', 'info')
		.maybeSingle()
		.overrideTypes<
			Pick<PD, 'name' | 'description'> | null,
			{ merge: false }
		>();

	// subcategory must exist
	const subCategoryPromise = supabase
		.from('sub_categories')
		.select('name')
		.eq('id', subCategoryId)
		.single()
		.overrideTypes<Pick<SubCategory, 'name'>, { merge: false }>();

	const [
		{ data: info, error: infoErr },
		{ data: subcategory, error: subcatErr },
	] = await Promise.all([infoPromise, subCategoryPromise]);

	// If RLS blocks or any real error happens => notFound
	if (infoErr) return notFound();
	if (subcatErr || !subcategory) return notFound();

	return (
		<UpdateInfoForm
			propertyId={propertyId}
			categoryId={categoryId}
			subCategoryId={subCategoryId}
			name={subcategory.name ?? null}
			initialContent={info?.description ?? ''}
		/>
	);
}
