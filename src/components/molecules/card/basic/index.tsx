import Image from "next/image";
import FancyIcon from "@/components/atoms/icon/fancy-icon";
import { ReactNode } from "react";
import Typography from "@/components/atoms/typography";

type BasicCardPropType = {
    title?: string;
    body?: string;
    className?: string;
    image?: string;
    imageMinHeight?: string;
    children?: ReactNode;
};

const BasicCard = ({
    title,
    body,
    className,
    image = "",
    children,
}: BasicCardPropType) => {
    return (
        <div
            className={`flex flex-1 flex-col p-1 bg-white rounded-2xl items-center text-center relative ${className}`}
        >
            <div className="relative h-fit w-full rounded-xl overflow-hidden bg-gradient-to-tr from-[#ffa263] to-[#6cffc9]">
                <Image
                    alt="Mountains"
                    src={image}
                    width={768}
                    height={500}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            <div className="p-6 flex flex-col gap-2 w-full">
                <Typography component="h3" size="base">
                    {title}
                </Typography>
                <Typography className="opacity-70" weight="medium" size="sm">
                    {body}
                </Typography>
                {children}
            </div>
        </div>
    );
};

export default BasicCard;
