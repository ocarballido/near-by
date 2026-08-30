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

const IconConstruction = ({
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
            <g mask="url(#mask0_920_19)">
                <path d="M18.9 21L13.425 15.525L15.525 13.425L21 18.9L18.9 21ZM5.1 21L3 18.9L9.9 12L8.2 10.3L7.5 11L6.225 9.725V11.775L5.525 12.475L2.5 9.45L3.2 8.75H5.25L4 7.5L7.55 3.95C7.88333 3.61667 8.24167 3.375 8.625 3.225C9.00833 3.075 9.4 3 9.8 3C10.2 3 10.5917 3.075 10.975 3.225C11.3583 3.375 11.7167 3.61667 12.05 3.95L9.75 6.25L11 7.5L10.3 8.2L12 9.9L14.25 7.65C14.1833 7.46667 14.1292 7.275 14.0875 7.075C14.0458 6.875 14.025 6.675 14.025 6.475C14.025 5.49167 14.3625 4.6625 15.0375 3.9875C15.7125 3.3125 16.5417 2.975 17.525 2.975C17.775 2.975 18.0125 3 18.2375 3.05C18.4625 3.1 18.6917 3.175 18.925 3.275L16.45 5.75L18.25 7.55L20.725 5.075C20.8417 5.30833 20.9208 5.5375 20.9625 5.7625C21.0042 5.9875 21.025 6.225 21.025 6.475C21.025 7.45833 20.6875 8.2875 20.0125 8.9625C19.3375 9.6375 18.5083 9.975 17.525 9.975C17.325 9.975 17.125 9.95833 16.925 9.925C16.725 9.89167 16.5333 9.83333 16.35 9.75L5.1 21Z" />
            </g>
        </svg>
    );
};

export default IconConstruction;
