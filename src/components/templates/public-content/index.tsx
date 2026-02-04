import { SidebarProvider } from '@/lib/context/SidebarContext';

import PublicSidebar from '@/components/organisms/sidebar/public-sidebar';
import Content from '@/components/organisms/content';
import HousePublic from '@/components/molecules/card/house-public';

type PublicContentTemplateProps = {
	address: string;
	name: string;
	image?: string | null;
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
			<HousePublic
				address={address}
				latitude={latitude}
				longitude={longitude}
				name={name}
				image={image}
				className="block md:hidden"
			/>
			<div className="flex flex-col gap-2 items-stretch w-full font-body overflow-hidden grow">
				<div
					className={`flex flex-auto gap-4 min-h-full relative w-full`}
				>
					<PublicSidebar
						categoryId={categoryId}
						subCategoryId={subCategoryId}
						propertyId={propertyId}
						address={address}
						name={name}
						image={image}
						latitude={latitude}
						longitude={longitude}
					/>
					<Content>{children}</Content>
				</div>
			</div>
		</SidebarProvider>
	);
};

export default PublicContentTemplate;
