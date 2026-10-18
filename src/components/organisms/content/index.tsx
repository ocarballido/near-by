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
            <main className="flex flex-col gap-2 w-full grow min-h-0 rounded-xl bg-gray-50 p-0.5 overflow-y-auto overscroll-contain shadow-[0_1px_2px_rgba(16,24,40,0.05),0_4px_12px_-2px_rgba(16,24,40,0.06)]">
                {children}
            </main>
        );
    }

    return (
        <div className="flex flex-col w-full grow min-h-0 rounded-xl bg-gray-50 overflow-hidden shadow-[0_1px_2px_rgba(16,24,40,0.05),0_4px_12px_-2px_rgba(16,24,40,0.06)]">
            <main className="flex flex-col grow min-h-0 overflow-y-auto overscroll-contain">
                {children}
            </main>
            {footer}
        </div>
    );
};

export default Content;
