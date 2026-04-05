'use client';

import { useEffect } from 'react';
import { usePublicSidebarData } from '@/lib/context/EditPublicMenuContext';

type Props = {
	counts: Record<string, number>;
};

export default function PublicCountsBootstrap({ counts }: Props) {
	const { setSubCategoryCounts } = usePublicSidebarData();

	useEffect(() => {
		setSubCategoryCounts(counts);
	}, [counts, setSubCategoryCounts]);

	return null;
}
