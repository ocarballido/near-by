import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types';
import { MAX_IMAGE_SIZE } from '@/config/config-constants';
import { uploadPublicImage } from '@/lib/storage/upload-public-image';

type UploadDetailImageResult =
	| { ok: true; imageUrl: string }
	| { ok: false; error: string };

// Los errores son claves de messages/*.json: los traduce el formulario
const ERROR_KEYS = {
	too_large: 'detailImageTooLarge',
	invalid_format: 'detailImageInvalidFormat',
	upload_failed: 'detailImageUploadError',
} as const;

// Las imágenes de detalles van al bucket property-images (mismo límite de
// 500 KB que la imagen de la propiedad), con prefijo detail_ para
// distinguirlas en la carpeta del usuario
export async function uploadDetailImage(args: {
	db: SupabaseClient<Database>;
	userId: string;
	imageFile: File;
}): Promise<UploadDetailImageResult> {
	const { db, userId, imageFile } = args;

	const res = await uploadPublicImage({
		db,
		bucket: 'property-images',
		userId,
		prefix: 'detail',
		file: imageFile,
		maxSize: MAX_IMAGE_SIZE,
	});

	if (!res.ok) return { ok: false, error: ERROR_KEYS[res.reason] };

	return { ok: true, imageUrl: res.publicUrl };
}
