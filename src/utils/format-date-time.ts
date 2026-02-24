export function formatDate(
	dateString: string | null,
	locale: string,
): string | null {
	if (!dateString) return null;

	const date = new Date(dateString + 'T00:00:00');

	return new Intl.DateTimeFormat(locale, {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).format(date);
}

export function formatTime(
	timeString: string | null,
	locale: string,
): string | null {
	if (!timeString) return null;

	// quitar segundos si existen
	const cleanTime = timeString.slice(0, 5); // HH:mm

	const [hours, minutes] = cleanTime.split(':');

	const date = new Date();
	date.setHours(Number(hours));
	date.setMinutes(Number(minutes));

	return new Intl.DateTimeFormat(locale, {
		hour: '2-digit',
		minute: '2-digit',
	}).format(date);
}
