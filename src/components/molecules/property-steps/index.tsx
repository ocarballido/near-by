"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

import ProgressBar from "@/components/atoms/progress-bar";
import IconCheckCircle from "@/components/atoms/icon/check-circle";

type ProgressBarProps = {
    hasLocation: boolean;
    hasInfo: boolean;
};

const PropertySteps = ({ hasInfo, hasLocation }: ProgressBarProps) => {
    const t = useTranslations();

    const steps = useMemo(() => {
        if ((hasInfo && !hasLocation) || (!hasInfo && hasLocation)) {
            return 66;
        } else if (hasInfo && hasLocation) {
            return 100;
        } else {
            return 33;
        }
    }, [hasInfo, hasLocation]);

    return (
        <div className="flex flex-col gap-3 mt-3">
            <ProgressBar progress={steps} />
            <ul className="w-full">
                <li className="text-xs mb-1 flex flex-wrap gap-1 justify-between">
                    {t("Propiedad añadida")}
                    <IconCheckCircle size={20} color="primary" />
                </li>
                <li className="text-xs mb-1 flex flex-wrap gap-1 justify-between">
                    {t("Contenido El Alojamiento")}
                    {hasInfo ? (
                        <IconCheckCircle size={20} color="primary" />
                    ) : (
                        <span className="w-[16px] h-[16px] bg-secondary-200 rounded-full mx-0.5 my-0.5"></span>
                    )}
                </li>
                <li className="text-xs mb-1 flex flex-wrap gap-1 justify-between">
                    {t("Localizaciones")}
                    {hasLocation ? (
                        <IconCheckCircle size={20} color="primary" />
                    ) : (
                        <span className="w-[16px] h-[16px] bg-secondary-200 rounded-full mx-0.5 my-0.5"></span>
                    )}
                </li>
            </ul>
        </div>
    );
};

export default PropertySteps;
