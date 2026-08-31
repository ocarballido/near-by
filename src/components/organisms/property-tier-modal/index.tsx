import { useTranslations } from "next-intl";

import { Fragment } from "react";

import Modal from "@/components/organisms/modal";
import { TIER_VISUALS } from "@/components/molecules/property-tier-badge";
import { PROPERTY_TIER_SCORING } from "@/config/config-constants";
import IconCrown from "@/components/atoms/icon/crown";
import IconDiamond from "@/components/atoms/icon/diamond";
import IconCheckCircle from "@/components/atoms/icon/check-circle";

type PropertyTierModalProps = {
    open: boolean;
    onClose: () => void;
};

// Cifras orientativas de Platinum (p50 real, no un gate exacto — el modelo es
// ponderado y compensatorio). Diamond sí lee del techo real usado en el score.
const PLATINUM_ILLUSTRATIVE = { diversity: 6, marks: 2 };

const PropertyTierModal = ({ open, onClose }: PropertyTierModalProps) => {
    const t = useTranslations();
    const { locationDiversityCeiling, marksCeiling } =
        PROPERTY_TIER_SCORING.thresholds;

    type ModalRow =
        | { label: string; kind: "check"; platinum: boolean; diamond: boolean }
        | { label: string; kind: "value"; platinum: string; diamond: string };

    const rows: ModalRow[] = [
        {
            label: t("propertyTierModalRowPhoto"),
            kind: "check",
            platinum: true,
            diamond: true,
        },
        {
            label: t("propertyTierModalRowSchedule"),
            kind: "check",
            platinum: true,
            diamond: true,
        },
        {
            label: t("propertyTierModalRowInfo"),
            kind: "check",
            platinum: true,
            diamond: true,
        },
        {
            label: t("propertyTierModalRowDiversity"),
            kind: "value",
            platinum: `+${PLATINUM_ILLUSTRATIVE.diversity}`,
            diamond: `+${locationDiversityCeiling}`,
        },
        {
            label: t("propertyTierModalRowMarks"),
            kind: "value",
            platinum: `+${PLATINUM_ILLUSTRATIVE.marks}`,
            diamond: `+${marksCeiling}`,
        },
    ];

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={t("propertyTierModalTitle")}
            // description={t("propertyTierModalIntro")}
            primaryButtonLabel={t("propertyTierModalCloseLabel")}
            primaryButtonAction={onClose}
            size="max-w-2xl"
        >
            <div className="flex flex-col gap-2 bg-primary-50 p-4 rounded-xl text-sm text-left">
                <p className="leading-norma font-bold">
                    {t("propertyTierModalIntro")}
                </p>
                <p className="leading-normal font-normal">
                    {t("propertyTierModalDisclaimer")}
                </p>
            </div>
            <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-x-0.5 text-sm my-3">
                <div className="hidden sm:flex" />
                <div
                    className={`flex items-center justify-center gap-1.5 rounded-t-lg px-4 py-3 border-b border-white/20 inset-shadow-[0_30px_40px_rgba(0,0,0,0.25)] ${TIER_VISUALS.platinum.pillClassName} ${TIER_VISUALS.platinum.textClassName}`}
                >
                    <span className="shrink-0 rounded-full p-1.5 bg-white">
                        <IconCrown size={20} className="fill-blue-400" />
                    </span>
                    <span className="font-bold hidden sm:flex">Platinum</span>
                </div>
                <div
                    className={`flex items-center justify-center gap-1.5 rounded-t-lg px-4 py-3 border-b border-white/20 inset-shadow-[0_30px_40px_rgba(0,0,0,0.25)] ${TIER_VISUALS.diamond.pillClassName} ${TIER_VISUALS.diamond.textClassName}`}
                >
                    <span className="shrink-0 rounded-full p-1.5 bg-white">
                        <IconDiamond size={20} className="fill-pink-400" />
                    </span>
                    <span className="font-bold hidden sm:flex">DIAMOND</span>
                </div>

                {rows.map((row, i) => {
                    const isLast = i === rows.length - 1;
                    return (
                        <Fragment key={row.label}>
                            <div className="items-center text-xs font-medium py-3 text-right justify-end mr-1 sm:mr-3 hidden sm:flex">
                                {row.label}
                            </div>
                            <div
                                className={`flex items-center justify-center py-3 px-4 w-fill ${TIER_VISUALS.platinum.pillClassName} ${TIER_VISUALS.platinum.textClassName} ${isLast ? "rounded-b-lg" : ""}`}
                            >
                                <div className="flex flex-col items-center gap-2 justify-start">
                                    <span className="flex sm:hidden">
                                        {row.label}
                                    </span>
                                    {row.kind === "check" ? (
                                        row.platinum && (
                                            <IconCheckCircle
                                                color="white"
                                                size={20}
                                            />
                                        )
                                    ) : (
                                        <p className="text-sm font-bold">
                                            {row.platinum}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div
                                className={`flex items-center justify-center py-3 px-4 w-fill ${TIER_VISUALS.diamond.pillClassName} ${TIER_VISUALS.diamond.textClassName} ${isLast ? "rounded-b-lg" : ""}`}
                            >
                                <div className="flex flex-col items-center gap-2 justify-start">
                                    <span className="flex sm:hidden">
                                        {row.label}
                                    </span>
                                    {row.kind === "check" ? (
                                        row.diamond && (
                                            <IconCheckCircle
                                                color="white"
                                                size={20}
                                            />
                                        )
                                    ) : (
                                        <p className="text-sm font-bold">
                                            {row.diamond}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Fragment>
                    );
                })}
            </div>
        </Modal>
    );
};

export default PropertyTierModal;
