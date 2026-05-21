import type { EditInitialValues } from './index';

type FormValues = {
	name: string;
	address: string;
	latitude: string;
	longitude: string;
	checkInDate: string;
	checkInTime: string;
	checkOutDate: string;
	checkOutTime: string;
	accessInstructions: string;
};

const toHHmm = (v: string | null) => (v ? v.slice(0, 5) : '');

export function getPropertyFormDefaultValues(
	isEdit: boolean,
	initialValues?: EditInitialValues,
): FormValues {
	if (!isEdit || !initialValues) {
		return {
			name: '',
			address: '',
			latitude: '',
			longitude: '',
			checkInDate: '',
			checkInTime: '',
			checkOutDate: '',
			checkOutTime: '',
			accessInstructions: '',
		};
	}

	return {
		name: initialValues.name ?? '',
		address: initialValues.address ?? '',
		latitude:
			initialValues.latitude !== null &&
			initialValues.latitude !== undefined
				? String(initialValues.latitude)
				: '',
		longitude:
			initialValues.longitude !== null &&
			initialValues.longitude !== undefined
				? String(initialValues.longitude)
				: '',
		checkInDate: initialValues.check_in_date ?? '',
		checkInTime: toHHmm(initialValues.check_in_time),
		checkOutDate: initialValues.check_out_date ?? '',
		checkOutTime: toHHmm(initialValues.check_out_time),
		accessInstructions: initialValues.access_instructions ?? '',
	};
}
