'use client';

import { useLocale } from 'next-intl';
import { useDropdown } from '@/hooks/useDropdown';
import { usePathname, Link } from '@/i18n/routing';
import clsx from 'clsx';

import { LOCALES } from '@/config/config-constants';

import Button from '../button';
import IconKeyboardArrowDown from '@/components/atoms/icon/keyboard-arrow-down';
import DropdownMenu from '@/components/atoms/dropdown-menu';

const LanguageSelector: React.FC = () => {
	const pathname = usePathname();
	const locale = useLocale();

	const { open, toggleDropdown, dropdownRef } = useDropdown();

	return (
		<div ref={dropdownRef} className="relative">
			<Button
				className="shrink-0"
				color="primary"
				iconRight={<IconKeyboardArrowDown />}
				label={locale.toUpperCase()}
				onClick={toggleDropdown}
			/>
			<DropdownMenu open={open} className="absolute z-50 right-0 top-11">
				{LOCALES.map((language: string) => {
					const languageStyles = clsx({
						'bg-primary-50 text-primary-500': locale === language,
					});

					return (
						<Link
							href={pathname}
							key={language}
							locale={language}
							className={`rounded-sm w-full transition-all flex items-center gap-2 hover:bg-primary-50 hover:text-primary-500 hover:cursor-pointer font-medium font-sm py-2 px-3 shrink-0 ${languageStyles}`}
						>
							{language.toUpperCase()}
						</Link>
					);
				})}
			</DropdownMenu>
		</div>
	);
};

export default LanguageSelector;
