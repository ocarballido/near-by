// AddPropertyForm.tsx
"use client";
/// <reference types="google.maps" />

import { useTranslations, useLocale } from "next-intl";
import { useForm, SubmitHandler } from "react-hook-form";
import { usePaywall } from "@/lib/context/PaywallContext";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useMemo } from "react";
import { useLoading } from "@/lib/context/LoadingContext";
import { useGlobal } from "@/lib/context/GlobalContext";

import { createProperty } from "@/app/actions/properties/add-property";
import { updateProperty } from "@/app/actions/properties/update-property";

import {
    MAX_IMAGE_SIZE,
    CATEGORIES_SUB_CATEGORIES,
    TIPS,
} from "@/config/config-constants";

import TextField from "@/components/molecules/text-field";
import Alert from "@/components/molecules/alert";
import SeedOptions from "./seed-options";
import PropertyFormHeader from "./form-header";
import ImageSection from "./image-section";
import FormActions from "./form-actions";
import AddressSection from "./address-section";
import { SelectedPlace } from "@/components/molecules/place-autocomplete";

import { trackClientEvent } from "@/lib/analytics/trackClient";
import { getPropertyFormDefaultValues } from "./getPropertyFormDefaultValues";
import { buildPropertyFormData } from "./buildPropertyFormData";
import Button from "@/components/molecules/button";
import TextArea from "@/components/molecules/text-area";
import Typography from "@/components/atoms/typography";
import DashboardData from "../../dashboard-card/dashboard-data";
import AddressChangeWarningModal from "./address-change-warning-modal";

type FormValues = {
    name: string;
    address: string;
    latitude: string;
    longitude: string;
    image?: FileList;
    checkInDate: string;
    checkInTime: string;
    checkOutDate: string;
    checkOutTime: string;
    accessInstructions: string;
};

export type EditInitialValues = {
    name: string;
    address: string;
    latitude: number | null;
    longitude: number | null;
    image_url: string | null;
    check_in_date: string | null;
    check_in_time: string | null;
    check_out_date: string | null;
    check_out_time: string | null;
    access_instructions: string | null;
};

export type DateTimeMode = "isDateAndTime" | "isOnlyTime";

// ✅ NEW: props simples (sin union complicada)
type Props = {
    // si vienen ambos => modo edición
    propertyId?: string;
    initialValues?: EditInitialValues;
    redirectAfter?: string;
    hasLocations?: boolean;
    // Destino explícito para "Cancelar" cuando no existe un "atrás" fiable
    // en el historial del navegador (p. ej. llegada vía redirects de
    // servidor desde el login/registro). Si no se pasa, se mantiene el
    // comportamiento actual de router.back().
    cancelHref?: string;
};

const DEFAULT_SEED_INFO_IDS = [
    CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.MANUAL.id,
    CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.RULES.id,
    CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.SCHEDULE.id,
    CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.RECYCLE.id,
    CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.WIFI.id,
] as const;

const AddPropertyForm = ({
    propertyId,
    initialValues,
    redirectAfter,
    hasLocations,
    cancelHref,
}: Props) => {
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();

    const { incrementPropertyCount } = usePaywall();

    const { user } = useGlobal();
    const distinctId = user?.id;

    const isEdit = Boolean(propertyId && initialValues);

    const [isAddressSelected, setIsAddressSelected] = useState<boolean>(isEdit);
    const [locationsAction, setLocationsAction] = useState<
        "delete" | "keep" | null
    >(null);
    const [addressWarningOpen, setAddressWarningOpen] = useState(false);

    const originalLat = initialValues?.latitude ?? null;
    const originalLng = initialValues?.longitude ?? null;

    const isFirstCoordsSyncRef = useRef(true);

    const didCompleteRef = useRef(false);

    const formOpenedAtRef = useRef<number>(Date.now());

    const INFO_SEED_OPTIONS = useMemo(
        () =>
            [
                {
                    id: CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.MANUAL
                        .id,
                    labelKey: t(
                        CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.MANUAL
                            .name,
                    ),
                    tKey: "manual",
                },
                {
                    id: CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.RULES
                        .id,
                    labelKey: t(
                        CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.RULES
                            .name,
                    ),
                    tKey: "rules",
                },
                {
                    id: CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES
                        .SCHEDULE.id,
                    labelKey: t(
                        CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES
                            .SCHEDULE.name,
                    ),
                    tKey: "schedule",
                },
                {
                    id: CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.RECYCLE
                        .id,
                    labelKey: t(
                        CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.RECYCLE
                            .name,
                    ),
                    tKey: "recycling",
                },
                {
                    id: CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.WIFI
                        .id,
                    labelKey: t(
                        CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.WIFI
                            .name,
                    ),
                    tKey: "wifi",
                },
            ] as const,
        [t],
    );

    const seedOptions = useMemo(
        () =>
            INFO_SEED_OPTIONS.map((opt) => ({
                id: opt.id,
                label: opt.labelKey,
            })),
        [INFO_SEED_OPTIONS],
    );

    const [alert, setAlert] = useState<{
        type: "error" | "success";
        message: string;
    } | null>(null);

    const [dateTimeMode, setDateTimeMode] = useState<DateTimeMode>(
        initialValues?.check_in_date && initialValues?.check_in_time
            ? "isDateAndTime"
            : "isOnlyTime",
    );

    const [selectedSeedInfoIds, setSelectedSeedInfoIds] = useState<string[]>(
        () => [...DEFAULT_SEED_INFO_IDS],
    );

    const [isOpen, setIsOpen] = useState(false);

    const toggleSeed = (id: string) => {
        setSelectedSeedInfoIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
    };

    const { openLoading, closeLoading } = useLoading();

    const defaultValues = useMemo(
        () => getPropertyFormDefaultValues(isEdit, initialValues),
        [isEdit, initialValues],
    );

    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        setError,
        clearErrors,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        defaultValues,
        shouldUnregister: false,
    });

    const [coords, setCoords] = useState<SelectedPlace | null>(() => {
        if (!isEdit) return null;
        if (originalLat == null || originalLng == null) return null;
        return {
            formattedAddress: initialValues?.address ?? "",
            lat: originalLat,
            lng: originalLng,
        };
    });

    const handleSelectAddress = (p: SelectedPlace) => {
        setCoords(p);
        setIsAddressSelected(true);

        setValue("address", p.formattedAddress, {
            shouldDirty: true,
            shouldValidate: true,
        });

        clearErrors("address");

        if (distinctId) {
            trackClientEvent({
                event: "create_property_address_selected",
                distinctId,
            });
        }

        setLocationsAction(null);

        if (
            isEdit &&
            hasLocations &&
            (p.lat !== originalLat || p.lng !== originalLng)
        ) {
            setAddressWarningOpen(true);
        }
    };

    const clearSelection = () => {
        setCoords(null);
        setIsAddressSelected(false);
        setValue("address", "", { shouldDirty: true, shouldValidate: true });
        setValue("latitude", "", { shouldDirty: true });
        setValue("longitude", "", { shouldDirty: true });
        setLocationsAction(null);
    };

    const handleLocationsWarningKeep = () => {
        setLocationsAction("keep");
        setAddressWarningOpen(false);
    };

    const handleLocationsWarningDelete = () => {
        setLocationsAction("delete");
        setAddressWarningOpen(false);
    };

    const handleLocationsWarningClose = () => {
        setAddressWarningOpen(false);
    };

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        if (!isEdit && distinctId) {
            trackClientEvent({
                event: "create_property_submit_clicked",
                distinctId,
                props: {
                    has_name: Boolean(data.name?.trim()),
                    has_selected_address: Boolean(coords),
                },
            });
        }

        if (!isEdit && !coords) {
            if (distinctId) {
                trackClientEvent({
                    event: "create_property_blocked_no_address_selection",
                    distinctId,
                    props: {
                        has_name: Boolean(data.name?.trim()),
                    },
                });
            }

            setError("address", {
                type: "manual",
                message: t("Selecciona una dirección sugerida para continuar"),
            });
            return;
        }

        if (isEdit && !coords) {
            setError("address", {
                type: "manual",
                message: t("La dirección es obligatoria"),
            });
            return;
        }

        if (isEdit && hasLocations && coords) {
            const addressChanged =
                coords.lat !== originalLat || coords.lng !== originalLng;

            if (addressChanged && locationsAction === null) {
                setAddressWarningOpen(true);
                return;
            }
        }

        const file = data.image?.[0];
        if (file && file.size > MAX_IMAGE_SIZE) {
            setAlert({
                type: "error",
                message: t(
                    "La imagen no debe superar {kb} KB (tienes {got} KB)",
                    {
                        kb: (MAX_IMAGE_SIZE / 1024).toFixed(0),
                        got: (file.size / 1024).toFixed(0),
                    },
                ),
            });
            return;
        }

        const fd = buildPropertyFormData({
            isEdit,
            locale,
            selectedSeedInfoIds,
            dateTimeMode,
            locationsAction,
            data,
        });

        openLoading();

        const result = isEdit
            ? await updateProperty(propertyId as string, fd, redirectAfter)
            : await createProperty(fd);

        if (result.errors) {
            if (distinctId) {
                const errorFields = Object.keys(result.errors);
                trackClientEvent({
                    event: "create_property_failed",
                    distinctId,
                    props: {
                        error_fields: errorFields,
                    },
                });
            }

            closeLoading();

            if (result.errors.name)
                setError("name", {
                    type: "manual",
                    message: result.errors.name[0],
                });
            if (result.errors.address)
                setError("address", {
                    type: "manual",
                    message: result.errors.address[0],
                });
            if (result.errors.image)
                setAlert({ type: "error", message: result.errors.image[0] });
            if (result.errors.server)
                setAlert({
                    type: "error",
                    message: result.errors.server.join(", "),
                });
            return;
        }

        didCompleteRef.current = true;

        closeLoading();

        if (!isEdit) incrementPropertyCount();

        setAlert({
            type: "success",
            message: "Propiedad creada correctamente",
        });

        if (result.redirectTo) {
            router.push(result.redirectTo);
        }

        if (!isEdit) {
            reset();
            setCoords(null);
        }
    };

    useEffect(() => {
        if (isFirstCoordsSyncRef.current) {
            isFirstCoordsSyncRef.current = false;
            return;
        }
        if (coords) {
            setValue("latitude", String(coords.lat), { shouldDirty: true });
            setValue("longitude", String(coords.lng), { shouldDirty: true });
        }
    }, [coords, setValue]);

    useEffect(() => {
        if (isEdit) return;

        const openedAt = formOpenedAtRef.current;

        return () => {
            if (didCompleteRef.current) return;
            if (!distinctId) return;

            const timeOnFormMs = Date.now() - openedAt;
            const hasName = Boolean(getValues("name")?.trim());
            const hasSelectedAddress = Boolean(coords);

            trackClientEvent({
                event: "create_property_abandoned",
                distinctId,
                props: {
                    time_on_form_ms: timeOnFormMs,
                    has_name: hasName,
                    has_selected_address: hasSelectedAddress,
                },
            });
        };
    }, [distinctId, getValues, coords, isEdit]);

    return (
        <div className="w-full max-w-[460px] shadow-xs rounded-xl bg-white">
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

            <PropertyFormHeader
                isEdit={isEdit}
                title={
                    isEdit
                        ? t("propertyForm.formEditTitle")
                        : t("Nuevo Alojamiento")
                }
                modalTitle={t("createPropertyTipsModal.title")}
                primaryButtonLabel={t("Cancelar")}
                isOpen={isOpen}
                onOpen={() => setIsOpen(true)}
                onClose={() => setIsOpen(false)}
                tips={TIPS}
                t={t}
            />

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-0 w-full"
            >
                <div className="flex flex-col gap-4 p-4 pt-0 border-b border-gray-200">
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
                                {t("escencial")}
                            </Typography>
                        }
                        action={
                            <Typography
                                weight="medium"
                                className="flex gap-2 items-center text-xs!"
                            >
                                {t("Requerido")}
                            </Typography>
                        }
                    />

                    {!isEdit && (
                        <SeedOptions
                            title={t("Contenido generado automáticamente")}
                            options={seedOptions}
                            selectedIds={selectedSeedInfoIds}
                            onToggle={toggleSeed}
                        />
                    )}

                    <TextField
                        label={t("Nombre de la propiedad *")}
                        placeholder={t("Nombre ejemplo")}
                        id="name"
                        {...register("name", {
                            required: t("El nombre es obligatorio"),
                        })}
                        error={Boolean(errors.name)}
                        helperText={errors.name?.message}
                    />

                    <AddressSection
                        t={t}
                        locale={locale}
                        error={Boolean(errors.address)}
                        helperTextIdle={t("addressHelperIdle")}
                        helperTextError={t("addressHelperError")}
                        onSelect={handleSelectAddress}
                        onClearSelection={clearSelection}
                        isSelected={isAddressSelected}
                        selectedValue={getValues("address")}
                        addressRegisterProps={register("address", {
                            required: t("La dirección es obligatoria"),
                        })}
                        latRegisterProps={register("latitude")}
                        lngRegisterProps={register("longitude")}
                    />
                </div>

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
                                {t("access")}
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
                    <div className="flex gap-1 p-1 rounded-full bg-gray-200 -mb-1">
                        <Button
                            label={t("propertyForm.dateAndTime")}
                            className="w-full"
                            color={
                                dateTimeMode === "isDateAndTime"
                                    ? "white"
                                    : "secondary"
                            }
                            onClick={() => {
                                if (dateTimeMode === "isDateAndTime") return;
                                setDateTimeMode("isDateAndTime");
                            }}
                        />
                        <Button
                            label={t("propertyForm.onlyTime")}
                            className="w-full"
                            color={
                                dateTimeMode === "isOnlyTime"
                                    ? "white"
                                    : "secondary"
                            }
                            onClick={() => {
                                if (dateTimeMode === "isOnlyTime") return;
                                setDateTimeMode("isOnlyTime");
                                clearErrors(["checkInDate", "checkOutDate"]);
                            }}
                        />
                    </div>

                    {dateTimeMode === "isDateAndTime" ? (
                        <fieldset className="flex gap-2 flex-col">
                            <div className="flex gap-2 flex-col sm:flex-row">
                                <div className="w-full">
                                    <TextField
                                        label={`${t("propertyForm.checkIn")}/${t("propertyForm.date")}`}
                                        id="checkInDate"
                                        type="date"
                                        {...register("checkInDate")}
                                        error={Boolean(errors.checkInDate)}
                                        helperText={
                                            errors.checkInDate
                                                ?.message as string
                                        }
                                    />
                                </div>

                                <div className="w-full">
                                    <TextField
                                        label={`${t("propertyForm.checkIn")}/${t("propertyForm.time")}`}
                                        id="checkInTime"
                                        type="time"
                                        step={60}
                                        {...register("checkInTime")}
                                        error={Boolean(errors.checkInTime)}
                                        helperText={
                                            errors.checkInTime
                                                ?.message as string
                                        }
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 flex-col sm:flex-row">
                                <div className="w-full">
                                    <TextField
                                        label={`${t("propertyForm.checkOut")}/${t("propertyForm.date")}`}
                                        id="checkOutDate"
                                        type="date"
                                        {...register("checkOutDate")}
                                        error={Boolean(errors.checkOutDate)}
                                        helperText={
                                            errors.checkOutDate
                                                ?.message as string
                                        }
                                    />
                                </div>

                                <div className="w-full">
                                    <TextField
                                        label={`${t("propertyForm.checkOut")}/${t("propertyForm.time")}`}
                                        id="checkOutTime"
                                        type="time"
                                        step={60}
                                        {...register("checkOutTime")}
                                        error={Boolean(errors.checkOutTime)}
                                        helperText={
                                            errors.checkOutTime
                                                ?.message as string
                                        }
                                    />
                                </div>
                            </div>
                        </fieldset>
                    ) : (
                        <fieldset className="flex gap-2 flex-col sm:flex-row">
                            <div className="w-full">
                                <TextField
                                    label={`${t("propertyForm.checkIn")}/${t("propertyForm.time")}`}
                                    id="checkInTime"
                                    type="time"
                                    step={60}
                                    {...register("checkInTime")}
                                    error={Boolean(errors.checkInTime)}
                                    helperText={
                                        errors.checkInTime?.message as string
                                    }
                                />
                            </div>

                            <div className="w-full">
                                <TextField
                                    label={`${t("propertyForm.checkOut")}/${t("propertyForm.time")}`}
                                    id="checkOutTime"
                                    type="time"
                                    step={60}
                                    {...register("checkOutTime")}
                                    error={Boolean(errors.checkOutTime)}
                                    helperText={
                                        errors.checkOutTime?.message as string
                                    }
                                />
                            </div>
                        </fieldset>
                    )}

                    <fieldset className="flex flex-col gap-1">
                        <TextArea
                            id="accessInstructions"
                            label={t("propertyForm.accessInstructions")}
                            placeholder={t(
                                "propertyForm.accessInstructionsPlaceholder",
                            )}
                            rows={4}
                            {...register("accessInstructions")}
                        />
                    </fieldset>
                </div>

                <div className="flex flex-col gap-4 px-4 py-4 border-b border-gray-100">
                    <DashboardData
                        label={
                            <Typography
                                size="sm"
                                weight="medium"
                                className="flex gap-2 items-center"
                            >
                                <span className="w-9 h-9 flex justify-center items-center rounded-full bg-primary-100 font-bold text-primary-800 text-base">
                                    3
                                </span>
                                {t("image")}
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

                    <ImageSection
                        t={t}
                        isEdit={isEdit}
                        imageUrl={initialValues?.image_url ?? null}
                        label={t("Imagen")}
                        error={errors.image}
                        registerProps={register("image", {
                            validate: (files) => {
                                const file = files?.[0];
                                if (!file) return true;
                                if (file.size <= MAX_IMAGE_SIZE) return true;
                                return `La imagen no debe superar ${(
                                    MAX_IMAGE_SIZE / 1024
                                ).toFixed(
                                    0,
                                )} KB (tienes ${(file.size / 1024).toFixed(0)} KB)`;
                            },
                        })}
                    />
                    <FormActions
                        isEdit={isEdit}
                        isSubmitting={isSubmitting}
                        onCancel={() =>
                            cancelHref ? router.push(cancelHref) : router.back()
                        }
                        submitLabel={
                            isEdit
                                ? t("Guardar cambios")
                                : t("Añadir propiedad")
                        }
                        cancelLabel={t("Cancelar")}
                        showFeedback={!isEdit}
                        feedbackLabel={t("feedback.cta")}
                        feedbackHref="/app/feedback/create_property?returnTo=/app/properties/new"
                        className="mt-4"
                    />
                </div>
            </form>

            <AddressChangeWarningModal
                t={t}
                open={addressWarningOpen}
                onClose={handleLocationsWarningClose}
                onKeep={handleLocationsWarningKeep}
                onDelete={handleLocationsWarningDelete}
            />
        </div>
    );
};

export default AddPropertyForm;
