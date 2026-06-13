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
                open ? "grid-rows-[1fr] mt-1" : "grid-rows-[0fr] mt-0",
            )}
        >
            <div className="flex flex-col gap-2 overflow-hidden min-h-0">
                {children}
            </div>
        </div>
    );
};

export default CategoryBody;
