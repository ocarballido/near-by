// app/api/properties/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createSSRSassClient } from '@/lib/supabase/server';
import { generateSlug } from '@/utils/generate-slug';
import { getDefaultGroups } from '@/utils/default-groups';

const MAX_IMAGE_SIZE = 500 * 1024;

export async function POST(request: NextRequest) {
	try {
		// 1. Inicializar tu cliente personalizado
		const sassClient = await createSSRSassClient();

		// 2. Obtener el cliente de Supabase subyacente para acceder a auth
		const supabase = sassClient.getSupabaseClient();

		// 3. Verificar autenticación usando el cliente subyacente
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			// return {
			// 	errors: {
			// 		server: ['No has iniciado sesión o tu sesión ha expirado'],
			// 	},
			// };
			throw new Error('No has iniciado sesión o tu sesión ha expirado');
		}
		const userId = user.id;

		// 4. Obtener datos de la solicitud
		const formData = await request.formData();

		// 5. Validar datos requeridos
		const name = formData.get('name') as string;
		const description = formData.get('description') as string;
		const address = formData.get('address') as string;
		const latitude = formData.get('latitude')
			? parseFloat(formData.get('latitude') as string)
			: null;
		const longitude = formData.get('longitude')
			? parseFloat(formData.get('longitude') as string)
			: null;
		const imageFile = formData.get('image') as File | null;

		// 6. Validar campos requeridos
		if (!name || !address) {
			return NextResponse.json(
				{ error: 'Nombre y dirección son obligatorios' },
				{ status: 400 }
			);
		}

		// 7. Validar tamaño de la imagen si existe
		let imageUrl = null;
		if (imageFile) {
			if (imageFile.size > MAX_IMAGE_SIZE) {
				return NextResponse.json(
					{
						error: `La imagen no debe superar los 500 KB. Tamaño actual: ${(
							imageFile.size / 1024
						).toFixed(2)} KB`,
					},
					{ status: 400 }
				);
			}

			// 8. Subir la imagen a Supabase Storage
			const fileExt = imageFile.name.split('.').pop();
			const fileName = `${userId}/property_${Date.now()}.${fileExt}`;

			const { error: uploadError } = await supabase.storage
				.from('property_images')
				.upload(fileName, imageFile, {
					cacheControl: '3600',
					upsert: false,
				});

			if (uploadError) {
				console.error('Error al subir imagen:', uploadError);
				return NextResponse.json(
					{ error: 'Error al subir la imagen' },
					{ status: 500 }
				);
			}

			// 9. Obtener la URL pública de la imagen
			const {
				data: { publicUrl },
			} = supabase.storage.from('property_images').getPublicUrl(fileName);

			imageUrl = publicUrl;
		}

		// 10. Verificar límite de suscripción
		// const { data: subscription } = await supabase
		// 	.from('subscriptions')
		// 	.select('plan_id')
		// 	.eq('user_id', userId)
		// 	.eq('status', 'active')
		// 	.single();

		// const planId = subscription?.plan_id || 'free';

		// const { count, error: countError } = await supabase
		// 	.from('properties')
		// 	.select('*', { count: 'exact', head: true })
		// 	.eq('user_id', userId);

		// if (countError) {
		// 	throw countError;
		// }

		// const PLAN_LIMITS = {
		// 	free: 1,
		// 	pro: 5,
		// 	business: Infinity,
		// };

		// if (
		// 	count !== null &&
		// 	count >= PLAN_LIMITS[planId as keyof typeof PLAN_LIMITS]
		// ) {
		// 	return NextResponse.json(
		// 		{
		// 			error: 'Has alcanzado el límite de alojamientos para tu plan',
		// 			currentPlan: planId,
		// 		},
		// 		{ status: 403 }
		// 	);
		// }

		// 11. Crear un slug único basado en el nombre
		const slug = generateSlug(name);

		// 12. Crear la propiedad en la base de datos
		const { data: property, error } = await supabase
			.from('properties')
			.insert({
				user_id: userId,
				name,
				description,
				address,
				latitude,
				longitude,
				image_url: imageUrl,
				slug,
			})
			.select()
			.single();

		if (error) {
			throw new Error(
				'Error al crear el alojamiento. Por favor, inténtalo de nuevo.'
			);
		}

		// 13. Crear grupos predeterminados para esta propiedad
		const { data: categories, error: categoriesError } = await supabase
			.from('categories')
			.select('*')
			.order('order_index');

		if (categoriesError) {
			throw categoriesError;
		}

		const defaultGroups = getDefaultGroups();

		for (const category of categories || []) {
			const categoryGroups =
				defaultGroups[category.name as keyof typeof defaultGroups] ||
				[];

			for (let i = 0; i < categoryGroups.length; i++) {
				const groupName = categoryGroups[i];
				const groupSlug = generateSlug(groupName);

				await supabase.from('location_groups').insert({
					property_id: property.id,
					category_id: category.id,
					name: categoryGroups[i],
					slug: groupSlug,
					is_default: true,
					order_index: i + 1,
				});
			}
		}

		// 14. Devolver la propiedad creada
		return NextResponse.json(property);
	} catch (error: unknown) {
		console.error('Error al crear propiedad:', error);

		const errorMessage =
			error instanceof Error
				? error.message
				: 'Error interno del servidor';

		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
