import { SidebarProvider } from '@/lib/context/SidebarContext';

import Sidebar from '@/components/organisms/sidebar';
import Content from '@/components/organisms/content';

type Category = {
	id: string;
	name: string;
	icon: string;
	firstEntryId: string;
};

type AppContentTemplateProps = {
	children: React.ReactNode;
	sidebar?: 'APP' | 'PROPERTY';
	categoryId?: string;
	categories?: Category[];
	subcategoryGroupId?: string;
	propertySlug?: string;
	propertyId?: string;
};

const AppContentTemplate = ({
	children,
	sidebar = 'APP',
	propertySlug,
	propertyId,
}: AppContentTemplateProps) => {
	return (
		<SidebarProvider>
			<div className="flex flex-col gap-2 items-stretch w-full bg-gray-100 font-body overflow-hidden grow">
				<div
					className={`flex flex-auto gap-4 md:gap-4 min-h-full relative w-full`}
				>
					<Sidebar sidebar={sidebar} propertyId={propertyId} />
					<Content propertySlug={propertySlug}>{children}</Content>
				</div>
			</div>
		</SidebarProvider>
	);
};

export default AppContentTemplate;
