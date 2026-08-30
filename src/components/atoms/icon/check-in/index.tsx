import clsx from "clsx";

import styles from "../styles.module.css";

type IconProps = {
    size?: number;
    color?:
        | "primary"
        | "secondary"
        | "success"
        | "warning"
        | "info"
        | "error"
        | "body"
        | "light"
        | "white";
    className?: string;
};

const IconCheckIn = ({ color = "body", size = 24, className }: IconProps) => {
    const semanticStyles = clsx({
        [styles["icon--primary"]]: color === "primary",
        [styles["icon--secondary"]]: color === "secondary",
        [styles["icon--success"]]: color === "success",
        [styles["icon--warning"]]: color === "warning",
        [styles["icon--info"]]: color === "info",
        [styles["icon--error"]]: color === "error",
        [styles["icon--body"]]: color === "body",
        [styles["icon--light"]]: color === "light",
        [styles["icon--white"]]: color === "white",
    });

    // className es una vía de escape explícita: si viene, sustituye a la
    // clase semántica por completo, no se combinan (evita conflictos de
    // orden de bundle entre Tailwind y el CSS Module).
    const iconStyles = className ?? semanticStyles;

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={iconStyles}
        >
            <mask
                id="mask0_3_666"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width={size}
                height={size}
            >
                <rect width={size} height={size} fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0_778_50)">
                <path d="M3 21V19H21V21H3ZM18.55 15.95L3 11.525V4.24999L5.4 4.92499L6.6 8.39999L10.05 9.37499L9.175 0.799988L12.05 1.64999L15.25 10.875L19.55 12.1C19.9667 12.2333 20.3125 12.475 20.5875 12.825C20.8625 13.175 21 13.575 21 14.025C21 14.6083 20.7625 15.1208 20.2875 15.5625C19.8125 16.0042 19.2333 16.1333 18.55 15.95Z" />
            </g>
        </svg>
    );
};

export default IconCheckIn;
