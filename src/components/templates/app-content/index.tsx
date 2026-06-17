import { SidebarProvider } from "@/lib/context/SidebarContext";

import Sidebar from "@/components/organisms/sidebar";
import Content from "@/components/organisms/content";

type Category = {
    id: string;
    name: string;
    icon: string;
    firstEntryId: string;
};

type AppContentTemplateProps = {
    children: React.ReactNode;
    sidebar?: "APP" | "PROPERTY";
    categoryId?: string;
    subCategoryId?: string;
    categories?: Category[];
    subcategoryGroupId?: string;
    propertySlug?: string;
    propertyId?: string;
};

const AppContentTemplate = ({
    children,
    sidebar = "APP",
    propertyId,
    categoryId,
    subCategoryId,
}: AppContentTemplateProps) => {
    return (
        <div className="flex flex-col gap-2 items-stretch w-full font-body overflow-hidden grow">
            <div className={`flex flex-auto gap-2 min-h-full relative w-full`}>
                <Sidebar
                    sidebar={sidebar}
                    propertyId={propertyId}
                    categoryId={categoryId}
                    subCategoryId={subCategoryId}
                />
                <Content
                    propertyId={propertyId}
                    categoryId={categoryId}
                    subCategoryId={subCategoryId}
                >
                    {children}
                </Content>
            </div>
        </div>
    );
};

export default AppContentTemplate;
