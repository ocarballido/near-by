"use client";

import React, {
    forwardRef,
    useRef,
    useState,
    useEffect,
    useImperativeHandle,
    ChangeEvent,
} from "react";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import Image from "next/image";
import Button from "../button";
import IconAdd from "@/components/atoms/icon/add";

export type InputFileProps = {
    className?: string;
    disabled?: boolean;
    error?: boolean;
    helperText?: string;
    id?: string;
    label?: string;
    initialPreviewUrl?: string | null;
    onRemove?: () => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

const InputFile = forwardRef<HTMLInputElement, InputFileProps>(
    (
        {
            className = "",
            disabled = false,
            error = false,
            helperText = "",
            id = "",
            label,
            initialPreviewUrl = null,
            onRemove,
            onChange,
            onBlur,
            name,
            ...rest
        },
        forwardedRef,
    ) => {
        const t = useTranslations();
        const internalRef = useRef<HTMLInputElement>(null);
        const [previewUrl, setPreviewUrl] = useState<string | null>(
            initialPreviewUrl,
        );

        useImperativeHandle(forwardedRef, () => internalRef.current!);

        // Libera los object URLs creados localmente (blob:) al cambiar o
        // desmontar. Nunca se revoca la URL original del servidor (https://).
        useEffect(() => {
            return () => {
                if (previewUrl?.startsWith("blob:")) {
                    URL.revokeObjectURL(previewUrl);
                }
            };
        }, [previewUrl]);

        const handleClick = () => {
            if (!disabled) internalRef.current?.click();
        };

        const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                setPreviewUrl(URL.createObjectURL(file));
            }

            onChange?.(e);
        };

        const handleRemove = (e: React.MouseEvent) => {
            // Evita que el click llegue al contenedor (que reabriría el selector)
            e.stopPropagation();

            if (internalRef.current) internalRef.current.value = "";
            setPreviewUrl(null);

            // Notificamos a react-hook-form que el campo queda vacío,
            // igual que ya hace handleFileChange con una selección real.
            onChange?.({
                target: internalRef.current,
            } as ChangeEvent<HTMLInputElement>);

            onRemove?.();
        };

        const labelStyles = clsx({ "text-error-500": error });
        const helperTextStyles = clsx({ "text-error-500": error });
        const inputStyles = clsx(
            { "border-transparent": !error },
            { "border-error-500": error },
            { "opacity-30": disabled },
        );

        return (
            <div className={`flex flex-col gap-1 w-full max-w-96 ${className}`}>
                {label && (
                    <label
                        htmlFor={id}
                        className={`font-medium text-xs text-gray-600 ${labelStyles}`}
                    >
                        {label}
                    </label>
                )}

                <input
                    type="file"
                    id={id}
                    name={name}
                    accept="image/*"
                    disabled={disabled}
                    ref={internalRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    onBlur={onBlur}
                    {...rest}
                />

                <div
                    className={`h-full min-h-44 bg-gray-800/5 border-2 flex items-center justify-center cursor-pointer relative rounded-lg overflow-hidden ${inputStyles}`}
                    onClick={handleClick}
                >
                    {previewUrl ? (
                        <>
                            <Image
                                className="object-cover"
                                src={previewUrl}
                                alt={label || "Preview"}
                                fill
                            />
                            <div className="absolute bottom-0 left-0 right-0 flex gap-2 justify-center p-2 bg-black/40">
                                {/* pointer-events-none: el click pasa al contenedor,
								    que ya abre el selector de archivo (igual que el
								    botón "Subir imagen" del estado vacío) */}
                                <Button
                                    label={t("Reemplazar")}
                                    className="pointer-events-none"
                                    color="white"
                                />
                                <Button
                                    label={t("Eliminar")}
                                    color="white"
                                    onClick={handleRemove}
                                />
                            </div>
                        </>
                    ) : (
                        <Button
                            label={t("Subir imagen")}
                            className="pointer-events-none"
                            color="white"
                            iconLeft={<IconAdd />}
                        />
                    )}
                </div>

                {helperText && (
                    <span className={`text-sm ${helperTextStyles}`}>
                        {helperText}
                    </span>
                )}
            </div>
        );
    },
);

InputFile.displayName = "InputFile";
export default InputFile;
