export function getDisplayZoneFromString(address: string | null): string {
	if (!address) return '';

	const parts = address.split(',').map((p) => p.trim());

	// Buscamos el índice que contiene el código postal (4-5 dígitos al inicio)
	const cpIndex = parts.findIndex((p) => /^\d{4,5}\s/.test(p));

	if (cpIndex !== -1) {
		// Parte con CP: "28017 Madrid" → quitamos el CP
		const city = parts[cpIndex].replace(/^\d{4,5}\s+/, '');

		// Si hay algo entre la calle y el CP, es el barrio/distrito
		const district = cpIndex > 1 ? parts[cpIndex - 1] : null;

		return district ? `${district}, ${city}` : city;
	}

	// Fallback para formatos sin CP (pueblos pequeños, algunos países)
	// "Calle Mayor, Torrevieja, España" → "Torrevieja"
	if (parts.length >= 2) {
		return parts[parts.length - 2]; // penúltimo = ciudad/pueblo, último = país
	}

	return address;
}
