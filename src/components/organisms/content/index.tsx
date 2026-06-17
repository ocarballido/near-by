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
        <main className="flex flex-col gap-2 w-full grow rounded-xl overflow-hidden bg-gray-50 p-0.5">
            {children}
        </main>
    );
};

export default Content;
