"use client";

import { useForm, Controller, SubmitHandler, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useLoading } from "@/lib/context/LoadingContext";
import Alert from "@/components/molecules/alert";
import { Select, SelectOption } from "@/components/molecules/select";
import Button from "@/components/molecules/button";
import Typography from "@/components/atoms/typography";
import FancyIcon from "@/components/atoms/icon/fancy-icon";
import IconMap from "@/components/atoms/icon/map";
import ItineraryTimeline from "@/components/organisms/itinerary-timeline";
import { useItineraryGeneration } from "@/hooks/use-itinerary-generation";
import { trackClientEvent } from "@/lib/analytics/trackClient";

type FormValues = {
    preferences: string;
    duration: string;
    transport: string;
};

const preferencesOptions: SelectOption[] = [
    { value: "culture", label: "Cultura" },
    { value: "food", label: "Gastronomía" },
    { value: "nature", label: "Naturaleza" },
    { value: "shopping", label: "Compras" },
    { value: "tours", label: "Tours" },
];

const durationOptions: SelectOption[] = [
    { value: "half_day", label: "Medio día" },
    { value: "full_day", label: "Día completo" },
    { value: "weekend", label: "Fin de semana" },
];

const transportOptions: SelectOption[] = [
    { value: "walk", label: "A pie" },
    { value: "bike", label: "Bicicleta" },
    { value: "car", label: "Coche" },
    { value: "public", label: "Transporte público" },
];

const ItineraryForm = ({
    lat,
    lng,
    locale = "es",
    anonId,
}: {
    lat: number;
    lng: number;
    locale?: string;
    anonId: string;
}) => {
    const t = useTranslations();
    const { openLoading, closeLoading } = useLoading();
    const { status, itinerary, error, generateItinerary } =
        useItineraryGeneration();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            preferences: "",
            duration: "",
            transport: "",
        },
    });

    const selectedTransport = useWatch({ control, name: "transport" });

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        trackClientEvent({
            event: "itinerary_generate_clicked",
            distinctId: anonId,
            props: {
                preferences: data.preferences,
                duration: data.duration,
                transport: data.transport,
            },
        });

        openLoading();

        await generateItinerary({
            lat,
            lng,
            preferences: data.preferences,
            duration: data.duration,
            transport: data.transport,
            locale,
        });

        closeLoading();
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-white p-2 rounded-xl max-w-[500px] w-full shadow-xs flex flex-col gap-4 mx-auto">
                <div className="rounded-lg p-2 pt-0 flex flex-col gap-2 items-center">
                    <FancyIcon
                        icon={<IconMap color="white" />}
                        color="gradient"
                    />
                    <Typography component="h2" size="lg">
                        {t("Crea tu día ideal")}
                    </Typography>

                    <div className="p-4 bg-sky-100 rounded-md">
                        <Typography
                            component="p"
                            size="sm"
                            color="text-sky-900"
                        >
                            {t(
                                "El contenido que se generará a continuación ha sido creado automáticamente mediante inteligencia artificial",
                            )}
                        </Typography>
                    </div>
                </div>

                {error && (
                    <Alert
                        type="error"
                        title={t("Error")}
                        message={error}
                        open={!!error}
                        hideTime={3000}
                    />
                )}

                {status === "success" && (
                    <Alert
                        type="success"
                        title={t("Éxito")}
                        message={t("Itinerario generado con éxito")}
                        open={status === "success"}
                        hideTime={3000}
                    />
                )}

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-6 p-2"
                >
                    <Controller
                        name="preferences"
                        control={control}
                        rules={{
                            required: t("Selecciona al menos una preferencia"),
                        }}
                        render={({ field }) => (
                            <Select
                                label={t("Qué te gusta hacer")}
                                options={preferencesOptions.map((o) => ({
                                    ...o,
                                    label: t(o.label),
                                }))}
                                className="w-full"
                                value={field.value}
                                onChange={field.onChange}
                                name="preferences"
                                error={!!errors.preferences}
                                helperText={errors.preferences?.message}
                                placeholder={t("Selecciona una preferencia")}
                            />
                        )}
                    />

                    <Controller
                        name="duration"
                        control={control}
                        rules={{
                            required: t(
                                "Selecciona cuánto tiempo tienes disponible",
                            ),
                        }}
                        render={({ field }) => (
                            <Select
                                label={t("Tiempo disponible")}
                                options={durationOptions.map((o) => ({
                                    ...o,
                                    label: t(o.label),
                                }))}
                                className="w-full"
                                value={field.value}
                                onChange={field.onChange}
                                name="duration"
                                error={!!errors.duration}
                                helperText={errors.duration?.message}
                                placeholder={t("Selecciona duración")}
                            />
                        )}
                    />

                    <Controller
                        name="transport"
                        control={control}
                        rules={{
                            required: t("Selecciona un modo de transporte"),
                        }}
                        render={({ field }) => (
                            <Select
                                label={t("Cómo prefieres moverte")}
                                options={transportOptions.map((o) => ({
                                    ...o,
                                    label: t(o.label),
                                }))}
                                className="w-full"
                                value={field.value}
                                onChange={field.onChange}
                                name="transport"
                                error={!!errors.transport}
                                helperText={errors.transport?.message}
                                placeholder={t("Selecciona transporte")}
                            />
                        )}
                    />

                    <Button
                        type="submit"
                        label={t("Generar itinerario")}
                        disabled={status === "loading"}
                        className="w-full"
                    />
                </form>
            </div>

            {itinerary && (
                <div className="flex flex-col gap-4 max-w-[500px] w-full mx-auto">
                    <Typography component="h2" size="lg" className="font-bold">
                        {t("Tu plan personalizado")}
                    </Typography>
                    <ItineraryTimeline
                        itinerary={itinerary}
                        transport={selectedTransport}
                    />
                </div>
            )}
        </div>
    );
};

export default ItineraryForm;
