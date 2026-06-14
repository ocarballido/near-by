"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Typography from "@/components/atoms/typography";
import ButtonIcon from "@/components/atoms/button-icon";
import IconDelete from "@/components/atoms/icon/delete";

export type ExploreDetailCardDetail = {
    id: string;
    name: string;
    instructions: string | null;
    guidelines: string | null;
    image_url: string | null;
};

type ExploreDetailCardProps = {
    detail: ExploreDetailCardDetail;
    onDelete?: (id: string) => void;
    className?: string;
};

export default function ExploreDetailCard({
    detail,
    onDelete,
    className = "",
}: ExploreDetailCardProps) {
    const t = useTranslations();

    const graySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><rect width="4" height="4" fill="#a3e7d0" /></svg>`;
    const grayDataUrl = `data:image/svg+xml;base64,${Buffer.from(graySvg).toString("base64")}`;

    const imageSrc =
        detail.image_url ??
        "/static/img/place-placeholder/extras_placeholder.webp";

    const image = (
        <div className="w-18 h-18 rounded-md overflow-hidden relative shrink-0 bg-gradient-to-tr from-[#ffa263] to-[#6cffc9]">
            <Image
                alt={detail.name}
                className="object-cover z-0"
                placeholder="blur"
                blurDataURL={grayDataUrl}
                src={imageSrc}
                fill
            />
        </div>
    );

    const content = (
        <>
            {detail.instructions && (
                <div className="mt-1">
                    <Typography size="sm" weight="medium">
                        {t("Cómo se usa")}
                    </Typography>
                    <Typography size="sm" color="text-gray-500">
                        {detail.instructions}
                    </Typography>
                </div>
            )}

            {detail.guidelines && (
                <div className="mt-1">
                    <Typography size="sm" weight="medium">
                        {t("Qué pedimos")}
                    </Typography>
                    <Typography size="sm" color="text-gray-500">
                        {detail.guidelines}
                    </Typography>
                </div>
            )}
        </>
    );

    const deleteButton = onDelete && (
        <div className="flex items-center">
            <ButtonIcon
                onClick={() => onDelete(detail.id)}
                icon={<IconDelete />}
                color="error"
                className="h-fit"
            />
        </div>
    );

    return (
        <div
            className={`w-full flex flex-col gap-4 rounded-xl p-2 relative transition-all hover:shadow-xs hover:bg-white ${className}`}
        >
            {/* lg y superior: todo en una fila */}
            <div className="hidden lg:flex w-full gap-4 relative">
                {image}
                <div className="flex flex-col gap-1 mr-auto">
                    <h5 className="font-heading font-bold text-md">
                        {detail.name}
                    </h5>
                    {content}
                </div>
                {deleteButton}
            </div>

            {/* Menos de lg: imagen + nombre + delete arriba, contenido abajo */}
            <div className="flex flex-col gap-3 lg:hidden">
                <div className="flex gap-4 items-center relative">
                    {image}
                    <h5 className="font-heading font-bold text-md mr-auto">
                        {detail.name}
                    </h5>
                    {deleteButton}
                </div>
                <div className="flex flex-col gap-1">{content}</div>
            </div>
        </div>
    );
}
