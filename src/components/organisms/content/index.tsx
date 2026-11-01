const Content = ({
    children,
    propertyId,
    categoryId,
    subCategoryId,
    footer,
    fullBleed = false,
}: {
    children: React.ReactNode;
    propertyId?: string;
    categoryId?: string;
    subCategoryId?: string;
    // Fijo al pie del contenedor: solo hace scroll el contenido de encima
    footer?: React.ReactNode;
    // Guía pública: en mobile ocupa todo el ancho (sin redondeo) y el
    // contenido llega a los bordes. Sin él, la tarjeta es la misma que sin footer
    fullBleed?: boolean;
}) => {
    if (!footer) {
        return (
            <main className="flex flex-col gap-2 w-full grow min-h-0 rounded-3xl bg-gray-50 p-0.5 pb-0 overflow-y-auto overscroll-contain shadow-xs">
                {children}
            </main>
        );
    }

    return (
        <div
            className={
                fullBleed
                    ? "flex flex-col w-full grow min-h-0 rounded-none md:rounded-3xl bg-gray-50 overflow-hidden shadow-xs"
                    : "flex flex-col w-full grow min-h-0 rounded-3xl bg-gray-50 overflow-hidden shadow-xs"
            }
        >
            <main
                className={
                    fullBleed
                        ? "flex flex-col grow min-h-0 overflow-y-auto overscroll-contain"
                        : "flex flex-col gap-2 grow min-h-0 p-0.5 pb-0 overflow-y-auto overscroll-contain"
                }
            >
                {children}
            </main>
            {footer}
        </div>
    );
};

export default Content;
