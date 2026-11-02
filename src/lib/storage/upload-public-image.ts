import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types';
import type { ImageBucket } from '@/lib/storage/remove-public-images';
import { imageExtensionFromMimeType } from '@/lib/storage/image-extension';

export type UploadPublicImageResult =
	| { ok: true; publicUrl: string }
	| { ok: false; reason: 'too_large' | 'invalid_format' | 'upload_failed' };

// Núcleo común de los helpers upload-*: valida tamaño y tipo, sube a
// <userId>/<prefix>_<timestamp>.<ext> y devuelve la URL pública. Cada helper
// traduce reason a sus propios mensajes de error.
export async function uploadPublicImage(args: {
	db: SupabaseClient<Database>;
	bucket: ImageBucket;
	userId: string;
	prefix: string;
	file: File;
	maxSize: number;
	// Subconjunto de los tipos de image-extension.ts; sin él, se admiten todos
	allowedMimeTypes?: readonly string[];
}): Promise<UploadPublicImageResult> {
	const { db, bucket, userId, prefix, file, maxSize, allowedMimeTypes } =
		args;

	if (file.size > maxSize) {
		return { ok: false, reason: 'too_large' };
	}

	// La extensión sale del tipo MIME validado, no del nombre del fichero
	const ext = imageExtensionFromMimeType(file.type);
	if (!ext || (allowedMimeTypes && !allowedMimeTypes.includes(file.type))) {
		return { ok: false, reason: 'invalid_format' };
	}

	const fileName = `${userId}/${prefix}_${Date.now()}.${ext}`;

	const { error: uploadError } = await db.storage
		.from(bucket)
		.upload(fileName, file, {
			cacheControl: '3600',
			upsert: false,
		});

	if (uploadError) {
		console.error(`Error subiendo imagen a ${bucket}:`, uploadError);
		return { ok: false, reason: 'upload_failed' };
	}

	const {
		data: { publicUrl },
	} = db.storage.from(bucket).getPublicUrl(fileName);

	return { ok: true, publicUrl };
}
