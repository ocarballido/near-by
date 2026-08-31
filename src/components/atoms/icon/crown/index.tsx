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

const IconCrown = ({ color = "body", size = 24, className }: IconProps) => {
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
                <path d="M5.00037 20V18H19.0004V20H5.00037ZM5.00037 16.5L3.72537 8.47503C3.69203 8.47503 3.65453 8.4792 3.61287 8.48753C3.5712 8.49586 3.5337 8.50003 3.50037 8.50003C3.0837 8.50003 2.72953 8.3542 2.43787 8.06253C2.1462 7.77086 2.00037 7.4167 2.00037 7.00003C2.00037 6.58336 2.1462 6.2292 2.43787 5.93753C2.72953 5.64586 3.0837 5.50003 3.50037 5.50003C3.91703 5.50003 4.2712 5.64586 4.56287 5.93753C4.85453 6.2292 5.00037 6.58336 5.00037 7.00003C5.00037 7.1167 4.98787 7.22503 4.96287 7.32503C4.93787 7.42503 4.9087 7.5167 4.87537 7.60003L8.00037 9.00003L11.1254 4.72503C10.942 4.5917 10.792 4.4167 10.6754 4.20003C10.5587 3.98336 10.5004 3.75003 10.5004 3.50003C10.5004 3.08336 10.6462 2.7292 10.9379 2.43753C11.2295 2.14586 11.5837 2.00003 12.0004 2.00003C12.417 2.00003 12.7712 2.14586 13.0629 2.43753C13.3545 2.7292 13.5004 3.08336 13.5004 3.50003C13.5004 3.75003 13.442 3.98336 13.3254 4.20003C13.2087 4.4167 13.0587 4.5917 12.8754 4.72503L16.0004 9.00003L19.1254 7.60003C19.092 7.5167 19.0629 7.42503 19.0379 7.32503C19.0129 7.22503 19.0004 7.1167 19.0004 7.00003C19.0004 6.58336 19.1462 6.2292 19.4379 5.93753C19.7295 5.64586 20.0837 5.50003 20.5004 5.50003C20.917 5.50003 21.2712 5.64586 21.5629 5.93753C21.8545 6.2292 22.0004 6.58336 22.0004 7.00003C22.0004 7.4167 21.8545 7.77086 21.5629 8.06253C21.2712 8.3542 20.917 8.50003 20.5004 8.50003C20.467 8.50003 20.4295 8.49586 20.3879 8.48753C20.3462 8.4792 20.3087 8.47503 20.2754 8.47503L19.0004 16.5H5.00037Z" />
            </g>
        </svg>
    );
};

export default IconCrown;
