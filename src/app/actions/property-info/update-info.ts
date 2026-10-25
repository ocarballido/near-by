'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { after } from 'next/server';
import { createSSRClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';
import { touchPropertyUpdatedAt } from '@/lib/properties/touch-property';
import { updatePropertyProgressAndTrack } from '@/lib/updatePropertyProgress';
import { translateAndStore } from '@/lib/translations/translateAndStore';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables, TablesUpdate } from '@/lib/types';

const CreateInfoSchema = z.object({
	property_id: z.string().uuid(),
	category_id: z.string().uuid(),
	sub_category_id: z.string().uuid(),
	type: z.enum(['info', 'location']),
	content: z
		.string()
		.transform((v) => v.trim())
		.transform((v) => (v === '' ? null : v))
		.nullable(),
});

export type CreateInfoState = {
	errors?: {
		content?: string[];
		server?: string[];
	};
	success?: boolean;
	message?: string;
	redirectTo?: string;
};

export async function updateInfo(formData: FormData): Promise<CreateInfoState> {
	try {
		// ✅ SSR client => RLS applies
		const ssr = await createSSRClient();
		const db = ssr as unknown as SupabaseClient<Database>;

		const {
			data: { user },
			error: authError,
		} = await db.auth.getUser();

		if (authError || !user) {
			return {
				errors: {
					server: ['No has iniciado sesión o tu sesión ha expirado'],
				},
			};
		}

		const raw = {
			property_id: formData.get('property_id'),
			category_id: formData.get('category_id'),
			sub_category_id: formData.get('sub_category_id'),
			type: formData.get('type'),
			content: formData.get('content'),
		};

		const parsed = CreateInfoSchema.safeParse(raw);
		if (!parsed.success) {
			const fe = parsed.error.flatten().fieldErrors;
			return {
				errors: {
					content: fe.content,
					server: ['Datos inválidos.'],
				},
			};
		}

		const { property_id, category_id, sub_category_id, type, content } =
			parsed.data;

		// description: valor previo para retraducir solo si cambia
		type ExistingInfo = Pick<Tables<'property_data'>, 'id' | 'description'>;

		// ✅ IMPORTANT: do NOT filter by property_data.user_id here.
		// Ownership is enforced by RLS via properties.user_id.
		const { data: existing, error: findError } = await db
			.from('property_data')
			.select('id, description')
			.eq('property_id', property_id)
			.eq('sub_category_id', sub_category_id)
			.eq('type', type)
			.single()
			.overrideTypes<ExistingInfo, { merge: false }>();

		let propertyDataId: string | undefined = existing?.id;

		// none exists => PGRST116 OK
		if (findError && findError.code !== 'PGRST116') {
			console.error('Error buscando info existente:', findError);
			return {
				errors: {
					server: [
						'No se pudo comprobar si ya existe la información.',
					],
				},
			};
		}

		let dbError: any = null;
		let didMutate = false;

		// Empty => delete if exists
		if (content === null) {
			if (existing) {
				const { error } = await db
					.from('property_data')
					.delete()
					.eq('id', existing.id);

				dbError = error;
				didMutate = !error;
			}
		} else {
			if (existing) {
				const payload: TablesUpdate<'property_data'> = {
					description: content,
					updated_at: new Date().toISOString(),
				};

				const { error } = await db
					.from('property_data')
					.update(payload)
					.eq('id', existing.id);

				dbError = error;
				didMutate = !error;
			} else {
				const { data: inserted, error } = await db
					.from('property_data')
					.insert({
						user_id: user.id,
						property_id,
						category_id,
						sub_category_id,
						type,
						description: content,
						name: null,
					})
					.select('id')
					.single();

				dbError = error;
				didMutate = !error;

				if (!error && inserted) {
					propertyDataId = inserted.id;
				}
			}
		}

		if (dbError) {
			console.error('Error al guardar en property_data:', dbError);
			return {
				errors: {
					server: ['Error al guardar la información.'],
				},
			};
		}

		if (didMutate) {
			await touchPropertyUpdatedAt(db, property_id);

			// Traducir solo si es nuevo o cambió (cada traducción consume cuota
			// del anfitrión). Al borrar la fila, sus traducciones caen en
			// cascada.
			const contentChanged =
				content !== null &&
				(!existing || (existing.description ?? '') !== content);

			if (contentChanged && existing) {
				// La antigua se borra antes: en la guía tiene prioridad sobre el
				// original, y si la nueva no llega (sin cuota, texto largo,
				// error) el huésped vería datos desfasados (p. ej. un WiFi
				// antiguo). property_data_translations solo admite lectura por
				// RLS: cliente admin, sobre un id que ya ha pasado por RLS.
				const admin = await createServerAdminClient();
				const { error: deleteTrErr } = await admin
					.from('property_data_translations')
					.delete()
					.eq('property_data_id', existing.id)
					.eq('field_key', 'description');

				if (deleteTrErr) {
					console.error(
						'[updateInfo] Error borrando traducciones:',
						deleteTrErr,
					);
				}
			}

			// after(): tras responder, sin bloquear al propietario
			if (contentChanged && content !== null && propertyDataId) {
				after(() =>
					translateAndStore(
						propertyDataId,
						{ type: 'user', userId: user.id },
						[{ fieldKey: 'description', value: content }],
					).catch((err) =>
						console.error('[updateInfo] Error en traducción:', err),
					),
				);
			}
		}

		await updatePropertyProgressAndTrack({
			db,
			userId: user.id,
			propertyId: property_id,
		});

		revalidatePath(`/app`);

		return {
			success: true,
			message: 'Información actualizada correctamente',
			redirectTo: `/app/properties`,
		};
	} catch (err) {
		console.error('Error inesperado en updateInfo:', err);
		return {
			errors: {
				server: ['Error interno del servidor'],
			},
		};
	}
}
