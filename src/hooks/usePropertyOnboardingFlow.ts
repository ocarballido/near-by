import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { useLoading } from "@/lib/context/LoadingContext";
import { useGlobal } from "@/lib/context/GlobalContext";

import {
    AUTO_LOCATIONS_ONBOARDING_OPTIONS as OPTIONS,
    type AutoLocationSelection,
} from "@/config/config-constants";
import { generateAutoLocations } from "@/app/actions/locations/generate-auto-locations";
import { trackClientEvent } from "@/lib/analytics/trackClient";

type Step = "auto-content" | "wow";
type WowVariant = "generated" | "skipped";

// La presencia de la key ES el "checked"; el valor es la cantidad elegida.
type SubCategorySelections = Record<string, number>;

type AlertState = {
    type: "error" | "success";
    message: string;
} | null;

type UsePropertyOnboardingFlowParams = {
    propertyId: string;
    initialHasLocations: boolean;
};

type Shortfall = { subCategoryId: string; requested: number; found: number };

const buildInitialSelections = (): SubCategorySelections =>
    OPTIONS.reduce<SubCategorySelections>((acc, opt) => {
        if (opt.defaultChecked) {
            acc[opt.subCategoryId] = opt.defaultCount;
        }
        return acc;
    }, {});

export function usePropertyOnboardingFlow({
    propertyId,
    initialHasLocations,
}: UsePropertyOnboardingFlowParams) {
    const t = useTranslations();
    const router = useRouter();
    const { openLoading, closeLoading } = useLoading();
    const { user } = useGlobal();

    const storageKey = `editor:autoPlacesModalDismissed:${propertyId}`;

    const [step, setStep] = useState<Step>("auto-content");
    const [dismissed, setDismissed] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [totalLocations, setTotalLocations] = useState(0);
    const [wowVariant, setWowVariant] = useState<WowVariant>("generated");
    const [alert, setAlert] = useState<AlertState>(null);
    const [shortfalls, setShortfalls] = useState<Shortfall[]>([]);

    useEffect(() => {
        const val = sessionStorage.getItem(storageKey);
        if (val === "1") setDismissed(true);
    }, [storageKey]);

    const autoContentOpen = useMemo(() => {
        return !initialHasLocations && !dismissed && step === "auto-content";
    }, [initialHasLocations, dismissed, step]);

    const wowOpen = step === "wow";

    const [selections, setSelections] = useState<SubCategorySelections>(
        buildInitialSelections,
    );

    const toggleOption = (subCategoryId: string, defaultCount: number) => {
        setSelections((prev) => {
            if (subCategoryId in prev) {
                const next = { ...prev };
                delete next[subCategoryId];
                return next;
            }
            return { ...prev, [subCategoryId]: defaultCount };
        });
    };

    const updateOptionCount = (subCategoryId: string, count: number) => {
        setSelections((prev) =>
            subCategoryId in prev ? { ...prev, [subCategoryId]: count } : prev,
        );
    };

    const canGenerate = Object.keys(selections).length > 0;

    const dismiss = () => {
        setDismissed(true);
        sessionStorage.setItem(storageKey, "1");
        setTotalLocations(0);
        setWowVariant("skipped");
        setStep("wow");
    };

    const handleWowClose = () => {
        setStep("auto-content");

        if (user?.id) {
            trackClientEvent({
                event: "wow_modal_dismissed",
                distinctId: user.id,
                props: { property_id: propertyId },
            });
        }
    };

    const handleGenerate = async () => {
        if (!canGenerate || isGenerating) return;

        setIsGenerating(true);
        setAlert(null);
        openLoading();

        try {
            const payload: AutoLocationSelection[] = Object.entries(
                selections,
            ).map(([subCategoryId, count]) => ({ subCategoryId, count }));

            const res = await generateAutoLocations(propertyId, payload);

            if (res.errors?.server?.[0]) {
                setAlert({ type: "error", message: res.errors.server[0] });
                return;
            }

            setAlert({
                type: "success",
                message: t("auto-modal-success-message"),
            });

            setTotalLocations(res.inserted ?? 0);
            setShortfalls(res.shortfalls ?? []);
            setWowVariant("generated");
            setTotalLocations(res.inserted ?? 0);
            setWowVariant("generated");

            sessionStorage.removeItem(storageKey);
            setDismissed(true);
            setStep("wow");

            router.refresh();
        } catch (err) {
            console.error("Error inesperado en handleGenerate:", err);
            setAlert({
                type: "error",
                message: t("auto-modal-unexpected-error"),
            });
        } finally {
            closeLoading();
            setIsGenerating(false);
        }
    };

    return {
        t,
        user,
        // visibilidad de cada modal
        autoContentOpen,
        wowOpen,
        alert,
        // step 1: selección
        selections,
        canGenerate,
        isGenerating,
        toggleOption,
        updateOptionCount,
        handleGenerate,
        dismiss,
        // step 2: wow
        wowVariant,
        totalLocations,
        handleWowClose,
        shortfalls,
    };
}
