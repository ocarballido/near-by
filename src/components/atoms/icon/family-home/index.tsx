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

const IconFamiltHome = ({
    color = "body",
    size = 24,
    className,
}: IconProps) => {
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
            <g mask="url(#mask0_961_19)">
                <path d="M12 3L23 11.25L21.8 12.85L20 11.5V21H4V11.5L2.2 12.85L1 11.25L12 3ZM7.35 12.05C7.35 12.9333 7.825 13.875 8.775 14.875C9.725 15.875 10.8 16.9167 12 18C13.2 16.9167 14.275 15.875 15.225 14.875C16.175 13.875 16.65 12.9333 16.65 12.05C16.65 11.3167 16.4 10.7083 15.9 10.225C15.4 9.74167 14.8 9.5 14.1 9.5C13.6667 9.5 13.2708 9.5875 12.9125 9.7625C12.5542 9.9375 12.25 10.1667 12 10.45C11.75 10.1667 11.4375 9.9375 11.0625 9.7625C10.6875 9.5875 10.3 9.5 9.9 9.5C9.2 9.5 8.6 9.74167 8.1 10.225C7.6 10.7083 7.35 11.3167 7.35 12.05Z" />
            </g>
        </svg>
    );
};

export default IconFamiltHome;
