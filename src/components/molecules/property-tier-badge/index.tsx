import clsx from "clsx";
import type { ComponentType } from "react";
import { useTranslations } from "next-intl";

import IconStar from "@/components/atoms/icon/star";
import IconCrown from "@/components/atoms/icon/crown";
import IconDiamond from "@/components/atoms/icon/diamond";
import IconChevronForward from "@/components/atoms/icon/chevron-forward";

import {
    PROPERTY_TIER_SCORING,
    type PropertyTier,
} from "@/config/config-constants";
import { getNextTier } from "@/utils/property-tier";

type PropertyTierBadgeProps = {
    tier: PropertyTier;
    onOpenModal?: () => void;
};

type TierIcon = ComponentType<{ size?: number; className?: string }>;

// Colores de partida, pendientes de que decidas los finales — todo vive aquí,
// cambiar el aspecto de un tier es tocar una sola línea de este objeto.
export const TIER_VISUALS: Record<
    PropertyTier,
    {
        Icon: TierIcon;
        pillClassName: string;
        textClassName: string;
        iconClassName: string;
    }
> = {
    gold: {
        Icon: IconStar,
        // pillClassName: "bg-orange-400",
        pillClassName: "bg-gradient-to-r from-yellow-400 to-orange-400",
        textClassName: "text-white",
        iconClassName: "fill-yellow-400",
    },
    platinum: {
        Icon: IconCrown,
        // pillClassName: "bg-blue-400",
        pillClassName: "bg-gradient-to-r from-blue-400 to-teal-600",
        textClassName: "text-white",
        iconClassName: "fill-blue-400",
    },
    diamond: {
        Icon: IconDiamond,
        // pillClassName: "bg-pink-400",
        pillClassName: "bg-gradient-to-r from-pink-400 to-orange-500",
        textClassName: "text-white",
        iconClassName: "fill-pink-400",
    },
};

const LOCKED_ICON_CLASS = "fill-white";

const PropertyTierBadge = ({ tier, onOpenModal }: PropertyTierBadgeProps) => {
    const t = useTranslations();

    const { order } = PROPERTY_TIER_SCORING;
    const visuals = TIER_VISUALS[tier];
    const nextTier = getNextTier(tier);
    const remainingTiers = order.slice(order.indexOf(tier) + 1);

    const pillContent = (
        <div className="flex gap-2 items-center justify-center w-fit">
            <span className="inline-flex items-center justify-center rounded-full p-2 shrink-0 bg-white">
                <visuals.Icon className={visuals.iconClassName} size={20} />
            </span>
            <span className="flex flex-col leading-tight text-left gap-0">
                <p
                    className={`text-nowrap text-[12px] font-bold ${visuals.textClassName}`}
                >
                    {t("propertyTierBadgeLabel", { tier: tier.toUpperCase() })}
                </p>
                <p
                    className={`text-nowrap text-[12px] font-bold ${visuals.textClassName}`}
                >
                    {nextTier
                        ? t("propertyTierBadgeCta", {
                              tier: nextTier.toUpperCase(),
                          })
                        : t("propertyTierBadgeBestScore")}
                </p>
            </span>
            {nextTier && (
                <IconChevronForward className="fill-white -mr-2" size={20} />
            )}
        </div>
    );

    const pillClassName = clsx(
        "flex items-center rounded-full pl-0.5 pr-4 py-0.5 shadow-xs",
        visuals.pillClassName,
    );

    return (
        <button
            onClick={onOpenModal}
            type="button"
            className="absolute top-1.5 left-[50%] -translate-x-[50%] z-5 flex items-center gap-0.5 bg-white rounded-full p-0.5 hover:cursor-pointer"
        >
            {nextTier ? (
                <span className={pillClassName}>{pillContent}</span>
            ) : (
                <div className={pillClassName}>{pillContent}</div>
            )}

            {remainingTiers.map((remainingTier) => {
                const RemainingIcon = TIER_VISUALS[remainingTier].Icon;
                return (
                    <span
                        key={remainingTier}
                        aria-hidden="true"
                        className="inline-flex items-center justify-center rounded-full p-2 shrink-0 bg-gray-200"
                    >
                        <RemainingIcon
                            className={LOCKED_ICON_CLASS}
                            size={20}
                        />
                    </span>
                );
            })}
        </button>
    );
};

export default PropertyTierBadge;
