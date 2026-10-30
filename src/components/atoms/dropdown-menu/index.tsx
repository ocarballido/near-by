import clsx from "clsx";

type DropdownMenuProps = {
    className?: string;
    children: React.ReactNode;
    open: boolean;
};

const DropdownMenu = ({
    className = "",
    children,
    open = false,
}: DropdownMenuProps) => {
    const dropdownMenuStyles = clsx(
        {
            "flex opacity-100 translate-y-0 starting:opacity-0 starting:-translate-y-1":
                open,
        },
        {
            "hidden opacity-0 -translate-y-1 pointer-events-none": !open,
        },
        className,
    );

    // Animación solo con CSS: `starting:` (@starting-style) anima la entrada
    // desde display: none y transition-discrete retrasa el display: none al
    // cerrar. Sin soporte del navegador, aparece y desaparece sin animación.
    // pointer-events-none: mientras se desvanece no debe recibir clics
    return (
        <div
            className={`flex-col gap-2 p-1 bg-white rounded-xl shadow-xl z-10 transition-[opacity,translate,display] transition-discrete duration-150 ease-out motion-reduce:transition-none ${dropdownMenuStyles}`}
        >
            {children}
        </div>
    );
};

export default DropdownMenu;
