'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createSPASassClient } from '@/lib/supabase/client';
import Alert from '@/components/molecules/alert';

export default function AuthCallback() {
	const t = useTranslations();
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);
	const searchParams = useSearchParams();

	const redirectTo = searchParams?.get('redirect') || '/app';

	useEffect(() => {
		const handleAuthCallback = async () => {
			try {
				console.log('Iniciando autenticación de callback');
				const supabase = await createSPASassClient();
				const supabaseClient = supabase.getSupabaseClient();

				console.log('Obteniendo sesión');
				const { data: sessionData, error: sessionError } =
					await supabaseClient.auth.getSession();

				console.log(
					'Sesión obtenida:',
					sessionData ? 'Sí' : 'No',
					'Error:',
					sessionError ? 'Sí' : 'No'
				);

				if (sessionError) throw sessionError;
				if (!sessionData?.session)
					throw new Error('No se pudo obtener la sesión');

				console.log(`Redirigiendo a ${redirectTo}`);

				window.location.href = redirectTo;
				return;
			} catch (err) {
				console.error('Error completo en autenticación:', err);
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError('Ocurrió un error inesperado');
				}

				setTimeout(() => {
					window.location.href = '/auth/magic-link';
				}, 3000);
			} finally {
				setLoading(false);
			}
		};

		handleAuthCallback();
	}, [redirectTo]);

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
