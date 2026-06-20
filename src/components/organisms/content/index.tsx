const Content = ({
    children,
    propertyId,
    categoryId,
    subCategoryId,
}: {
    children: React.ReactNode;
    propertyId?: string;
    categoryId?: string;
    subCategoryId?: string;
}) => {
    return (
        <main className="flex flex-col gap-2 w-full grow min-h-0 rounded-xl bg-gray-50 p-0.5 overflow-y-auto overscroll-contain">
            {children}
        </main>
    );
};

export default Content;
