import { CATEGORIES_SUB_CATEGORIES } from "@/config/config-constants";

export function findSubCategoryNameById(subCategoryId: string): string | null {
    for (const category of Object.values(CATEGORIES_SUB_CATEGORIES)) {
        for (const sub of Object.values(category.SUB_CATEGORIES)) {
            if (sub.id === subCategoryId) return sub.name;
        }
    }
    return null;
}
