"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Typography from "@/components/atoms/typography";
import ButtonIcon from "@/components/atoms/button-icon";
import IconDelete from "@/components/atoms/icon/delete";
import type { PropertyDetailRow } from "@/types/property-details";

type ExploreDetailCardProps = {
    detail: PropertyDetailRow;
    onDelete?: (id: string) => void;
};

export default function ExploreDetailCard({
    detail,
    onDelete,
}: ExploreDetailCardProps) {
    const t = useTranslations();

    const graySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><rect width="4" height="4" fill="#a3e7d0" /></svg>`;
    const grayDataUrl = `data:image/svg+xml;base64,${Buffer.from(graySvg).toString("base64")}`;

    const imageSrc =
        detail.image_url ??
        "/static/img/place-placeholder/extras_placeholder.webp";

    return (
        <div className="flex flex-col items-end rounded-xl overflow-hidden relative transition-all hover:shadow-2xl bg-white shadow-xs p-2">
            <div className="h-[250px] w-full relative bg-gradient-to-tr from-[#ffa263] to-[#6cffc9] rounded-md overflow-hidden">
                <Image
                    className="object-cover z-0"
                    src={imageSrc}
                    fill={true}
                    placeholder="blur"
                    blurDataURL={grayDataUrl}
                    alt={detail.name}
                />
            </div>
            <div className="content transition-all flex justify-end gap-3 flex-col relative w-full bg-white z-5 p-4">
                <div className="flex items-center justify-between gap-2">
                    <Typography component="h5">{detail.name}</Typography>
                    {onDelete && (
                        <ButtonIcon
                            icon={<IconDelete />}
                            color="error"
                            onClick={() => onDelete(detail.id)}
                        />
                    )}
                </div>

                {detail.instructions && (
                    <div className="flex flex-col gap-1">
                        <Typography size="sm" weight="medium">
                            {t("Cómo se usa")}
                        </Typography>
                        <Typography size="sm" color="text-gray-500">
                            {detail.instructions}
                        </Typography>
                    </div>
                )}

                {detail.guidelines && (
                    <div className="flex flex-col gap-1">
                        <Typography size="sm" weight="medium">
                            {t("Qué pedimos")}
                        </Typography>
                        <Typography size="sm" color="text-gray-500">
                            {detail.guidelines}
                        </Typography>
                    </div>
                )}
            </div>
        </div>
    );
}
