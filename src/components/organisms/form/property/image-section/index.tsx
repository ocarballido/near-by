// image-section/index.tsx
"use client";

import InputFile from "@/components/molecules/input-file";

import type { FieldError } from "react-hook-form";

type Props = {
    imageUrl: string | null;
    label: string;
    error?: FieldError;
    registerProps: React.InputHTMLAttributes<HTMLInputElement>;
    onRemove?: () => void;
};

export default function ImageSection({
    imageUrl,
    label,
    error,
    registerProps,
    onRemove,
}: Props) {
    return (
        <InputFile
            label={label}
            error={Boolean(error)}
            helperText={error?.message as string}
            className="w-full mx-auto"
            initialPreviewUrl={imageUrl}
            onRemove={onRemove}
            {...registerProps}
        />
    );
}
