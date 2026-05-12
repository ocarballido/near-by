import type { IntentType } from './intents';
import { INTENTS } from './intents';

export interface PropertyDataRow {
	description: string | null;
	name: string | null;
	type: string;
	sub_category_id: string;
	featured?: boolean | null;
	must_visit?: boolean | null;
}

export interface PropertySchedule {
	check_in_time: string | null;
	check_in_date: string | null;
	check_out_time: string | null;
	check_out_date: string | null;
}

export interface ChatbotMessages {
	infoNotFound: string;
	locationsNotFound: string;
	locationsPrefix: string;
	fallback: string;
	scheduleNotFound: string;
	checkIn: string;
	checkOut: string;
	featuredNotFound: string;
	mustVisitNotFound: string;
	featuredPrefix: string;
	mustVisitPrefix: string;
}

function buildScheduleResponse(
	schedule: PropertySchedule,
	messages: ChatbotMessages,
): string | null {
	const { check_in_time, check_in_date, check_out_time, check_out_date } =
		schedule;

	if (
		!check_in_time &&
		!check_out_time &&
		!check_in_date &&
		!check_out_date
	) {
		return null;
	}

	const lines: string[] = [];

	if (check_in_time || check_in_date) {
		const parts = [check_in_date, check_in_time]
			.filter(Boolean)
			.join(' · ');
		lines.push(`${messages.checkIn}: ${parts}`);
	}

	if (check_out_time || check_out_date) {
		const parts = [check_out_date, check_out_time]
			.filter(Boolean)
			.join(' · ');
		lines.push(`${messages.checkOut}: ${parts}`);
	}

	return lines.join('\n');
}

function buildInfoResponse(
	rows: PropertyDataRow[],
	messages: ChatbotMessages,
): string {
	const row = rows[0];
	if (!row?.description) return messages.infoNotFound;
	return row.description;
}

function buildLocationResponse(
	rows: PropertyDataRow[],
	messages: ChatbotMessages,
): string {
	if (rows.length === 0) return messages.locationsNotFound;

	const names = rows
		.filter((r) => r.name)
		.map((r) => `• ${r.name}`)
		.join('\n');

	return `${messages.locationsPrefix}\n\n${names}`;
}

function buildFlaggedLocationResponse(
	rows: PropertyDataRow[],
	intentType: 'FEATURED' | 'MUST_VISIT',
	messages: ChatbotMessages,
): string {
	if (rows.length === 0) {
		return intentType === 'FEATURED'
			? messages.featuredNotFound
			: messages.mustVisitNotFound;
	}

	const prefix =
		intentType === 'FEATURED'
			? messages.featuredPrefix
			: messages.mustVisitPrefix;

	const names = rows
		.filter((r) => r.name)
		.map((r) => `• ${r.name}`)
		.join('\n');

	return `${prefix}\n\n${names}`;
}

export function buildResponse(
	intentType: IntentType | null,
	rows: PropertyDataRow[],
	messages: ChatbotMessages,
	schedule?: PropertySchedule,
): string {
	if (intentType === null) return messages.fallback;

	if (intentType === 'FEATURED' || intentType === 'MUST_VISIT') {
		return buildFlaggedLocationResponse(rows, intentType, messages);
	}

	const intent = INTENTS[intentType];

	if (intentType === 'SCHEDULE' && schedule) {
		const scheduleResponse = buildScheduleResponse(schedule, messages);
		if (scheduleResponse) return scheduleResponse;
	}

	if (intent.kind === 'info') return buildInfoResponse(rows, messages);
	return buildLocationResponse(rows, messages);
}
