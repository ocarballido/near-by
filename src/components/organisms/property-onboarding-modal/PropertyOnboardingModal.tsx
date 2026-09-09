"use client";

import Modal from "@/components/organisms/modal";
import BadgeCheckCount from "@/components/atoms/badge-check-count";
import Alert from "@/components/molecules/alert";
import Typography from "@/components/atoms/typography";

import {
    AUTO_LOCATIONS_ONBOARDING_OPTIONS as OPTIONS,
    AUTO_LOCATION_COUNT_RANGE,
} from "@/config/config-constants";

import { usePropertyOnboardingFlow } from "@/hooks/usePropertyOnboardingFlow";

import { WowStatsRow } from "./WowStatsRow";
import { WowPreviewList } from "./WowPreviewList";
import ButtonLink from "@/components/molecules/button-link";
import IconOpenInNew from "@/components/atoms/icon/open-in-new";
import { ShareMenu } from "@/components/molecules/button-share";
import ButtonQr from "@/components/molecules/button-qr";

type PreviewLocation = {
    id: string;
    name: string | null;
};

type Props = {
    propertyId: string;
    propertyName: string;
    initialHasLocations: boolean;
    previewLocations: PreviewLocation[];
    totalInfo: number;
};

const PropertyOnboardingModal = ({
    propertyId,
    propertyName,
    initialHasLocations,
    previewLocations,
    totalInfo,
}: Props) => {
    const {
        t,
        user,
        autoContentOpen,
        wowOpen,
        alert,
        selections,
        canGenerate,
        isGenerating,
        toggleOption,
        updateOptionCount,
        handleGenerate,
        dismiss,
        wowVariant,
        totalLocations,
        handleWowClose,
    } = usePropertyOnboardingFlow({ propertyId, initialHasLocations });

    const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL}/public/${propertyId}/welcome/highlights`;

    const shouldRender = autoContentOpen || wowOpen || alert !== null;

    if (!shouldRender) return null;

    return (
        <>
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

            {/* Step 1: auto-content */}
            {autoContentOpen && (
                <Modal
                    title={t("auto-modal-title")}
                    open={autoContentOpen}
                    onClose={() => {
                        if (isGenerating) return;
                        dismiss();
                    }}
                    secondaryButtonLabel={t(
                        "auto-modal-secondary-button-label",
                    )}
                    primaryButtonLabel={
                        isGenerating
                            ? t("auto-modal-primary-button-loading")
                            : t("auto-modal-primary-button-label")
                    }
                    primaryButtonAction={handleGenerate}
                    primaryButtonDisabled={!canGenerate || isGenerating}
                    secondaryButtonAction={() => {
                        if (isGenerating) return;
                        dismiss();
                    }}
                >
                    <div className="w-full text-left">
                        <p className="text-left text-sm font-normal mb-4">
                            {t.rich("auto-modal-description", {
                                bold: (chunks) => (
                                    <span className="font-bold">{chunks}</span>
                                ),
                            })}
                        </p>

                        <p className="mb-1">
                            {t("auto-modal-pick-types-label")}
                        </p>

                        <div className="flex flex-wrap gap-1">
                            {OPTIONS.map((opt) => (
                                <BadgeCheckCount
                                    key={opt.subCategoryId}
                                    label={t(opt.i18nKey)}
                                    checked={opt.subCategoryId in selections}
                                    count={
                                        selections[opt.subCategoryId] ??
                                        opt.defaultCount
                                    }
                                    min={AUTO_LOCATION_COUNT_RANGE.min}
                                    max={AUTO_LOCATION_COUNT_RANGE.max}
                                    onToggle={() =>
                                        toggleOption(
                                            opt.subCategoryId,
                                            opt.defaultCount,
                                        )
                                    }
                                    onCountChange={(count) =>
                                        updateOptionCount(
                                            opt.subCategoryId,
                                            count,
                                        )
                                    }
                                />
                            ))}
                        </div>

                        {!canGenerate && (
                            <p className="text-xs text-error-600 mt-3">
                                {t("auto-modal-select-at-least-one")}
                            </p>
                        )}
                    </div>
                </Modal>
            )}

            {/* Step 2: wow */}
            {wowOpen && (
                <Modal
                    open={wowOpen}
                    onClose={handleWowClose}
                    title={t("wow.title")}
                    primaryButtonLabel={t("wow.cta.closeModal")}
                    primaryButtonAction={handleWowClose}
                >
                    <div className="flex flex-col gap-4 w-full text-left">
                        <div className="flex flex-col items-center justify-center gap-1 py-4 text-center">
                            <span className="text-5xl">
                                {wowVariant === "generated" ? "🎉" : "👍"}
                            </span>
                            <h3 className="text-[1.618rem] font-bold leading-normal font-heading text-gray-800 mb-2">
                                {wowVariant === "generated"
                                    ? t("wow.contentTitle")
                                    : t("wow.skippedTitle")}
                            </h3>
                            <Typography component="p" lineHeight="relaxed">
                                {wowVariant === "generated"
                                    ? t.rich("wow.subtitle", {
                                          name: propertyName,
                                          bold: (chunks) => (
                                              <strong>{chunks}</strong>
                                          ),
                                      })
                                    : t("wow.skippedSubtitle")}
                            </Typography>
                        </div>

                        {wowVariant === "generated" && (
                            <>
                                <WowStatsRow
                                    totalLocations={totalLocations}
                                    totalInfo={totalInfo}
                                />
                                <WowPreviewList
                                    locations={previewLocations}
                                    total={totalLocations}
                                />
                            </>
                        )}

                        <div className="flex flex-col gap-2">
                            <div className="flex gap-1">
                                <ButtonLink
                                    label={t("wow.publicWeb")}
                                    color="primary"
                                    iconLeft={<IconOpenInNew />}
                                    className="w-full"
                                    href={publicUrl}
                                    target="_blank"
                                />
                                <ButtonQr url={publicUrl} />
                            </div>
                            <ShareMenu
                                url={publicUrl}
                                surface="property_card"
                                distinctId={user?.id ?? ""}
                                whatsappText={t("shareWhatsappText", {
                                    name: propertyName,
                                })}
                                showCopyLink
                            />
                        </div>
                        {totalLocations > 0 && (
                            <Typography
                                component="p"
                                size="sm"
                                weight="medium"
                                color="text-info-800/80"
                                className="p-4 bg-info-100 rounded-xl"
                            >
                                {t("wow.ownerAction")}
                            </Typography>
                        )}
                    </div>
                </Modal>
            )}
        </>
    );
};

export default PropertyOnboardingModal;
