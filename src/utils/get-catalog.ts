import 'server-only';

import { cache } from 'react';
import { unstable_cache } from 'next/cache';

import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import type { Tables } from '@/lib/types';

export type CatalogCategory = Pick<
	Tables<'categories'>,
	'id' | 'name' | 'icon' | 'type' | 'order_index'
>;

export type CatalogSubCategory = Pick<
	Tables<'sub_categories'>,
	'id' | 'name' | 'type' | 'category_id' | 'order_index'
>;

export type Catalog = {
	categories: CatalogCategory[];
	subCategories: CatalogSubCategory[];
};

export const CATALOG_CACHE_TAG = 'catalog';

// Vercel conserva la Data Cache entre despliegues: el id del despliegue en la
// clave hace que un cambio del catálogo por migración se vea al desplegar
const DEPLOYMENT_KEY = process.env.VERCEL_DEPLOYMENT_ID ?? 'local';

// Red de seguridad por si el catálogo cambia en BD sin un despliegue
const CATALOG_REVALIDATE_SECONDS = 3600;

async function fetchCatalog(): Promise<Catalog> {
	const supabase = await createServerAdminClient();

	const [categoriesResult, subCategoriesResult] = await Promise.all([
		supabase
			.from('categories')
			.select('id, name, icon, type, order_index')
			.order('order_index', { ascending: true })
			.overrideTypes<CatalogCategory[], { merge: false }>(),
		supabase
			.from('sub_categories')
			.select('id, name, type, category_id, order_index')
			.order('order_index', { ascending: true })
			.overrideTypes<CatalogSubCategory[], { merge: false }>(),
	]);

	// Se lanza en vez de devolver vacío: unstable_cache solo guarda
	// resultados correctos, así un fallo puntual no deja el catálogo vacío
	if (categoriesResult.error) throw categoriesResult.error;
	if (subCategoriesResult.error) throw subCategoriesResult.error;

	return {
		categories: categoriesResult.data ?? [],
		subCategories: subCategoriesResult.data ?? [],
	};
}

// unstable_cache comparte el resultado entre peticiones y React.cache lo
// deduplica dentro de una misma petición
export const getCatalog = cache(
	unstable_cache(fetchCatalog, ['catalog', DEPLOYMENT_KEY], {
		tags: [CATALOG_CACHE_TAG],
		revalidate: CATALOG_REVALIDATE_SECONDS,
	}),
);
