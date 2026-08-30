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

const IconCheckOut = ({ color = "body", size = 24, className }: IconProps) => {
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
            <g mask="url(#mask0_778_51)">
                <path d="M3 21V19H21V21H3ZM4.75 16L1 9.74998L3.4 9.09998L6.2 11.45L9.7 10.525L4.525 3.62498L7.425 2.84998L14.9 9.12498L19.15 7.97498C19.6833 7.82498 20.1875 7.88748 20.6625 8.16248C21.1375 8.43748 21.45 8.84164 21.6 9.37498C21.75 9.90831 21.6875 10.4125 21.4125 10.8875C21.1375 11.3625 20.7333 11.675 20.2 11.825L4.75 16Z" />
            </g>
        </svg>
    );
};

export default IconCheckOut;
