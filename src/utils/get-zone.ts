export function getDisplayZoneFromString(address: string | null): string {
	if (!address) return '';

	const parts = address.split(',').map((p) => p.trim());

	const cpIndex = parts.findIndex((p) => /^\d{4,5}\s/.test(p));

	if (cpIndex !== -1) {
		const city = parts[cpIndex].replace(/^\d{4,5}\s+/, '');

		// Buscar el distrito: la primera parte entre índice 1 y cpIndex-1
		// que no sea solo un número (para ignorar el número de portal)
		const district =
			parts.slice(1, cpIndex).find((p) => !/^\d+$/.test(p)) ?? null;

		return district ? `${district}, ${city}` : city;
	}

	if (parts.length >= 2) {
		return parts[parts.length - 2];
	}

	return address;
}
