const Content = ({
    children,
    propertyId,
    categoryId,
    subCategoryId,
    footer,
}: {
    children: React.ReactNode;
    propertyId?: string;
    categoryId?: string;
    subCategoryId?: string;
    // Fijo al pie del contenedor: solo hace scroll el contenido de encima
    footer?: React.ReactNode;
}) => {
    if (!footer) {
        return (
            <main className="flex flex-col gap-2 w-full grow min-h-0 rounded-xl bg-gray-50 p-0.5 pb-0 overflow-y-auto overscroll-contain shadow-main">
                {children}
            </main>
        );
    }

    return (
        <div className="flex flex-col w-full grow min-h-0 rounded-none md:rounded-2xl bg-gray-50 overflow-hidden shadow-main">
            <main className="flex flex-col grow min-h-0 overflow-y-auto overscroll-contain">
                {children}
            </main>
            {footer}
        </div>
    );
};

export default Content;
