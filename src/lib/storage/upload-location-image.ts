import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types';
import { MAX_IMAGE_SIZE } from '@/config/config-constants';
import { uploadPublicImage } from '@/lib/storage/upload-public-image';

export type UploadLocationImageResult =
	| { ok: true; imageUrl: string | null }
	| {
			ok: false;
			errorState: { errors: { image?: string[]; server?: string[] } };
	  };

export async function uploadLocationImage(args: {
	db: SupabaseClient<Database>;
	userId: string;
	imageFile: File | null;
}): Promise<UploadLocationImageResult> {
	const { db, userId, imageFile } = args;

	if (!imageFile || imageFile.size <= 0) {
		return { ok: true, imageUrl: null };
	}

	const res = await uploadPublicImage({
		db,
		bucket: 'location-images',
		userId,
		prefix: 'location',
		file: imageFile,
		maxSize: MAX_IMAGE_SIZE,
	});

	if (res.ok) return { ok: true, imageUrl: res.publicUrl };

	// Los errores son claves de messages/*.json: los traduce el formulario
	switch (res.reason) {
		case 'too_large':
			return {
				ok: false,
				errorState: { errors: { image: ['locationImageTooLarge'] } },
			};
		case 'invalid_format':
			return {
				ok: false,
				errorState: { errors: { image: ['locationImageInvalidFormat'] } },
			};
		case 'upload_failed':
			return {
				ok: false,
				errorState: { errors: { server: ['locationImageUploadError'] } },
			};
	}
}
