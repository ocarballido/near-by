import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types';

export type ImageBucket =
	| 'property-images'
	| 'property-logos'
	| 'location-images';

// Inversa de getPublicUrl de storage-js, que genera
// encodeURI(`<url>/object/public/<bucket>/<path>`). Las columnas de URL las
// puede escribir el propio usuario vía REST (RLS no restringe columnas), así
// que no basta con que la URL venga de BD: solo se acepta si es de nuestro
// Supabase, de ese bucket y de la carpeta del dueño (`<userId>/`), que es
// donde suben todas las acciones. Cualquier otra devuelve null.
function storagePathFromPublicUrl(
	publicUrl: string,
	bucket: ImageBucket,
	ownerUserId: string,
): string | null {
	const prefix = `/storage/v1/object/public/${bucket}/`;

	try {
		const { origin, pathname } = new URL(publicUrl);
		const supabaseOrigin = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!)
			.origin;
		if (origin !== supabaseOrigin) return null;
		if (!pathname.startsWith(prefix)) return null;

		const path = decodeURI(pathname.slice(prefix.length));
		if (!path.startsWith(`${ownerUserId}/`)) return null;

		return path.length > ownerUserId.length + 1 ? path : null;
	} catch {
		return null;
	}
}

// Borrado best-effort: la BD es la fuente de verdad. Se llama solo después de
// que la escritura en BD haya ido bien; si el Storage falla, se registra y la
// acción sigue. ownerUserId debe ser el usuario ya verificado como dueño.
export async function removePublicImages(
	db: SupabaseClient<Database>,
	bucket: ImageBucket,
	ownerUserId: string,
	publicUrls: (string | null | undefined)[],
): Promise<void> {
	const paths = publicUrls
		.map((url) =>
			url ? storagePathFromPublicUrl(url, bucket, ownerUserId) : null,
		)
		.filter((path): path is string => path !== null);

	if (paths.length === 0) return;

	const { error } = await db.storage.from(bucket).remove(paths);
	if (error) {
		console.error(`Error borrando imágenes de ${bucket}:`, error);
	}
}
