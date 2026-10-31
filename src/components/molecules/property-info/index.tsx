import { useTranslations } from "next-intl";
import clsx from "clsx";
import Image from "next/image";

import { Link } from "@/i18n/routing";
import IconChevronForward from "@/components/atoms/icon/chevron-forward";

export type PropertyStatus = "ready" | "pending";

type PropertyInfoProps = {
    image: string | null;
    name: string;
    status: PropertyStatus;
    href: string;
};

const PropertyInfo = ({ image, name, status, href }: PropertyInfoProps) => {
    const t = useTranslations();

    return (
        <Link
            href={href}
            className="flex gap-3 items-center w-full p-1 rounded-2xl bg-white transition-colors hover:bg-gray-50"
        >
            <div className="relative shrink-0 size-12 rounded-xl overflow-hidden bg-primary-100">
                {/* Mismo placeholder que la card House cuando no hay imagen.
                    sizes al doble de la caja: object-cover recorta a cuadrado y
                    una imagen apaisada necesita más ancho que 48px para no pixelarse */}
                <Image
                    src={image ?? "/static/img/heroMobile.webp"}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                />
            </div>

            <div className="flex flex-col gap-1 flex-1 min-w-0">
                <p className="text-sm leading-4 font-medium text-gray-600 break-words">
                    {name}
                </p>
                <p
                    className={clsx(
                        "text-xs leading-[14px] font-bold",
                        // Tonos -600: el -500 de Figma no llega a 4.5:1 en 12px
                        status === "ready"
                            ? "text-primary-600"
                            : "text-error-600",
                    )}
                >
                    {status === "ready"
                        ? t("propertyStatusReady")
                        : t("propertyStatusPending")}
                </p>
            </div>

            <IconChevronForward className="shrink-0 fill-gray-600" />
        </Link>
    );
};

export default PropertyInfo;
