"use client";

import { useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLoading } from "@/lib/context/LoadingContext";

import { saveDetails } from "@/app/actions/properties/save-details";
import { saveDetailImage } from "@/app/actions/properties/save-detail-image";
import { MAX_IMAGE_SIZE, MAX_IMAGE_SIZE_KB } from "@/config/config-constants";

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

    // Justo después del estado de fieldsets:
    const [openLocalId, setOpenLocalId] = useState<string | null>(
        initialFieldsets[0]?.localId ?? null,
    );

    const handleToggle = useCallback((localId: string) => {
        setOpenLocalId((prev) => (prev === localId ? null : localId));
    }, []);

    const lastFieldsetRef = useRef<HTMLDivElement>(null);

    const [alert, setAlert] = useState<{
        type: "error" | "success";
        message: string;
    } | null>(null);

    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        // El aviso de tamaño solo se ve con el fieldset abierto: si está
        // plegado, se abre y se lleva su campo de imagen a la vista en lugar
        // de guardar. 350 ms: tras la animación de apertura (300 ms), para
        // que el scroll no calcule posiciones a medio desplegar
        const tooLarge = fieldsets.find(
            (f) => f.imageFile !== null && f.imageFile.size > MAX_IMAGE_SIZE,
        );
        if (tooLarge) {
            setOpenLocalId(tooLarge.localId);
            setTimeout(() => {
                document
                    .getElementById(`detail-image-${tooLarge.localId}`)
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 350);
            return;
        }

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

        if (result.errors) {
            closeLoading();
            setSaving(false);
            // Los errores de saveDetails son claves de messages/*.json
            setAlert({
                type: "error",
                message: t(result.errors.server?.[0] ?? "detailsSaveError"),
            });
            return;
        }

        // Los detalles nuevos ya tienen id en BD: si una imagen falla y el
        // anfitrión vuelve a guardar, se actualizan en vez de duplicarse
        const detailIds = result.detailIds ?? [];
        const saved = fieldsets.map((f, index) => ({
            ...f,
            dbId: detailIds[index] ?? f.dbId,
            isDirty: false,
        }));

        // Una llamada por imagen: cada petición lleva una sola imagen y no
        // se acerca al límite de tamaño de las Server Actions
        let imageError: string | null = null;
        for (const [index, f] of saved.entries()) {
            if (!f.dbId || (!f.imageFile && !f.removeImage)) continue;

            const fd = new FormData();
            if (f.imageFile) {
                fd.append("image", f.imageFile);
            } else {
                fd.append("image_action", "remove");
            }

            // Un fallo de red lanza en vez de devolver error: sin el catch,
            // el loading quedaría abierto
            const imageResult = await saveDetailImage(f.dbId, fd).catch(
                () => ({ error: "detailImageUploadError", imageUrl: null }),
            );
            if (imageResult.error) {
                imageError = imageResult.error;
                continue;
            }

            saved[index] = {
                ...f,
                imageUrl: imageResult.imageUrl ?? null,
                imageFile: null,
                removeImage: false,
            };
        }

        closeLoading();
        setSaving(false);
        setFieldsets(saved);

        // El texto ya está guardado: se queda en el editor para reintentar
        // solo las imágenes pendientes
        if (imageError) {
            setAlert({
                type: "error",
                message: t(imageError, { kb: MAX_IMAGE_SIZE_KB }),
            });
            return;
        }

        setAlert({
            type: "success",
            message: t(result.message ?? "detailsSaved"),
        });

        router.push(
            `/app/properties/${propertyId}/${categoryId}/${subCategoryId}`,
        );
    };

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
                    imageUrl: null,
                    imageFile: null,
                    removeImage: false,
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
            imageUrl: null,
            imageFile: null,
            removeImage: false,
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

    // Quitar la imagen solo se envía al servidor si había una guardada;
    // una imagen nueva siempre tiene prioridad sobre quitarla
    const handleImageChange = useCallback(
        (localId: string, file: File | null) => {
            setFieldsets((prev) =>
                prev.map((f) =>
                    f.localId === localId
                        ? {
                              ...f,
                              imageFile: file,
                              removeImage: file === null && f.imageUrl !== null,
                              isDirty: true,
                          }
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

    return (
        <>
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

                {/* Sección 1 — Chips. sticky: se queda arriba del área de
                    scroll (el <main> del layout) sin salir de la tarjeta */}
                <div className="sticky top-0 z-10 flex flex-col gap-4 p-4 bg-white border-b border-gray-200">
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
                                    onImageChange={handleImageChange}
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

                {/* sticky: se queda al pie del área de scroll y vuelve a su
                    sitio al llegar al final, como en el formulario de sitios */}
                <div className="sticky bottom-0 z-10 flex flex-col gap-2 p-4 bg-white border-t border-gray-200 last:rounded-b-xl">
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

            {/* Después de la tarjeta: con el mismo z-10 que los chips
                sticky, el orden del DOM decide y así el Alert queda encima */}
            {alert && (
                <Alert
                    hideTime={3000}
                    open={alert !== null}
                    title={alert.type === "error" ? t("Error") : t("Validado")}
                    dismissible
                    type={alert.type}
                    message={alert.message}
                />
            )}
        </>
    );
}
