'use client';

import { useTranslations } from 'next-intl';
import { useGlobal } from '@/lib/context/GlobalContext';

const Welcome = () => {
	const t = useTranslations();
	const { loading, user } = useGlobal();

	return (
		<div className="relative flex flex-col justify-center items-center gap-4 bg-white">
			<h2 className="font-bold text-primary-500 text-3xl text-center font-heading">
				{t('Bienvenido')}
			</h2>
			<h3 className="font-bold text-md text-center bg-primary-100 py-2 px-6 rounded-full">
				{loading ? '...' : user?.email?.split('@')[0] + ' 👋'}
			</h3>
		</div>
	);
};

export default Welcome;
