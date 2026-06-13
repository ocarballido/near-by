import clsx from "clsx";

import ButtonIcon from "@/components/atoms/button-icon";
import IconKeyboardArrowDown from "@/components/atoms/icon/keyboard-arrow-down";

type CategoryButtonProps = {
    open?: boolean;
    icon: React.ReactNode;
    name: string;
    active: boolean;
    hasContent?: boolean;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
};

const CategoryButton = ({
    open = false,
    icon,
    name,
    active,
    hasContent,
    onClick,
}: CategoryButtonProps) => {
    const buttonStyles = clsx({
        "font-bold": open,
    });

    const arrowStyles = clsx({
        "rotate-180": open,
    });

    return (
        <div onClick={onClick} className={`flex w-full items-center`}>
            <div
                className={`flex items-center justify-center gap-2 mr-auto py-2 ${active ? "text-primary-500" : "text-gray-700"}`}
            >
                <ButtonIcon
                    className={`pointer-events-none ${active ? "bg-primary-100" : "bg-transparent opacity-70"}`}
                    color={active ? "primary" : "secondary"}
                    icon={icon}
                    active={open}
                />
                {name}
            </div>
            {hasContent !== undefined && (
                <span
                    className={clsx(
                        "w-1.5 h-1.5 rounded-full mr-2",
                        hasContent ? "bg-green-500" : "bg-gray-300",
                    )}
                />
            )}
            <div className={`transition-all ${arrowStyles}`}>
                <IconKeyboardArrowDown />
            </div>
        </div>
    );
};

export default CategoryButton;
