'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { createSPASassClient } from '@/lib/supabase/client';

import ButtonLink from '@/components/molecules/button-link';
import IconAccountCircle from '@/components/atoms/icon/account-circle';
import LanguageSelector from '@/components/molecules/language-selector';
import IconHome from '@/components/atoms/icon/home';
import ButtonIcon from '@/components/atoms/button-icon';

export default function LandingAuthButton() {
	const t = useTranslations();

	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);

	const router = useRouter();

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const supabase = await createSPASassClient();
				const {
					data: { user },
				} = await supabase.getSupabaseClient().auth.getUser();
				setIsAuthenticated(!!user);
			} catch (error) {
				console.error('Error checking auth status:', error);
			} finally {
				setLoading(false);
			}
		};

		checkAuth();
	}, []);

	if (loading) {
		return null;
	}

	return (
		<div className="flex gap-1 ml-auto">
			<LanguageSelector triggerColor="white" />
			{isAuthenticated ? (
				<ButtonLink
					label={t('Ir al panel')}
					href="/app"
					iconLeft={<IconHome color="white" />}
				/>
			) : (
				<>
					<ButtonLink
						label={t('Iniciar sesión')}
						href="/auth/login"
						iconLeft={<IconAccountCircle color="white" />}
						className="hidden md:flex"
					/>
					<ButtonIcon
						icon={<IconAccountCircle color="white" />}
						className="flex md:hidden"
						onClick={() => router.push('/auth/login')}
					/>
				</>
			)}
		</div>
	);
}
