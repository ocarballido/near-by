import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types';
import { MAX_IMAGE_SIZE } from '@/config/config-constants';
import { imageExtensionFromMimeType } from '@/lib/storage/image-extension';

export type UploadPropertyImageResult =
	| { ok: true; imageUrl: string | null }
	| { ok: false; errorState: { errors: { image: string[] } } };

export async function uploadPropertyImage(args: {
	db: SupabaseClient<Database>;
	userId: string;
	imageFile: File | null;
}): Promise<UploadPropertyImageResult> {
	const { db, userId, imageFile } = args;

	let imageUrl: string | null = null;

	if (!imageFile || imageFile.size <= 0) {
		return { ok: true, imageUrl: null };
	}

	// Validar tamaño
	if (imageFile.size > MAX_IMAGE_SIZE) {
		return {
			ok: false,
			errorState: {
				errors: {
					image: [
						`La imagen no debe superar los 500 KB. Tamaño actual: ${(
							imageFile.size / 1024
						).toFixed(2)} KB`,
					],
				},
			},
		};
	}

	// Validar tipo (y de él sale la extensión)
	const fileExt = imageExtensionFromMimeType(imageFile.type);
	if (!fileExt) {
		return {
			ok: false,
			errorState: {
				errors: {
					image: [
						'El archivo debe ser una imagen (JPEG, PNG, WebP o GIF)',
					],
				},
			},
		};
	}

	// Subir imagen
	const fileName = `${userId}/property_${Date.now()}.${fileExt}`;

	const { error: uploadError } = await db.storage
		.from('property-images')
		.upload(fileName, imageFile, {
			cacheControl: '3600',
			upsert: false,
		});

	if (uploadError) {
		console.error('Error al subir imagen:', uploadError);
		return {
			ok: false,
			errorState: {
				errors: {
					image: [
						'Error al subir la imagen. Por favor, inténtalo de nuevo.',
					],
				},
			},
		};
	}

	const {
		data: { publicUrl },
	} = db.storage.from('property-images').getPublicUrl(fileName);

	imageUrl = publicUrl;

	return { ok: true, imageUrl };
}
