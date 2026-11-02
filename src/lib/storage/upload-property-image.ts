import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types';
import { MAX_IMAGE_SIZE } from '@/config/config-constants';
import { uploadPublicImage } from '@/lib/storage/upload-public-image';

export type UploadPropertyImageResult =
	| { ok: true; imageUrl: string | null }
	| { ok: false; errorState: { errors: { image: string[] } } };

export async function uploadPropertyImage(args: {
	db: SupabaseClient<Database>;
	userId: string;
	imageFile: File | null;
}): Promise<UploadPropertyImageResult> {
	const { db, userId, imageFile } = args;

	if (!imageFile || imageFile.size <= 0) {
		return { ok: true, imageUrl: null };
	}

	const res = await uploadPublicImage({
		db,
		bucket: 'property-images',
		userId,
		prefix: 'property',
		file: imageFile,
		maxSize: MAX_IMAGE_SIZE,
	});

	if (res.ok) return { ok: true, imageUrl: res.publicUrl };

	// Claves de messages/*.json: las traduce el formulario ({kb} y {got} los
	// pone él con MAX_IMAGE_SIZE y el tamaño del fichero)
	const errorKeys = {
		too_large: 'propertyImageTooLarge',
		invalid_format: 'propertyImageInvalidFormat',
		upload_failed: 'propertyImageUploadError',
	};

	return {
		ok: false,
		errorState: { errors: { image: [errorKeys[res.reason]] } },
	};
}
