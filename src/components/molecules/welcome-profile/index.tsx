'use client';

import { useTranslations } from 'next-intl';
import { useGlobal } from '@/lib/context/GlobalContext';

const WelcomeProfile = () => {
	const t = useTranslations();

	const { user } = useGlobal();

	return (
		<>
			<div className="flex flex-col gap-0 w-full max-w-[360px]">
				<h1 className="font-heading font-bold text-lg mb-2 text-primary-500">
					{t('Datos personales')}
				</h1>
				<h2 className="font-bold text-sm mb-2">Email</h2>
				<p className="bg-primary-100 text-primary-700 py-1 px-3 text-sm rounded-md w-fit font-medium">
					{!user ? '...' : user?.email}
				</p>
			</div>
		</>
	);
};

export default WelcomeProfile;
