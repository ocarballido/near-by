'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';

import ButtonIcon from '@/components/atoms/button-icon';
import ButtonLink from '../button-link';
import { useTranslations } from 'next-intl';
import Typography from '@/components/atoms/typography';
import IconClose from '@/components/atoms/icon/close';
import IconAccountCircle from '@/components/atoms/icon/account-circle';
import IconNewRelease from '@/components/atoms/icon/new-releases';

const LS_KEY = 'public_banner_dismissed_at';

function getExamplePropertyId(): string {
	return (process.env.NEXT_PUBLIC_EXAMPLE_PROPERTY_ID ?? '').trim();
}

function getDismissTtlDays(): number {
	const raw = process.env.NEXT_PUBLIC_PUBLIC_BANNER_DISMISS_TTL_DAYS;
	const parsed = raw ? Number(raw) : NaN;
	if (!Number.isFinite(parsed) || parsed <= 0) return 7;
	return Math.min(parsed, 90);
}

function wasDismissedWithin(ttlMs: number): boolean {
	try {
		const raw = localStorage.getItem(LS_KEY);
		if (!raw) return false;
		const dismissedAt = Number(raw);
		if (!Number.isFinite(dismissedAt)) return false;
		return Date.now() - dismissedAt < ttlMs;
	} catch {
		return false;
	}
}

function setDismissedNow() {
	try {
		localStorage.setItem(LS_KEY, String(Date.now()));
	} catch {}
}

type Props = {
	authHref?: string;
	isLoggedIn: boolean;
};

export default function PublicPageBanner({
	authHref = '/auth',
	isLoggedIn,
}: Props) {
	const t = useTranslations('PublicPageBanner');
	const pathname = usePathname();

	const [isDismissed, setIsDismissed] = useState(true);

	const examplePropertyId = useMemo(() => getExamplePropertyId(), []);
	const ttlDays = useMemo(() => getDismissTtlDays(), []);
	const ttlMs = useMemo(() => ttlDays * 24 * 60 * 60 * 1000, [ttlDays]);

	const isExamplePage = useMemo(() => {
		if (!examplePropertyId) return false;
		if (!pathname) return false;
		return pathname.includes(examplePropertyId);
	}, [pathname, examplePropertyId]);

	useEffect(() => {
		if (isExamplePage) {
			setIsDismissed(false);
			return;
		}
		setIsDismissed(wasDismissedWithin(ttlMs));
	}, [ttlMs, isExamplePage]);

	const handleClose = useCallback(() => {
		setDismissedNow();
		setIsDismissed(true);
	}, []);

	if (isLoggedIn) return null;

	if (!isExamplePage && isDismissed) return null;

	const message = isExamplePage ? t('messageExample') : t('messageTenant');

	return (
		<div className="w-full flex flex-col md:flex-row py-3 px-3 bg-primary-500 items-center justify-between gap-3 shadow-sm relative">
			<div className="flex gap-2 justify-center">
				<div className="shrink-0 mt-0.5">
					<IconNewRelease color="white" />
				</div>
				<Typography
					component="h2"
					color="text-white"
					size="base"
					weight="semibold"
				>
					{message}
				</Typography>
			</div>
			<div className="flex gap-1 items-center flex-wrap shrink-0">
				<ButtonLink
					label={t('cta')}
					href={authHref}
					color="white"
					className="py-1! pr-3.5! pl-3!"
					iconLeft={<IconAccountCircle />}
				/>

				{!isExamplePage && (
					<ButtonIcon
						size="small"
						color="white"
						icon={<IconClose size={20} />}
						onClick={handleClose}
						aria-label={t('closeAriaLabel')}
					/>
				)}
			</div>
		</div>
	);
}
