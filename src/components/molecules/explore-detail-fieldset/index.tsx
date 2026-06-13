"use client";

import { useTranslations } from "next-intl";
import TextField from "../text-field";
import TextArea from "@/components/molecules/text-area";
import Button from "@/components/molecules/button";
import Typography from "@/components/atoms/typography";
import ButtonIcon from "@/components/atoms/button-icon";
import IconDelete from "@/components/atoms/icon/delete";

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
    onChange: (
        localId: string,
        field: keyof Pick<
            DetailFieldsetState,
            "name" | "instructions" | "guidelines"
        >,
        value: string,
    ) => void;
    onRemove: (localId: string) => void;
};

export default function ExploreDetailFieldset({
    fieldset,
    onChange,
    onRemove,
}: ExploreDetailFieldsetProps) {
    const t = useTranslations();

    return (
        <fieldset className="flex flex-col gap-4 p-4 bg-white rounded-xl border-2 border-gray-200 border-dashed hover:border-primary-300">
            <div className="flex items-center justify-between gap-2">
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
                <ButtonIcon
                    icon={<IconDelete />}
                    color="error"
                    onClick={() => onRemove(fieldset.localId)}
                />
            </div>

            <TextField
                label={t("Nombre")}
                value={fieldset.name}
                onChange={(e) =>
                    onChange(fieldset.localId, "name", e.target.value)
                }
                id={`name-${fieldset.localId}`}
            />

            <TextArea
                label={t("Cómo se usa")}
                value={fieldset.instructions}
                onChange={(e) =>
                    onChange(fieldset.localId, "instructions", e.target.value)
                }
                rows={4}
            />

            <TextArea
                label={t("Qué pedimos")}
                value={fieldset.guidelines}
                onChange={(e) =>
                    onChange(fieldset.localId, "guidelines", e.target.value)
                }
                rows={3}
            />
        </fieldset>
    );
}
