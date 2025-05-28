import { SidebarProvider } from '@/lib/context/SidebarContext';

import PublicSidebar from '@/components/organisms/sidebar/public-sidebar';
import Content from '@/components/organisms/content';
import PublicHeader from '../public-header';

type PublicContentTemplateProps = {
	address: string;
	name: string;
	image: string;
	latitude: number;
	longitude: number;
	children: React.ReactNode;
	sidebar?: 'APP' | 'PROPERTY';
	categoryId?: string;
	subCategoryId?: string;
	propertyId?: string;
};

const PublicContentTemplate = ({
	address,
	name,
	latitude,
	longitude,
	image,
	children,
	categoryId,
	subCategoryId,
	propertyId,
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
						subCategoryId={subCategoryId}
						propertyId={propertyId}
					/>
					<Content>{children}</Content>
				</div>
			</div>
		</SidebarProvider>
	);
};

export default PublicContentTemplate;
