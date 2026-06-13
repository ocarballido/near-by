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
    const buttonStyles = clsx({
        "bg-[#f3f3f3]": active,
    });

    return (
        <div
            className={`rounded-md w-full transition-all flex items-center justify-between hover:bg-[#f3f3f3] hover:cursor-pointer disabled:pointer-events-none font-medium py-2 px-4 min-h-14 ${buttonStyles}`}
            onClick={onClick}
        >
            <span className="flex items-center gap-3 justify-between w-full">
                {label}
                {count !== undefined && (
                    <span className="text-xs font-semibold text-primary-600 tabular-nums py-1 px-2 rounded-full bg-primary-100">
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
