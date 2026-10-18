"use client";

import clsx from "clsx";

import IconEdit from "@/components/atoms/icon/edit";
import IconDelete from "@/components/atoms/icon/delete";
import ButtonIcon from "@/components/atoms/button-icon";

type GroupItemProps = {
    active?: boolean;
    deleatable?: boolean;
    editeable?: boolean;
    label: string;
    count?: number;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    handleEdit?: React.MouseEventHandler<HTMLButtonElement>;
    handleDelete?: React.MouseEventHandler<HTMLButtonElement>;
};

const GroupItem = ({
    active = false,
    deleatable = false,
    editeable = false,
    label,
    count,
    onClick,
    handleEdit,
    handleDelete,
}: GroupItemProps) => {
    const buttonStyles = clsx(
        active
            ? "bg-secondary-200 text-secondary-800"
            : "text-secondary-600 hover:text-secondary-800",
    );

    return (
        <div
            className={`rounded-lg w-full transition-all flex items-center justify-between hover:cursor-pointer disabled:pointer-events-none font-medium text-sm leading-4 pl-4 pr-2 min-h-10 ${buttonStyles}`}
            onClick={onClick}
        >
            <span className="flex items-center gap-4 justify-between w-full">
                {label}
                {count !== undefined && (
                    <span className="flex items-center justify-center min-h-6 px-2 rounded-full bg-white text-sm leading-4 font-medium text-primary-500 tabular-nums">
                        {count}
                    </span>
                )}
            </span>
            <div className="flex items-center justify-center">
                {deleatable && (
                    <ButtonIcon
                        color="secondary"
                        icon={<IconDelete />}
                        onClick={handleDelete}
                    />
                )}
                {editeable && (
                    <ButtonIcon
                        color="secondary"
                        icon={<IconEdit />}
                        onClick={handleEdit}
                    />
                )}
            </div>
        </div>
    );
};

export default GroupItem;
