export function formatRelativeDays(iso: string, locale: string) {
	const date = new Date(iso);
	const now = new Date();

	const diffMs = date.getTime() - now.getTime();
	const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

	return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(
		diffDays,
		'day',
	);
}
