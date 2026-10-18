import clsx from "clsx";

type CategoryBodyProps = {
    children: React.ReactNode;
    open: boolean;
};

const CategoryBody = ({ children, open = false }: CategoryBodyProps) => {
    return (
        <div
            className={clsx(
                "grid w-full transition-all duration-300",
                // mb-3 (+ el gap de la lista) separa el grupo abierto del siguiente
                open
                    ? "grid-rows-[1fr] mt-1 mb-3"
                    : "grid-rows-[0fr] mt-0 mb-0",
            )}
        >
            {/* Línea guía alineada con el centro del icono de la categoría
                (círculo de 40px): el texto de los hijos cae bajo el del padre */}
            <div className="flex flex-col gap-1 overflow-hidden min-h-0 ml-5 pl-3 border-l border-gray-300 text-sm">
                {children}
            </div>
        </div>
    );
};

export default CategoryBody;
