import { CATEGORIES_SUB_CATEGORIES } from "@/config/config-constants";

export type SearchMode = "curated" | "magic";

export type SearchPlan = {
    rankby: "prominence";
    radius: number;
    type?: string;
    keyword?: string;
    keywords?: string[];
    fallbackTypes?: string[];
    excludePlaceTypes?: string[]; // post-filter por types
    excludeNameWords?: string[]; // post-filter por nombre
    isCurated: boolean;
};

export const RANKBY: SearchPlan["rankby"] = "prominence";

// ✅ curado: mismo mapping que ya estabas usando
const CURATED_MAP: Record<
    string,
    { type?: string; keywords?: string[]; fallbackTypes?: string[] }
> = {
    [CATEGORIES_SUB_CATEGORIES.FOOD_AND_DRINK.SUB_CATEGORIES.RESTAURANTS.id]: {
        type: "restaurant",
    },
    [CATEGORIES_SUB_CATEGORIES.FOOD_AND_DRINK.SUB_CATEGORIES.CAFES.id]: {
        type: "cafe",
    },
    [CATEGORIES_SUB_CATEGORIES.FOOD_AND_DRINK.SUB_CATEGORIES.BARS.id]: {
        type: "bar",
    },
    [CATEGORIES_SUB_CATEGORIES.FOOD_AND_DRINK.SUB_CATEGORIES.BAKERIES.id]: {
        type: "bakery",
    },

    [CATEGORIES_SUB_CATEGORIES.SHOPPING.SUB_CATEGORIES.SUPERMARKETS.id]: {
        type: "supermarket",
    },
    [CATEGORIES_SUB_CATEGORIES.SHOPPING.SUB_CATEGORIES.SHOPPING_MALLS.id]: {
        type: "shopping_mall",
    },

    [CATEGORIES_SUB_CATEGORIES.SERVICES.SUB_CATEGORIES.PARKINGS.id]: {
        type: "parking",
        keywords: ["parking", "aparcamiento", "parking garage", "parking lot"],
        fallbackTypes: ["point_of_interest"],
    },

    [CATEGORIES_SUB_CATEGORIES.TRANSPORTATION.SUB_CATEGORIES.METRO_STATIONS.id]:
        {
            type: "subway_station",
            fallbackTypes: ["transit_station"],
        },
    [CATEGORIES_SUB_CATEGORIES.TRANSPORTATION.SUB_CATEGORIES.TRAIN_STATIONS.id]:
        {
            type: "train_station",
            fallbackTypes: ["transit_station"],
        },

    [CATEGORIES_SUB_CATEGORIES.HEALTH_AND_WELLNESS.SUB_CATEGORIES.PHARMACIES
        .id]: {
        type: "pharmacy",
    },

    [CATEGORIES_SUB_CATEGORIES.PARKS_AND_NATURE.SUB_CATEGORIES.URBAN_PARKS.id]:
        {
            type: "park",
        },
    [CATEGORIES_SUB_CATEGORIES.PARKS_AND_NATURE.SUB_CATEGORIES.BEACHES.id]: {
        type: "beach",
    },

    [CATEGORIES_SUB_CATEGORIES.ARTS_AND_CULTURE.SUB_CATEGORIES.MUSEUMS.id]: {
        type: "museum",
    },

    [CATEGORIES_SUB_CATEGORIES.ENTERTAINMENT_AND_NIGHTLIFE.SUB_CATEGORIES
        .NIGHTCLUBS.id]: {
        type: "night_club",
    },

    // Monumentos queda deliberadamente FUERA de CURATED_MAP:
    // Google Places no tiene un `type` nativo "monument". Usar
    // 'tourist_attraction' introduciría ruido (mezcla monumentos con
    // miradores, plazas, etc.). Cae al fallback `magic` por keyword
    // ("Monumentos"), igual que cualquier subcategoría no curada.
    // Revisar con datos reales antes de decidir si merece curación.
};

function radiusForCurated(subCategoryId: string): number {
    // Tier amplio: puntos de interés dispersos por la ciudad,
    // merece la pena ampliar el radio para encontrar resultados relevantes.
    if (
        subCategoryId ===
            CATEGORIES_SUB_CATEGORIES.ARTS_AND_CULTURE.SUB_CATEGORIES.MUSEUMS
                .id ||
        subCategoryId ===
            CATEGORIES_SUB_CATEGORIES.PARKS_AND_NATURE.SUB_CATEGORIES
                .URBAN_PARKS.id ||
        subCategoryId ===
            CATEGORIES_SUB_CATEGORIES.PARKS_AND_NATURE.SUB_CATEGORIES.BEACHES
                .id ||
        subCategoryId ===
            CATEGORIES_SUB_CATEGORIES.SHOPPING.SUB_CATEGORIES.SHOPPING_MALLS
                .id ||
        subCategoryId ===
            CATEGORIES_SUB_CATEGORIES.TRANSPORTATION.SUB_CATEGORIES
                .TRAIN_STATIONS.id
    ) {
        return 8000;
    }

    // Tier corto: necesidades cotidianas, densidad alta en zonas urbanas.
    if (
        subCategoryId ===
            CATEGORIES_SUB_CATEGORIES.HEALTH_AND_WELLNESS.SUB_CATEGORIES
                .PHARMACIES.id ||
        subCategoryId ===
            CATEGORIES_SUB_CATEGORIES.SHOPPING.SUB_CATEGORIES.SUPERMARKETS.id ||
        subCategoryId ===
            CATEGORIES_SUB_CATEGORIES.TRANSPORTATION.SUB_CATEGORIES
                .METRO_STATIONS.id ||
        subCategoryId ===
            CATEGORIES_SUB_CATEGORIES.FOOD_AND_DRINK.SUB_CATEGORIES.BAKERIES.id
    ) {
        return 2500;
    }

    if (
        subCategoryId ===
        CATEGORIES_SUB_CATEGORIES.SERVICES.SUB_CATEGORIES.PARKINGS.id
    ) {
        return 3500;
    }

    // Default: restaurantes, cafés, bares, discotecas (vida nocturna/food
    // comparten densidad similar a la del tier por defecto actual).
    return 4500;
}

function isFoodSubcat(subCategoryId: string) {
    return (
        subCategoryId ===
            CATEGORIES_SUB_CATEGORIES.FOOD_AND_DRINK.SUB_CATEGORIES.RESTAURANTS
                .id ||
        subCategoryId ===
            CATEGORIES_SUB_CATEGORIES.FOOD_AND_DRINK.SUB_CATEGORIES.CAFES.id ||
        subCategoryId ===
            CATEGORIES_SUB_CATEGORIES.FOOD_AND_DRINK.SUB_CATEGORIES.BARS.id ||
        subCategoryId ===
            CATEGORIES_SUB_CATEGORIES.FOOD_AND_DRINK.SUB_CATEGORIES.BAKERIES.id
    );
}

// ✅ lookup nombre subcat para modo “todas”
type SubCategoryMeta = {
    id: string;
    name: string;
    type: string;
};

type CategoryMeta = {
    SUB_CATEGORIES: Record<string, SubCategoryMeta>;
};

function isCategoryMeta(v: unknown): v is CategoryMeta {
    if (typeof v !== "object" || v === null) return false;
    if (!("SUB_CATEGORIES" in v)) return false;

    const sc = (v as Record<string, unknown>).SUB_CATEGORIES;
    return typeof sc === "object" && sc !== null;
}

export function findSubCategoryNameById(subCategoryId: string): string | null {
    for (const cat of Object.values(CATEGORIES_SUB_CATEGORIES)) {
        if (!isCategoryMeta(cat)) continue;

        for (const sub of Object.values(cat.SUB_CATEGORIES)) {
            if (sub.id === subCategoryId) return sub.name;
        }
    }
    return null;
}

export function findCategoryIdBySubCategoryId(
    subCategoryId: string,
): string | null {
    for (const cat of Object.values(CATEGORIES_SUB_CATEGORIES)) {
        if (!isCategoryMeta(cat)) continue;

        for (const sub of Object.values(cat.SUB_CATEGORIES)) {
            if (sub.id === subCategoryId) {
                const maybeId = (cat as { id?: string }).id;
                return typeof maybeId === "string" ? maybeId : null;
            }
        }
    }
    return null;
}

export function buildSearchPlan(args: {
    subCategoryId: string;
    mode: SearchMode;
    radius: number;
}): SearchPlan | null {
    const { subCategoryId, mode, radius } = args;

    // 1) si es curada, devolvemos curada (para recos y también para magic)
    const curatedCfg = CURATED_MAP[subCategoryId];
    if (curatedCfg) {
        const food = isFoodSubcat(subCategoryId);

        return {
            rankby: RANKBY,
            radius:
                mode === "curated" ? radiusForCurated(subCategoryId) : radius,
            type: curatedCfg.type,
            keyword: undefined,
            keywords: curatedCfg.keywords,
            fallbackTypes: curatedCfg.fallbackTypes,
            excludePlaceTypes: food ? ["lodging"] : undefined,
            excludeNameWords: food
                ? ["hotel", "hostel", "apartahotel", "aparthotel"]
                : undefined,
            isCurated: true,
        };
    }

    // 2) no curada => magic/genérica: keyword por nombre de subcategoría
    if (mode === "magic") {
        const name = findSubCategoryNameById(subCategoryId);
        if (!name) return null;

        return {
            rankby: RANKBY,
            radius,
            type: undefined,
            keyword: name, // ✅ keyword: "Restaurantes", "Monumentos", etc.
            isCurated: false,
        };
    }

    // recos solo usa curado, así que si no está curada => null
    return null;
}

export function applyPlanFilters<T extends { name?: string; types?: string[] }>(
    results: T[],
    plan: SearchPlan,
): T[] {
    let out = results ?? [];

    if (plan.excludePlaceTypes?.length) {
        out = out.filter((r) => {
            const types = r.types ?? [];
            return !plan.excludePlaceTypes!.some((t) => types.includes(t));
        });
    }

    if (plan.excludeNameWords?.length) {
        const bad = plan.excludeNameWords.map((w) => w.toLowerCase());
        out = out.filter((r) => {
            const name = (r.name ?? "").toLowerCase();
            return !bad.some((w) => name.includes(w));
        });
    }

    return out;
}
