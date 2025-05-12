'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { createSPASassClient } from '@/lib/supabase/client';

import ButtonLink from '@/components/molecules/button-link';
import IconAccountCircle from '@/components/atoms/icon/account-circle';
import LanguageSelector from '@/components/molecules/language-selector';
import IconHome from '@/components/atoms/icon/home';
import ButtonIcon from '@/components/atoms/button-icon';

export default function LandingAuthButton() {
	const t = useTranslations();
	const router = useRouter();

	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);
	const [hasMounted, setHasMounted] = useState(false);

	useEffect(() => {
		setHasMounted(true);

		const checkAuth = async () => {
			const supabase = await createSPASassClient();
			const {
				data: { session },
			} = await supabase.getSupabaseClient().auth.getSession();
			setIsAuthenticated(!!session?.user);
			setLoading(false);

			const { data: listener } = supabase
				.getSupabaseClient()
				.auth.onAuthStateChange((_event, session) => {
					setIsAuthenticated(!!session?.user);
				});

			return () => {
				listener.subscription.unsubscribe();
			};
		};

		checkAuth();
	}, []);

	if (!hasMounted || loading) {
		return (
			<div className="flex gap-1 ml-auto">
				<LanguageSelector triggerColor="white" />
			</div>
		);
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
						href="/auth/magic-link"
						iconLeft={<IconAccountCircle color="white" />}
						className="hidden md:flex"
					/>
					<ButtonIcon
						icon={<IconAccountCircle color="white" />}
						className="flex md:hidden"
						onClick={() => router.push('/auth/magic-link')}
					/>
				</>
			)}
		</div>
	);
}
