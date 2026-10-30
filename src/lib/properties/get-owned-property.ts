import 'server-only';

import { cache } from 'react';
import { getLocale } from 'next-intl/server';

import { createSSRClient } from '@/lib/supabase/server';
import { redirect } from '@/i18n/routing';
import type { Tables } from '@/lib/types';

export type OwnedProperty = Pick<
	Tables<'properties'>,
	| 'id'
	| 'name'
	| 'address'
	| 'latitude'
	| 'longitude'
	| 'check_in_date'
	| 'check_in_time'
	| 'check_out_date'
	| 'check_out_time'
>;

// Punto único de acceso a la propiedad que gestiona el anfitrión: verifica
// la sesión y la propiedad junto al dato (los layouts no se re-renderizan al
// navegar, así que la comprobación no puede vivir solo en ellos). `cache`
// deduplica la llamada entre el layout y la página del mismo render.
export const getOwnedProperty = cache(
	async (propertyId: string): Promise<OwnedProperty | null> => {
		const supabase = await createSSRClient();
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return redirect({ href: '/auth/login', locale: await getLocale() });
		}

		// RLS ya limita a las propiedades del usuario; el filtro explícito
		// por user_id mantiene la garantía aunque cambien las políticas
		const { data: property, error } = await supabase
			.from('properties')
			.select(
				'id,name,address,latitude,longitude,check_in_date,check_in_time,check_out_date,check_out_time',
			)
			.eq('id', propertyId)
			.eq('user_id', user.id)
			.maybeSingle()
			.overrideTypes<OwnedProperty, { merge: false }>();

		if (error || !property) return null;

		return property;
	},
);
