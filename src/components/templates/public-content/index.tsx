import { SidebarProvider } from '@/lib/context/SidebarContext';

import PublicSidebar from '@/components/organisms/sidebar/public-sidebar';
import Content from '@/components/organisms/content';
import PublicHeader from '../public-header';

type Category = {
	id: string;
	name: string;
	icon: string;
	firstEntryId: string;
};

type Subcategory = {
	id: string;
	label: string;
	href: string;
};

type PublicContentTemplateProps = {
	address: string;
	name: string;
	image: string;
	latitude: number;
	longitude: number;
	children: React.ReactNode;
	sidebar?: 'APP' | 'PROPERTY';
	categoryId?: string;
	categories?: Category[];
	subCategories?: Subcategory[];
	subcategoryGroupId?: string;
	propertySlug?: string;
};

const PublicContentTemplate = ({
	address,
	name,
	latitude,
	longitude,
	image,
	children,
	categoryId,
	categories,
	subCategories,
	subcategoryGroupId,
	propertySlug,
}: PublicContentTemplateProps) => {
	return (
		<SidebarProvider>
			<PublicHeader
				address={address}
				name={name}
				image={image}
				latitude={latitude}
				longitude={longitude}
			/>
			<div className="flex flex-col gap-2 items-stretch w-full bg-gray-100 font-body overflow-hidden grow">
				<div
					className={`flex flex-auto gap-4 md:gap-4 min-h-full relative w-full`}
				>
					<PublicSidebar
						categoryId={categoryId}
						categories={categories}
						subCategories={subCategories}
						subcategoryGroupId={subcategoryGroupId}
						propertySlug={propertySlug}
					/>
					<Content>{children}</Content>
				</div>
			</div>
		</SidebarProvider>
	);
};

export default PublicContentTemplate;
