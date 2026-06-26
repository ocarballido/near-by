"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLoading } from "@/lib/context/LoadingContext";

import { saveDetails } from "@/app/actions/properties/save-details";

import Alert from "@/components/molecules/alert";
import BadgeCheck from "@/components/atoms/BadgeCheck";
import Button from "@/components/molecules/button";
import Typography from "@/components/atoms/typography";
import FancyIcon from "@/components/atoms/icon/fancy-icon";
import DashboardData from "@/components/organisms/dashboard-card/dashboard-data";
import ExploreDetailFieldset, {
    type DetailFieldsetState,
} from "@/components/molecules/explore-detail-fieldset";
import IconFamiltHome from "@/components/atoms/icon/family-home";

const PREDEFINED_KEYS = [
    "bicis",
    "barbacoa",
    "piscina",
    "sombrillas",
    "caldera",
    "ac",
] as const;

type PredefinedKey = (typeof PREDEFINED_KEYS)[number];

type ExploreDetailsEditorProps = {
    propertyId: string;
    categoryId: string;
    subCategoryId: string;
    initialFieldsets?: DetailFieldsetState[];
};

export default function ExploreDetailsEditor({
    propertyId,
    categoryId,
    subCategoryId,
    initialFieldsets = [],
}: ExploreDetailsEditorProps) {
    const t = useTranslations();
    const router = useRouter();

    const { openLoading, closeLoading } = useLoading();

    const [fieldsets, setFieldsets] =
        useState<DetailFieldsetState[]>(initialFieldsets);
    const [chipsFloating, setChipsFloating] = useState(false);
    const chipsRef = useRef<HTMLDivElement>(null);

    // Justo después del estado de fieldsets:
    const [openLocalId, setOpenLocalId] = useState<string | null>(
        initialFieldsets[0]?.localId ?? null,
    );

    const handleToggle = useCallback((localId: string) => {
        setOpenLocalId((prev) => (prev === localId ? null : localId));
    }, []);

    const [buttonsFloating, setButtonsFloating] = useState(false);
    const buttonsRef = useRef<HTMLDivElement>(null);

    const lastFieldsetRef = useRef<HTMLDivElement>(null);

    const [alert, setAlert] = useState<{
        type: "error" | "success";
        message: string;
    } | null>(null);

    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        setAlert(null);
        openLoading();

        const result = await saveDetails(
            propertyId,
            fieldsets.map((f) => ({
                id: f.dbId,
                name: f.name,
                instructions: f.instructions || null,
                guidelines: f.guidelines || null,
                predefined_key: f.predefinedKey,
                order_index: f.orderIndex,
            })),
        );

        closeLoading();
        setSaving(false);

        if (result.errors) {
            setAlert({
                type: "error",
                message: result.errors.server?.[0] ?? "Error",
            });
            return;
        }

        setAlert({ type: "success", message: result.message! });
        setFieldsets((prev) => prev.map((f) => ({ ...f, isDirty: false })));

        router.push(
            `/app/properties/${propertyId}/${categoryId}/${subCategoryId}`,
        );
    };

    useEffect(() => {
        const el = chipsRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => setChipsFloating(!entry.isIntersecting),
            { threshold: 0 },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const el = buttonsRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => setButtonsFloating(!entry.isIntersecting),
            { threshold: 0 },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const activeKeys = new Set(
        fieldsets
            .map((f) => f.predefinedKey)
            .filter(Boolean) as PredefinedKey[],
    );

    const handleChipToggle = useCallback(
        (key: PredefinedKey) => {
            if (activeKeys.has(key)) {
                setFieldsets((prev) =>
                    prev.filter((f) => f.predefinedKey !== key),
                );
            } else {
                const newFieldset: DetailFieldsetState = {
                    localId: crypto.randomUUID(),
                    dbId: undefined,
                    name: t(`exploreDetails.predefined.${key}.name`),
                    instructions: t(
                        `exploreDetails.predefined.${key}.instructions`,
                    ),
                    guidelines: t(
                        `exploreDetails.predefined.${key}.guidelines`,
                    ),
                    predefinedKey: key,
                    orderIndex: fieldsets.length,
                    isDirty: true,
                };
                setFieldsets((prev) => [...prev, newFieldset]);
                setOpenLocalId(newFieldset.localId);
                setTimeout(() => {
                    lastFieldsetRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }, 100);
            }
        },
        [activeKeys, fieldsets.length, t],
    );

    const handleAddCustom = useCallback(() => {
        const newFieldset: DetailFieldsetState = {
            localId: crypto.randomUUID(),
            dbId: undefined,
            name: "",
            instructions: "",
            guidelines: "",
            predefinedKey: null,
            orderIndex: fieldsets.length,
            isDirty: true,
        };
        setFieldsets((prev) => [...prev, newFieldset]);
        setOpenLocalId(newFieldset.localId);
        setTimeout(() => {
            lastFieldsetRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 100);
    }, [fieldsets.length]);

    const handleChange = useCallback(
        (
            localId: string,
            field: keyof Pick<
                DetailFieldsetState,
                "name" | "instructions" | "guidelines"
            >,
            value: string,
        ) => {
            setFieldsets((prev) =>
                prev.map((f) =>
                    f.localId === localId
                        ? { ...f, [field]: value, isDirty: true }
                        : f,
                ),
            );
        },
        [],
    );

    // En ExploreDetailsEditor, reemplaza handleRemove por esto:
    const handleRemove = useCallback((localId: string, wasOpen: boolean) => {
        setFieldsets((prev) => {
            const next = prev.filter((f) => f.localId !== localId);
            if (wasOpen && next.length > 0) {
                setOpenLocalId(next[0].localId);
            } else if (next.length === 0) {
                setOpenLocalId(null);
            }
            return next;
        });
    }, []);

    const canSave = fieldsets.some((f) => f.name.trim().length > 0);

    const ChipsRow = () => (
        <div className="flex flex-wrap gap-2">
            {PREDEFINED_KEYS.map((key) => (
                <BadgeCheck
                    key={key}
                    label={t(`exploreDetails.predefined.${key}.name`)}
                    checked={activeKeys.has(key)}
                    onToggle={() => handleChipToggle(key)}
                />
            ))}
        </div>
    );

    return (
        <>
            {/* Chips flotantes — aparecen cuando el original sale del viewport */}
            {chipsFloating && (
                <div className="fixed top-22 left-0 md:-left-2 right-2 z-50 flex justify-center pointer-events-none">
                    <div className="bg-white border-b border-gray-100 p-4 max-w-[600px] w-full pointer-events-auto">
                        <Typography weight="medium" size="sm" className="mb-3">
                            {t("Elementos frecuentes")}
                        </Typography>
                        <ChipsRow />
                    </div>
                </div>
            )}

            {buttonsFloating && (
                <div className="fixed -bottom-4 left-0 md:-left-2 right-2 z-50 flex justify-center pointer-events-none pb-4">
                    <div className="bg-white border-t border-gray-100 p-4 max-w-[600px] w-full pointer-events-auto flex flex-col gap-2">
                        <Button
                            label={
                                saving ? t("Guardando") : t("Guardar detalles")
                            }
                            disabled={!canSave || saving}
                            onClick={handleSave}
                        />
                        <Button
                            label={t("Añadir detalle personalizado")}
                            color="secondary"
                            onClick={handleAddCustom}
                        />
                        <Button
                            label={t("Cancelar")}
                            color="secondary"
                            onClick={() => router.back()}
                        />
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl max-w-[600px] w-full shadow-xs relative">
                <div className="rounded-lg flex flex-col gap-2 items-center mb-3 pt-4">
                    <FancyIcon
                        icon={<IconFamiltHome color="white" />}
                        color="gradient"
                    />
                    <Typography component="h2" size="lg">
                        {t("details.title")}
                    </Typography>
                    <Typography
                        component="p"
                        size="sm"
                        className="text-gray-500 text-center px-4"
                    >
                        {t("details.subtitle")}
                    </Typography>
                </div>

                {alert && (
                    <Alert
                        hideTime={3000}
                        open={alert !== null}
                        title={
                            alert.type === "error" ? t("Error") : t("Validado")
                        }
                        dismissible
                        type={alert.type}
                        message={alert.message}
                    />
                )}

                {/* Sección 1 — Chips (original, actúa como sentinel) */}
                <div className="flex flex-col gap-4 p-4 border-b border-gray-200">
                    <DashboardData
                        label={
                            <Typography
                                size="sm"
                                weight="medium"
                                className="flex gap-2 items-center"
                            >
                                <span className="w-9 h-9 flex justify-center items-center rounded-full bg-primary-100 font-bold text-primary-800 text-base">
                                    1
                                </span>
                                {t("Elementos frecuentes")}
                            </Typography>
                        }
                        action={
                            <Typography
                                weight="medium"
                                className="flex gap-2 items-center text-xs!"
                            >
                                {t("Opcional")}
                            </Typography>
                        }
                    />
                    <div ref={chipsRef}>
                        <ChipsRow />
                    </div>
                </div>

                {/* Sección 2 — Fieldsets */}
                <div className="flex flex-col gap-4 p-4 border-b border-gray-200">
                    <DashboardData
                        label={
                            <Typography
                                size="sm"
                                weight="medium"
                                className="flex gap-2 items-center"
                            >
                                <span className="w-9 h-9 flex justify-center items-center rounded-full bg-primary-100 font-bold text-primary-800 text-base">
                                    2
                                </span>
                                {t("Añadir detalle personalizado")}
                            </Typography>
                        }
                        action={
                            <Typography
                                weight="medium"
                                className="flex gap-2 items-center text-xs!"
                            >
                                {t("Opcional")}
                            </Typography>
                        }
                    />
                    <div className="flex flex-col gap-1">
                        {fieldsets.map((fieldset, index) => (
                            <div
                                key={fieldset.localId}
                                ref={
                                    index === fieldsets.length - 1
                                        ? lastFieldsetRef
                                        : null
                                }
                            >
                                <ExploreDetailFieldset
                                    fieldset={fieldset}
                                    isOpen={openLocalId === fieldset.localId}
                                    onToggle={handleToggle}
                                    onChange={handleChange}
                                    onRemove={handleRemove}
                                />
                            </div>
                        ))}
                    </div>
                    <Button
                        label={t("Añadir detalle personalizado")}
                        color="secondary"
                        onClick={handleAddCustom}
                    />
                </div>

                <div ref={buttonsRef} className="flex flex-col gap-2 p-4">
                    <Button
                        label={saving ? t("Guardando") : t("Guardar detalles")}
                        disabled={!canSave || saving}
                        onClick={handleSave}
                    />
                    <Button
                        label={t("Cancelar")}
                        color="secondary"
                        onClick={() => router.back()}
                    />
                </div>
            </div>
        </>
    );
}
