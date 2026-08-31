import {
    PROPERTY_TIER_SCORING,
    type PropertyTier,
} from "@/config/config-constants";

export type PropertyDataRow = {
    type: string | null;
    sub_category_id: string | null;
    featured: boolean;
    must_visit: boolean;
};

export type PropertyEnrichmentMetrics = {
    hasCustomImage: boolean;
    hasCheckInOut: boolean;
    infoSubcatsUsed: number;
    locationSubcatsUsed: number;
    markedCount: number;
};

// "Configurado" admite fecha U hora en cada lado, pero exige algo en entrada y algo en salida.
export function hasConfiguredCheckInOut(fields: {
    checkInDate?: string | null;
    checkInTime?: string | null;
    checkOutDate?: string | null;
    checkOutTime?: string | null;
}): boolean {
    const hasCheckIn =
        Boolean(fields.checkInDate) || Boolean(fields.checkInTime);
    const hasCheckOut =
        Boolean(fields.checkOutDate) || Boolean(fields.checkOutTime);
    return hasCheckIn && hasCheckOut;
}

// Agrega las filas crudas de property_data en las métricas que necesita el scoring.
// Cuenta sub-categorías DISTINTAS (no filas) para info/location, y filas marcadas para featured/must_visit.
export function deriveEnrichmentMetrics(
    propertyDataRows: PropertyDataRow[],
    flags: { hasCustomImage: boolean; hasCheckInOut: boolean },
): PropertyEnrichmentMetrics {
    const infoSubcats = new Set<string>();
    const locationSubcats = new Set<string>();
    let markedCount = 0;

    for (const row of propertyDataRows) {
        if (row.sub_category_id) {
            if (row.type === "info") infoSubcats.add(row.sub_category_id);
            if (row.type === "location")
                locationSubcats.add(row.sub_category_id);
        }
        if (row.featured || row.must_visit) markedCount += 1;
    }

    return {
        hasCustomImage: flags.hasCustomImage,
        hasCheckInOut: flags.hasCheckInOut,
        infoSubcatsUsed: infoSubcats.size,
        locationSubcatsUsed: locationSubcats.size,
        markedCount,
    };
}

export function calculatePropertyScore(
    metrics: PropertyEnrichmentMetrics,
): number {
    const { weights, thresholds } = PROPERTY_TIER_SCORING;

    const cappedRatio = (used: number, weight: number, ceiling: number) =>
        Math.min(weight, (weight * used) / ceiling);

    return (
        (metrics.hasCustomImage ? weights.customImage : 0) +
        (metrics.hasCheckInOut ? weights.checkInOut : 0) +
        cappedRatio(
            metrics.infoSubcatsUsed,
            weights.infoComplete,
            thresholds.infoSubcatsTotal,
        ) +
        cappedRatio(
            metrics.locationSubcatsUsed,
            weights.locationDiversity,
            thresholds.locationDiversityCeiling,
        ) +
        cappedRatio(metrics.markedCount, weights.marks, thresholds.marksCeiling)
    );
}

export function getPropertyTier(score: number): PropertyTier {
    const { cutoffs } = PROPERTY_TIER_SCORING;
    if (score >= cutoffs.diamond) return "diamond";
    if (score >= cutoffs.platinum) return "platinum";
    return "gold";
}

export function getNextTier(tier: PropertyTier): PropertyTier | null {
    const { order } = PROPERTY_TIER_SCORING;
    const index = order.indexOf(tier);
    return index >= 0 && index < order.length - 1 ? order[index + 1] : null;
}
