import { cookies } from 'next/headers';

import PublicContentTemplate from '@/components/templates/public-content';
import { getPublicSidebarData } from '@/utils/get-public-sidebar-data';
import { EditPublicMenuProvider } from '@/lib/context/EditPublicMenuContext';
import ItineraryForm from '@/components/organisms/form/custom-plan';

import { trackEvent } from '@/lib/analytics/mixpanel';

import { fetchPropertyBase } from './_data';
import WelcomeSection from './WelcomeSection';
import SubcategorySection from './SubcategorySection';

type PageMode = 'welcome' | 'custom-plans' | 'subcategory';

const getMode = (categoryId?: string): PageMode => {
	if (categoryId === 'welcome') return 'welcome';
	if (categoryId === 'custom-plans') return 'custom-plans';
	return 'subcategory';
};

interface PageProps {
	params: Promise<{ locale: string; slug: string[] }>;
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

	// Shared data
	const sidebarData = await getPublicSidebarData(propertyId);
	const { property, lat, lng } = await fetchPropertyBase(propertyId);

	const mode = getMode(categoryId);

	return (
		<EditPublicMenuProvider initialData={sidebarData}>
			<PublicContentTemplate
				address={property.address}
				propertyId={propertyId}
				categoryId={categoryId}
				subCategoryId={subCategoryId}
				name={property.name}
				latitude={lat}
				longitude={lng}
				image={property.image_url}
			>
				<div className="p-4 font-roboto flex flex-col grow gap-4 bg-white rounded-lg overflow-hidden">
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
