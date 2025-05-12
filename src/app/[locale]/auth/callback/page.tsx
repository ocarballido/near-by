'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createSPASassClient } from '@/lib/supabase/client';
import Alert from '@/components/molecules/alert';

export default function AuthCallback() {
	const t = useTranslations();
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const handleAuthCallback = async () => {
			try {
				const supabase = await createSPASassClient();
				const supabaseClient = supabase.getSupabaseClient();

				const { data: sessionData, error: sessionError } =
					await supabaseClient.auth.getSession();

				if (sessionError) throw sessionError;
				if (!sessionData?.session)
					throw new Error('No se pudo obtener la sesión');

				// Simplemente redirigimos al usuario a la aplicación
				// Sin crear suscripción aquí
				router.push('/app');
			} catch (err) {
				console.error('Error en autenticación:', err);
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError('Ocurrió un error inesperado');
				}

				setTimeout(() => {
					router.push('/auth/magic-link');
				}, 3000);
			} finally {
				setLoading(false);
			}
		};

		handleAuthCallback();
	}, [router, t]);

	return (
		<div className="relative max-w-96 w-full mx-auto mt-8">
			{error && (
				<Alert
					message={error}
					type="error"
					dismissible
					open={error !== ''}
					title="Error"
				/>
			)}

			{loading && (
				<div className="text-center">
					<h2 className="text-xl font-bold mb-4">
						{t('Verificando tu sesión')}
					</h2>
					<p className="mb-4">
						{t('Estamos completando tu inicio de sesión')}
					</p>
				</div>
			)}
		</div>
	);
}
