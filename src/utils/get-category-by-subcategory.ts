import { CATEGORIES_SUB_CATEGORIES } from "@/config/config-constants";

export type CategoryLookupResult = {
    categoryId: string;
    icon: string;
};

type CategoriesMap = typeof CATEGORIES_SUB_CATEGORIES;
type CategoryKey = keyof CategoriesMap;

// Construye un mapa subCategoryId -> { categoryId, icon } una sola vez,
// recorriendo CATEGORIES_SUB_CATEGORIES.
const SUB_CATEGORY_TO_CATEGORY: Record<string, CategoryLookupResult> = (
    Object.keys(CATEGORIES_SUB_CATEGORIES) as CategoryKey[]
).reduce(
    (acc, categoryKey) => {
        const category = CATEGORIES_SUB_CATEGORIES[categoryKey];
        const subCategories = category.SUB_CATEGORIES as Record<
            string,
            { id: string }
        >;

        Object.values(subCategories).forEach((subCategory) => {
            acc[subCategory.id] = {
                categoryId: category.id,
                icon: category.icon,
            };
        });

        return acc;
    },
    {} as Record<string, CategoryLookupResult>,
);

/**
 * Dado el id de una subcategoría, devuelve el id de su categoría padre
 * y el icono asociado a esa categoría, según CATEGORIES_SUB_CATEGORIES.
 *
 * Devuelve `null` si el subCategoryId no existe en la configuración.
 */
export const getCategoryBySubCategoryId = (
    subCategoryId: string,
): CategoryLookupResult | null => {
    return SUB_CATEGORY_TO_CATEGORY[subCategoryId] ?? null;
};
