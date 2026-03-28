import { cookies } from 'next/headers';
import type { Metadata } from 'next';

import PublicContentTemplate from '@/components/templates/public-content';
import { getPublicSidebarData } from '@/utils/get-public-sidebar-data';
import { EditPublicMenuProvider } from '@/lib/context/EditPublicMenuContext';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import ItineraryForm from '@/components/organisms/form/custom-plan';

import { trackEvent } from '@/lib/analytics/mixpanel';
import type { Database, TablesInsert } from '@/lib/types';
import type { SupabaseClient } from '@supabase/supabase-js';

import { fetchPropertyBase } from './_data';
import WelcomeSection from './WelcomeSection';
import SubcategorySection from './SubcategorySection';
import PublicAppBar from '@/components/organisms/public-appbar';

type PageMode = 'welcome' | 'custom-plans' | 'subcategory';

interface GenerateMetadataProps {
	params: Promise<{ locale: string; slug: string[] }>;
}

const getMode = (categoryId?: string): PageMode => {
	if (categoryId === 'welcome') return 'welcome';
	if (categoryId === 'custom-plans') return 'custom-plans';
	return 'subcategory';
};

interface PageProps {
	params: Promise<{ locale: string; slug: string[] }>;
}

export async function generateMetadata({
	params,
}: GenerateMetadataProps): Promise<Metadata> {
	const { slug } = await params;
	const [propertyId] = slug;

	const { property } = await fetchPropertyBase(propertyId);

	const ogImage =
		property.image_url ?? '/static/img/default-property-2x.webp';

	return {
		title: property.name,
		description: property.address ?? 'Guía de alojamiento',
		openGraph: {
			title: property.name,
			description: property.address ?? 'Guía de alojamiento',
			url: `https://bnbexplorer.com/public/${propertyId}/welcome/highlights`,
			siteName: 'BNBexplorer',
			images: [
				{
					url: ogImage,
					width: 1200,
					height: 630,
					alt: property.name,
				},
			],
			type: 'article',
		},
		twitter: {
			card: 'summary_large_image',
			title: property.name,
			description: property.address ?? 'Guía de alojamiento',
			images: [ogImage],
		},
	};
}

export default async function Property({ params }: PageProps) {
	const cookieStore = await cookies();
	const anonId = cookieStore.get('be_anon_id')?.value ?? 'anon-missing';

	const { slug, locale } = await params;
	const [propertyId, categoryId, subCategoryId] = slug;

	// Analytics: no bloqueamos render si falla
	try {
		await trackEvent({
			event: 'tenant_visit_public_page',
			distinctId: anonId,
			props: { property_id: propertyId, page: 'public_property' },
		});
	} catch (e) {
		console.error('Mixpanel trackEvent failed:', e);
	}

	// Track visit en Supabase — no bloqueamos render si falla
	if (process.env.NODE_ENV === 'production') {
		try {
			const supabase = await createServerAdminClient();
			const db = supabase as unknown as SupabaseClient<Database>;
			const payload: TablesInsert<'property_visits'> = {
				property_id: propertyId,
			};
			await db.from('property_visits').insert(payload);
		} catch (e) {
			console.error('property_visits insert failed:', e);
		}
	}

	// Shared data
	const sidebarData = await getPublicSidebarData(propertyId);
	const { property, lat, lng } = await fetchPropertyBase(propertyId);

	const mode = getMode(categoryId);

	return (
		<EditPublicMenuProvider initialData={sidebarData}>
			<PublicAppBar />
			<PublicContentTemplate
				address={property.address}
				propertyId={propertyId}
				categoryId={categoryId}
				subCategoryId={subCategoryId}
				name={property.name}
				latitude={lat}
				longitude={lng}
				checkInDate={property.check_in_date ?? ''}
				checkInTime={property.check_in_time ?? ''}
				checkOutDate={property.check_out_date ?? ''}
				checkOutTime={property.check_out_time ?? ''}
				image={property.image_url}
			>
				<div className="p-4 font-roboto flex flex-col grow gap-4 rounded-lg overflow-hidden">
					{mode === 'welcome' && (
						<WelcomeSection
							propertyId={propertyId}
							lat={lat}
							lng={lng}
						/>
					)}

					{mode === 'custom-plans' && (
						<ItineraryForm locale={locale} lat={lat} lng={lng} />
					)}

					{mode === 'subcategory' && (
						<SubcategorySection
							propertyId={propertyId}
							categoryId={categoryId}
							subCategoryId={subCategoryId}
							lat={lat}
							lng={lng}
						/>
					)}
				</div>
			</PublicContentTemplate>
		</EditPublicMenuProvider>
	);
}
