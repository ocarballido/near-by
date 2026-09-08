import { z } from "zod";
import { CATEGORIES_SUB_CATEGORIES } from "@/config/config-constants";
import type {
    CategoryCandidate,
    PropertyDetailCandidate,
} from "./availableCategories";
import type { ResponseKind } from "@/lib/chatbot/build-response";

export const SCHEDULE_SUB_CATEGORY_ID =
    CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.SCHEDULE.id;

export const FEATURED_VALUE = "FEATURED";
export const MUST_VISIT_VALUE = "MUST_VISIT";
export const OFF_TOPIC_VALUE = "OFF_TOPIC";

export interface AvailableCategoriesInput {
    candidates: CategoryCandidate[];
    details: PropertyDetailCandidate[];
    hasFeatured: boolean;
    hasMustVisit: boolean;
}

export interface ClassifierOption {
    id: string;
    label: string;
}

export function buildClassifierOptions(
    available: AvailableCategoriesInput,
): ClassifierOption[] {
    const options: ClassifierOption[] = available.candidates.map((c) => ({
        id: c.subCategoryId,
        label: c.name,
    }));

    for (const detail of available.details) {
        options.push({ id: detail.id, label: detail.name });
    }

    options.push({
        id: SCHEDULE_SUB_CATEGORY_ID,
        label: "Horario de entrada y salida (check-in / check-out)",
    });

    if (available.hasFeatured) {
        options.push({
            id: FEATURED_VALUE,
            label: "Lugares marcados como favoritos por el propietario",
        });
    }
    if (available.hasMustVisit) {
        options.push({
            id: MUST_VISIT_VALUE,
            label: "Lugares marcados como imprescindibles por el propietario",
        });
    }

    const seen = new Set<string>();
    return options.filter((o) => {
        if (seen.has(o.id)) return false;
        seen.add(o.id);
        return true;
    });
}

export function buildChatClassificationSchema(
    available: AvailableCategoriesInput,
) {
    const ids = buildClassifierOptions(available)
        .map((o) => o.id)
        .concat(OFF_TOPIC_VALUE);

    return z.object({
        intent: z.enum(ids as [string, ...string[]]),
    });
}

export type ChatClassification = z.infer<
    ReturnType<typeof buildChatClassificationSchema>
>;

export function resolveResponseKind(
    classifiedValue: string,
    available: AvailableCategoriesInput,
): ResponseKind | null {
    if (classifiedValue === SCHEDULE_SUB_CATEGORY_ID) return "schedule";
    if (classifiedValue === FEATURED_VALUE) return "featured";
    if (classifiedValue === MUST_VISIT_VALUE) return "must_visit";

    if (available.details.some((d) => d.id === classifiedValue)) {
        return "detail";
    }

    const candidate = available.candidates.find(
        (c) => c.subCategoryId === classifiedValue,
    );
    return candidate?.type ?? null;
}
