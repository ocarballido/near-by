import { useTranslations } from "next-intl";

import Image from "next/image";

import Typography from "@/components/atoms/typography";
import IconApartment from "@/components/atoms/icon/apartment";

const FirstPropertyBanner = () => {
    const t = useTranslations();

    return (
        <div className="w-full max-w-[460px] p-4 items-center bg-primary-900 rounded-2xl shadow-xs text-center flex flex-col gap-1 relative overflow-hidden">
            <div className="absolute w-[900px] h-[900px] -translate-y-[50%] top-[50%] z-0">
                <Image
                    src="/static/img/home/blur.webp"
                    fill={true}
                    alt="Blur image"
                    className="absolute object-cover "
                />
            </div>
            <div className="relative">
                <Image
                    alt="Add property"
                    src="/static/img/star.svg"
                    height={120}
                    width={120}
                />
                <div className="absolute top-0 lef-0 w-full h-full flex justify-center items-center">
                    <IconApartment color="white" />
                </div>
            </div>
            <div className="flex flex-col gap-1 relative">
                <Typography component="h2" size="lg" color="text-white">
                    {t("firstPropertyBanner.title")}
                </Typography>
                <Typography color="text-white" weight="medium">
                    {t("firstPropertyBanner.description")}
                </Typography>
            </div>
        </div>
    );
};

export default FirstPropertyBanner;
