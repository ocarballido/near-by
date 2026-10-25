// src/lib/uploadLocationImage.ts
import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types';
import { MAX_IMAGE_SIZE } from '@/config/config-constants';
import { imageExtensionFromMimeType } from '@/lib/storage/image-extension';

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

	// Los errores son claves de messages/*.json: los traduce el formulario
	if (imageFile.size > MAX_IMAGE_SIZE) {
		return {
			ok: false,
			errorState: { errors: { image: ['locationImageTooLarge'] } },
		};
	}

	// La extensión sale del tipo MIME validado, no del nombre del fichero
	const ext = imageExtensionFromMimeType(imageFile.type);
	if (!ext) {
		return {
			ok: false,
			errorState: { errors: { image: ['locationImageInvalidFormat'] } },
		};
	}

	const fileName = `${userId}/location_${Date.now()}.${ext}`;

	const { error: upErr } = await db.storage
		.from('location-images')
		.upload(fileName, imageFile, {
			cacheControl: '3600',
			upsert: false,
		});

	if (upErr) {
		console.error('Error subiendo imagen a location-images:', upErr);
		return {
			ok: false,
			errorState: { errors: { server: ['locationImageUploadError'] } },
		};
	}

	const {
		data: { publicUrl },
	} = db.storage.from('location-images').getPublicUrl(fileName);

	return { ok: true, imageUrl: publicUrl };
}
