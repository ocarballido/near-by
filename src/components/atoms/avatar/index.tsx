"use client";

import { useGlobal } from "@/lib/context/GlobalContext";
import { useCallback } from "react";
import IconKeyboardArrowDown from "../icon/keyboard-arrow-down";
import IconAccountCircle from "../icon/account-circle";

type AvatarProps = {
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    className?: string;
};

const Avatar = ({ className, onClick }: AvatarProps) => {
    const { user } = useGlobal();

    const getInitials = useCallback((email: string) => {
        const parts = email.split("@")[0].split(/[._-]/);
        return parts.length > 1
            ? (parts[0][0] + parts[1][0]).toUpperCase()
            : parts[0].slice(0, 1).toUpperCase();
    }, []);

    return (
        <div
            onClick={onClick}
            className={`h-10 ps-3 pe-2 rounded-full bg-secondary-200 hover:bg-secondary-300 hover:cursor-pointer flex justify-center items-center font-bold text-econdary text-xl transition-all duration-200 focus:border-4 focus:border-primary-200 ${className}`}
        >
            {/* {user ? getInitials(user.email) : "?"}{" "} */}
            <IconAccountCircle color="body" />
            <IconKeyboardArrowDown color="body" />
        </div>
    );
};

export default Avatar;
