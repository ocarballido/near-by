import clsx from "clsx";

import IconKeyboardArrowDown from "@/components/atoms/icon/keyboard-arrow-down";

import styles from "./styles.module.css";

type CategoryButtonProps = {
    open?: boolean;
    icon: React.ReactNode;
    name: string;
    active: boolean;
    hasContent?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const CategoryButton = ({
    open = false,
    icon,
    name,
    active,
    hasContent,
    onClick,
}: CategoryButtonProps) => {
    const iconStyles = clsx(
        "flex shrink-0 items-center justify-center p-2 rounded-full transition-all",
        {
            [`bg-white ${styles["icon--primary"]}`]: active,
            [styles["icon--dark"]]: !active && open,
            [styles["icon--light"]]: !active && !open,
        },
    );

    const labelStyles = clsx(
        "flex-1 min-w-0 text-sm leading-4 font-medium transition-colors",
        active || open
            ? "text-secondary-800"
            : "text-secondary-600 group-hover:text-secondary-800",
    );

    const arrowStyles = clsx(
        "flex shrink-0 items-center justify-center p-2 rounded-full transition-all",
        { "rotate-180": open },
    );

    return (
        <button
            type="button"
            onClick={onClick}
            aria-expanded={open}
            className={`group flex w-full items-center gap-2 py-1 rounded-lg text-left cursor-pointer ${styles["category-button"]}`}
        >
            <span className={iconStyles}>{icon}</span>
            <span className={labelStyles}>{name}</span>
            {hasContent !== undefined && (
                <span
                    className={clsx(
                        "size-1.5 shrink-0 rounded-full",
                        hasContent ? "bg-primary-400" : "bg-secondary-300",
                    )}
                />
            )}
            <span className={arrowStyles}>
                <IconKeyboardArrowDown
                    className={
                        open
                            ? "fill-secondary-800"
                            : "fill-secondary-600 group-hover:fill-secondary-800"
                    }
                />
            </span>
        </button>
    );
};

export default CategoryButton;
