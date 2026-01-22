// src/types/db.ts
import type { Tables, Enums } from '@/lib/types';

export type PropertyDataType = Enums<'property_data_type'>; // 'info' | 'location'

export type DbCategory = Tables<'categories'>;
export type DbSubCategory = Tables<'sub_categories'>;

export type PublicSubCategory = Pick<DbSubCategory, 'id' | 'name' | 'type'>;

export type PublicCategory = Pick<
	DbCategory,
	'id' | 'name' | 'icon' | 'order_index' | 'type'
> & {
	sub_categories: PublicSubCategory[];
};

// Si ya usabas este nombre en otros sitios:
export type CategoryWithSubCategories = PublicCategory;
