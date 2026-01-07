'use client';

import { useGlobal } from '@/lib/context/GlobalContext';

const Welcome = () => {
	const { loading, user } = useGlobal();

	return (
		<div className="relative flex flex-col justify-center items-center gap-4 bg-white">
			<h3 className="font-bold text-md text-center bg-primary-100 py-2 px-6 rounded-full">
				{loading ? '...' : user?.email?.split('@')[0] + ' 👋'}
			</h3>
		</div>
	);
};

export default Welcome;
