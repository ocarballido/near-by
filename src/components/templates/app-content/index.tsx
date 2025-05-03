import { SidebarProvider } from '@/lib/context/SidebarContext';

import Sidebar from '@/components/organisms/sidebar';
import Content from '@/components/organisms/content';

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

type AppContentTemplateProps = {
	children: React.ReactNode;
	sidebar?: 'APP' | 'PROPERTY';
	categoryId?: string;
	categories?: Category[];
	subCategories?: Subcategory[];
	subcategoryGroupId?: string;
	propertySlug?: string;
};

const AppContentTemplate = ({
	children,
	sidebar = 'APP',
	categoryId,
	categories,
	subCategories,
	subcategoryGroupId,
	propertySlug,
}: AppContentTemplateProps) => {
	return (
		<SidebarProvider>
			<div className="flex flex-col gap-2 items-stretch w-full bg-gray-100 font-body overflow-hidden grow">
				<div
					className={`flex flex-auto gap-4 md:gap-4 min-h-full relative w-full`}
				>
					<Sidebar
						sidebar={sidebar}
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

export default AppContentTemplate;
