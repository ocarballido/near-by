import { notFound } from 'next/navigation';

import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';

import UpdateInfoForm from '@/components/organisms/form/info';

type PageProps = {
	params: Promise<{ infoSlug: string[] }>;
};

export default async function InfoPage({ params }: PageProps) {
	const { infoSlug } = await params;
	const [propertySlug, categoryId, subCategoryId] = infoSlug;

	const supabase = await createServerAdminClient();
	const { data: info, error } = await supabase
		.from('property_info')
		.select('title,content')
		.eq('id', subCategoryId)
		.single();

	if (error) notFound();

	return (
		<>
			<UpdateInfoForm
				propertySlug={propertySlug}
				categoryId={categoryId}
				subCategoryId={subCategoryId}
				title={info?.title}
				initialContent={info?.content ?? ''}
			/>
		</>
	);
}
