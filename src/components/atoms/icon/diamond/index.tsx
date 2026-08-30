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

const IconDiamond = ({ color = "body", size = 24, className }: IconProps) => {
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
            <g mask="url(#mask0_4_4084)">
                <path d="M9.20037 8.24979L11.8504 2.99979H12.1504L14.8004 8.24979H9.20037ZM11.2504 20.0998L2.62537 9.74979H11.2504V20.0998ZM12.7504 20.0998V9.74979H21.3754L12.7504 20.0998ZM16.4504 8.24979L13.8504 2.99979H19.0004L21.6254 8.24979H16.4504ZM2.37537 8.24979L5.00037 2.99979H10.1504L7.55037 8.24979H2.37537Z" />
            </g>
        </svg>
    );
};

export default IconDiamond;
