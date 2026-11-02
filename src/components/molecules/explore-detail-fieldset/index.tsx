"use client";

import { useTranslations } from "next-intl";
import { MAX_IMAGE_SIZE, MAX_IMAGE_SIZE_KB } from "@/config/config-constants";
import TextField from "../text-field";
import TextArea from "@/components/molecules/text-area";
import InputFile from "@/components/molecules/input-file";
import Typography from "@/components/atoms/typography";
import ButtonIcon from "@/components/atoms/button-icon";
import IconDelete from "@/components/atoms/icon/delete";
import IconKeyboardArrowDown from "@/components/atoms/icon/keyboard-arrow-down";

export type DetailFieldsetState = {
    localId: string;
    dbId: string | undefined;
    name: string;
    instructions: string;
    guidelines: string;
    predefinedKey: string | null;
    orderIndex: number;
    isDirty: boolean;
    // URL guardada en BD; imageFile es la imagen elegida pendiente de subir
    imageUrl: string | null;
    imageFile: File | null;
    removeImage: boolean;
};

type ExploreDetailFieldsetProps = {
    fieldset: DetailFieldsetState;
    isOpen: boolean;
    onToggle: (localId: string) => void;
    onChange: (
        localId: string,
        field: keyof Pick<
            DetailFieldsetState,
            "name" | "instructions" | "guidelines"
        >,
        value: string,
    ) => void;
    // file null: el anfitrión ha quitado la imagen
    onImageChange: (localId: string, file: File | null) => void;
    onRemove: (localId: string, wasOpen: boolean) => void;
};

export default function ExploreDetailFieldset({
    fieldset,
    isOpen,
    onToggle,
    onChange,
    onImageChange,
    onRemove,
}: ExploreDetailFieldsetProps) {
    const t = useTranslations();

    const isImageTooLarge =
        fieldset.imageFile !== null && fieldset.imageFile.size > MAX_IMAGE_SIZE;

    return (
        <fieldset
            className={`flex flex-col rounded-xl border-1 transition-colors ${
                isOpen
                    ? "border-primary-100 bg-primary-50"
                    : "border-gray-100 hover:border-primary-200 bg-white"
            }`}
        >
            {/* Header — siempre visible */}
            <div
                role="button"
                tabIndex={0}
                onClick={() => onToggle(fieldset.localId)}
                onKeyDown={(e) =>
                    e.key === "Enter" && onToggle(fieldset.localId)
                }
                className="flex items-center justify-between gap-2 w-full p-4 text-left cursor-pointer"
            >
                <div className="flex items-center gap-2">
                    <Typography component="h3" size="sm" weight="medium">
                        {fieldset.name || t("Nuevo detalle")}
                    </Typography>
                    {fieldset.predefinedKey && (
                        <span className="text-xs font-medium text-primary-700 bg-primary-100 px-2 py-0.5 rounded-full">
                            {t("Predefinido")}
                        </span>
                    )}
                </div>
                <div className="flex gap-0.5 items-center">
                    <ButtonIcon
                        icon={
                            <div
                                className={`transition-transform duration-200 ${
                                    isOpen ? "rotate-180" : ""
                                }`}
                            >
                                <IconKeyboardArrowDown />
                            </div>
                        }
                        color="secondary"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggle(fieldset.localId);
                        }}
                    />
                    <ButtonIcon
                        icon={<IconDelete />}
                        color="error"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(fieldset.localId, isOpen);
                        }}
                    />
                </div>
            </div>

            {/* Body animado */}
            <div
                className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
            >
                <div className="overflow-hidden">
                    <div className="flex flex-col gap-4 px-4 pb-4">
                        <TextField
                            label={t("Nombre")}
                            value={fieldset.name}
                            onChange={(e) =>
                                onChange(
                                    fieldset.localId,
                                    "name",
                                    e.target.value,
                                )
                            }
                            id={`name-${fieldset.localId}`}
                        />
                        <TextArea
                            label={t("Cómo se usa")}
                            value={fieldset.instructions}
                            onChange={(e) =>
                                onChange(
                                    fieldset.localId,
                                    "instructions",
                                    e.target.value,
                                )
                            }
                            rows={4}
                        />
                        <TextArea
                            label={t("Qué pedimos")}
                            value={fieldset.guidelines}
                            onChange={(e) =>
                                onChange(
                                    fieldset.localId,
                                    "guidelines",
                                    e.target.value,
                                )
                            }
                            rows={3}
                        />
                        {/* id: el editor lo lleva a la vista si la imagen
                            supera el tamaño al intentar guardar */}
                        <div id={`detail-image-${fieldset.localId}`}>
                            <InputFile
                                id={`image-${fieldset.localId}`}
                                label={t("Imagen")}
                                className="w-full mx-auto"
                                initialPreviewUrl={fieldset.imageUrl}
                                error={isImageTooLarge}
                                helperText={
                                    isImageTooLarge
                                        ? t("detailImageTooLarge", {
                                              kb: MAX_IMAGE_SIZE_KB,
                                          })
                                        : ""
                                }
                                // Los tipos que admite el servidor
                                // (image-extension.ts): un HEIC o SVG se
                                // rechaza aquí y no tras guardar el texto
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                // Quitar va solo por el botón "Eliminar": un
                                // change sin fichero no significa quitarla
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file)
                                        onImageChange(fieldset.localId, file);
                                }}
                                onRemove={() =>
                                    onImageChange(fieldset.localId, null)
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </fieldset>
    );
}
