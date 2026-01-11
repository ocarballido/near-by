// src/lib/uploadPropertyImage.ts
'use server';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types';
import { MAX_IMAGE_SIZE } from '@/config/config-constants';

export type UploadPropertyImageResult =
	| { ok: true; imageUrl: string | null }
	| { ok: false; errorState: { errors: { image: string[] } } };

const VALID_IMAGE_TYPES = [
	'image/jpeg',
	'image/png',
	'image/webp',
	'image/gif',
] as const;

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

	// Validar tipo
	if (
		!VALID_IMAGE_TYPES.includes(
			imageFile.type as (typeof VALID_IMAGE_TYPES)[number]
		)
	) {
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
	const fileExt = imageFile.name.split('.').pop() ?? 'jpg';
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
