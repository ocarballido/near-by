import tips from './seasonal-tips.json' assert { type: 'json' };

type TipText = { es: string; en: string; fr: string };

type Tip = {
	id: string;
	type: 'fixed' | 'dynamic';
	month?: number;
	week?: number;
	anchor?: string;
	offset_days?: number;
	title: TipText;
	emoji: string;
	text: TipText;
};

function calculateEaster(year: number): Date {
	const a = year % 19;
	const b = Math.floor(year / 100);
	const c = year % 100;
	const d = Math.floor(b / 4);
	const e = b % 4;
	const f = Math.floor((b + 8) / 25);
	const g = Math.floor((b - f + 1) / 3);
	const h = (19 * a + b - d - g + 15) % 30;
	const i = Math.floor(c / 4);
	const k = c % 4;
	const l = (32 + 2 * e + 2 * i - h - k) % 7;
	const m = Math.floor((a + 11 * h + 22 * l) / 451);
	const month = Math.floor((h + l - 7 * m + 114) / 31);
	const day = ((h + l - 7 * m + 114) % 31) + 1;
	return new Date(year, month - 1, day);
}

function addDays(date: Date, days: number): Date {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

function getAnchorDate(anchor: string, year: number): Date {
	if (anchor === 'easter') return calculateEaster(year);
	if (anchor === 'halloween') return new Date(year, 9, 31); // 31 oct
	return new Date(year, 0, 1);
}

function getWeek(day: number): number {
	return day <= 14 ? 1 : 2;
}

export function getSeasonalTip(
	date: Date,
	locale: 'es' | 'en' | 'fr' = 'es',
): {
	title: string;
	emoji: string;
	text: string;
} | null {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const week = getWeek(date.getDate());

	const allTips = tips as Tip[];

	// Primero buscamos tips dinámicos
	const dynamicTip = allTips
		.filter((t) => t.type === 'dynamic')
		.find((t) => {
			const anchor = getAnchorDate(t.anchor!, year);
			const activation = addDays(anchor, t.offset_days!);
			const expiration = addDays(anchor, (t.offset_days ?? 0) + 14);
			return date >= activation && date <= expiration;
		});

	if (dynamicTip) {
		return {
			title: dynamicTip.title[locale],
			emoji: dynamicTip.emoji,
			text: dynamicTip.text[locale],
		};
	}

	// Si no, buscamos por mes y semana
	const fixedTip = allTips.find(
		(t) => t.type === 'fixed' && t.month === month && t.week === week,
	);

	if (!fixedTip) return null;

	return {
		title: fixedTip.title[locale],
		emoji: fixedTip.emoji,
		text: fixedTip.text[locale],
	};
}
