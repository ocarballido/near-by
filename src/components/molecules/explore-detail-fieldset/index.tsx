"use client";

import { useTranslations } from "next-intl";
import TextField from "../text-field";
import TextArea from "@/components/molecules/text-area";
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
    onRemove: (localId: string, wasOpen: boolean) => void;
};

export default function ExploreDetailFieldset({
    fieldset,
    isOpen,
    onToggle,
    onChange,
    onRemove,
}: ExploreDetailFieldsetProps) {
    const t = useTranslations();

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
                    </div>
                </div>
            </div>
        </fieldset>
    );
}
