import clsx from "clsx";

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
    showSidebar?: boolean;
};

const AppContentTemplate = ({
    children,
    sidebar = "APP",
    propertyId,
    categoryId,
    subCategoryId,
    showSidebar = true,
}: AppContentTemplateProps) => {
    return (
        <div className="flex flex-col gap-2 items-stretch w-full font-body overflow-hidden grow min-h-0">
            {/* Desde md el sidebar queda pegado al borde: sin él, el padding
                izquierdo se mantiene igual que el derecho */}
            <div
                className={clsx(
                    "flex flex-auto min-h-0 relative w-full pr-4 pb-4 pl-4",
                    showSidebar && "md:pl-0",
                )}
            >
                {showSidebar && (
                    <Sidebar
                        sidebar={sidebar}
                        propertyId={propertyId}
                        categoryId={categoryId}
                        subCategoryId={subCategoryId}
                    />
                )}
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
