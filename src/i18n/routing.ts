import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
import { DEFAULT_LOCALE, LOCALES } from '@/config/config-constants';

export const routing = defineRouting({
	// A list of all locales that are supported
	locales: LOCALES,

	// Used when no locale matches
	defaultLocale: DEFAULT_LOCALE,
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
	createNavigation(routing);
