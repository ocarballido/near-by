import PublicSidebar from "@/components/organisms/sidebar/public-sidebar";
import Content from "@/components/organisms/content";
import PublicBottomNav, {
    type PublicNavItem,
} from "@/components/organisms/public-bottom-nav";

type PublicContentTemplateProps = {
    children: React.ReactNode;
    categoryId?: string;
    subCategoryId?: string;
    propertyId?: string;
    navItems: PublicNavItem[];
};

const PublicContentTemplate = ({
    children,
    categoryId,
    subCategoryId,
    propertyId,
    navItems,
}: PublicContentTemplateProps) => {
    // El sidebar de categorías solo existe en las páginas de "Explorar"
    const withSidebar = navItems.some(
        (item) => item.id === "places" && item.active,
    );

    return (
        <div className="flex flex-col gap-2 items-stretch w-full font-body overflow-hidden grow min-h-0">
            <div
                className={
                    withSidebar
                        ? "flex flex-auto min-h-0 relative w-full pr-4 pb-4 pl-4 md:pl-0"
                        : "flex flex-auto min-h-0 relative w-full px-4 pb-4"
                }
            >
                {withSidebar && (
                    <PublicSidebar
                        categoryId={categoryId}
                        subCategoryId={subCategoryId}
                        propertyId={propertyId}
                    />
                )}
                {/* Desde lg el nav va arriba, bajo el widget horario (page.tsx) */}
                <Content
                    footer={
                        <div className="lg:hidden">
                            <PublicBottomNav items={navItems} />
                        </div>
                    }
                >
                    {children}
                </Content>
            </div>
        </div>
    );
};

export default PublicContentTemplate;
