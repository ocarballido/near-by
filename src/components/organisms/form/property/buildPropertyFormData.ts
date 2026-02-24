type BuildArgs = {
	isEdit: boolean;
	locale: string;
	selectedSeedInfoIds: string[];

	data: {
		name: string;
		address: string;
		latitude: string;
		longitude: string;
		checkInDate: string;
		checkInTime: string;
		checkOutDate: string;
		checkOutTime: string;
		image?: FileList;
	};
};

export function buildPropertyFormData({
	isEdit,
	locale,
	selectedSeedInfoIds,
	data,
}: BuildArgs): FormData {
	const fd = new FormData();

	fd.append('name', data.name);

	// En create: address + coords + seed + locale
	if (!isEdit) {
		fd.append('address', data.address);
		fd.append('latitude', data.latitude);
		fd.append('longitude', data.longitude);
		fd.append('locale', locale);
		fd.append('seedInfoIds', JSON.stringify(selectedSeedInfoIds));
	}

	// Fechas/horas (si vienen vacías, mandamos '')
	fd.append('check_in_date', data.checkInDate ?? '');
	fd.append('check_in_time', data.checkInTime ?? '');
	fd.append('check_out_date', data.checkOutDate ?? '');
	fd.append('check_out_time', data.checkOutTime ?? '');

	const file = data.image?.[0];
	if (file) fd.append('image', file);

	return fd;
}
