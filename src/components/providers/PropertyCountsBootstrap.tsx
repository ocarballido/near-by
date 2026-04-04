'use client';

import { useEffect } from 'react';
import { useSidebarData } from '@/lib/context/EditMenuContext';

type Props = {
	counts: Record<string, number>;
};

export default function PropertyCountsBootstrap({ counts }: Props) {
	const { setSubCategoryCounts } = useSidebarData();

	useEffect(() => {
		setSubCategoryCounts(counts);
	}, [counts, setSubCategoryCounts]);

	return null;
}
