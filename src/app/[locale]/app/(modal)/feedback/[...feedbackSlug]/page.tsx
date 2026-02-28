import { notFound, redirect } from 'next/navigation';
import FeedbackForm from '@/components/organisms/form/feedback';
import { createSSRClient } from '@/lib/supabase/server';

const SOURCE_AREAS = [
	'create_property',
	'create_location',
	'create_info',
	'dashboard',
	'subscription',
] as const;

const CONTEXT_TYPES = ['property', 'location', 'info', 'none'] as const;

type SourceArea = (typeof SOURCE_AREAS)[number];
type ContextType = (typeof CONTEXT_TYPES)[number];

type PageProps = {
	params: Promise<{ feedbackSlug: string[] }>;
	searchParams?: Promise<{ returnTo?: string }>;
};

function isUuid(v: string) {
	return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
		v,
	);
}

export default async function FeedbackPage({
	params,
	searchParams,
}: PageProps) {
	const { feedbackSlug } = await params;
	const { returnTo } = (await searchParams) ?? {};

	if (!feedbackSlug || feedbackSlug.length < 1) return notFound();
	if (feedbackSlug.length > 3) return notFound();

	const [fromRaw, contextTypeRaw, contextIdRaw] = feedbackSlug;

	if (!SOURCE_AREAS.includes(fromRaw as SourceArea)) return notFound();
	const sourceArea = fromRaw as SourceArea;

	let contextType: ContextType | undefined = undefined;
	let contextId: string | undefined = undefined;

	if (feedbackSlug.length >= 2) {
		if (!CONTEXT_TYPES.includes(contextTypeRaw as ContextType))
			return notFound();
		contextType = contextTypeRaw as ContextType;
	}

	if (feedbackSlug.length === 3) {
		if (!contextIdRaw || !isUuid(contextIdRaw)) return notFound();
		contextId = contextIdRaw;
	}

	if (contextId && (!contextType || contextType === 'none'))
		return notFound();

	// ✅ Auth guard (minimal, consistent with other /app pages)
	const supabase = await createSSRClient();
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) redirect('/auth/login');

	// ✅ Minimal ownership guard: only when context is a property
	if (contextType === 'property' && contextId) {
		const { data: property, error: propErr } = await supabase
			.from('properties')
			.select('id')
			.eq('id', contextId)
			.single()
			.overrideTypes<{ id: string }, { merge: false }>();

		if (propErr || !property?.id) return notFound();
	}

	return (
		<FeedbackForm
			sourceArea={sourceArea}
			contextType={contextType}
			contextId={contextId}
			returnTo={returnTo}
		/>
	);
}
