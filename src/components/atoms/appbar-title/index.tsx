'use client';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

import { pageTitleMapped } from '@/utils/page-title-mapped';

const AppbarTitle = () => {
	const t = useTranslations();

	const pathname = usePathname();
	const locale = useLocale();

	const withPageTitle = useMemo(
		() => pageTitleMapped(pathname, locale),
		[pathname, locale]
	);

	return (
		withPageTitle.showTitle && (
			<h2 className="font-heading font-bold uppercase text-white grow-0 text-sm">
				{t(withPageTitle.title)}
			</h2>
		)
	);
};

export default AppbarTitle;
