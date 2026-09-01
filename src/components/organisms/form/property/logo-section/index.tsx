// logo-section/index.tsx
"use client";

import Typography from "@/components/atoms/typography";
import InputFile from "@/components/molecules/input-file";

import type { FieldError } from "react-hook-form";

type Props = {
    t: (key: string) => string;
    logoUrl: string | null;
    label: string;
    error?: FieldError;
    registerProps: React.InputHTMLAttributes<HTMLInputElement>;
    onRemove?: () => void;
};

export default function LogoSection({
    t,
    logoUrl,
    label,
    error,
    registerProps,
    onRemove,
}: Props) {
    return (
        <>
            <div className="flex flex-col gap-1 p-3 rounded-lg bg-primary-50 border border-primary-100">
                <Typography
                    size="sm"
                    weight="medium"
                    className="text-primary-800"
                >
                    {t("propertyForm.logoRecommendationTitle")}
                </Typography>
                <Typography size="sm" className="text-primary-800 opacity-80">
                    {t("propertyForm.logoRecommendationBody")}
                </Typography>
            </div>

            <InputFile
                label={label}
                error={Boolean(error)}
                helperText={error?.message as string}
                className="w-full mx-auto"
                initialPreviewUrl={logoUrl}
                onRemove={onRemove}
                {...registerProps}
            />
        </>
    );
}
