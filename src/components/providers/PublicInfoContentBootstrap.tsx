'use client';

import { useEffect } from 'react';
import { usePublicSidebarData } from '@/lib/context/EditPublicMenuContext';

type Props = {
	hasInfoContent: boolean;
};

export default function PublicInfoContentBootstrap({ hasInfoContent }: Props) {
	const { setHasInfoContent } = usePublicSidebarData();

	useEffect(() => {
		setHasInfoContent(hasInfoContent);
	}, [hasInfoContent, setHasInfoContent]);

	return null;
}
