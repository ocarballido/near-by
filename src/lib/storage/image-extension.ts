// La extensión del fichero en Storage sale del tipo MIME ya validado, nunca
// del nombre que envía el cliente (podría colar "/" o ".." en la ruta).
// Map y no objeto literal: un tipo como "constructor" o "__proto__" no debe
// resolverse a nada heredado de Object.prototype.
const EXTENSION_BY_MIME_TYPE = new Map<string, string>([
	['image/jpeg', 'jpg'],
	['image/png', 'png'],
	['image/webp', 'webp'],
	['image/gif', 'gif'],
]);

export function imageExtensionFromMimeType(mimeType: string): string | null {
	return EXTENSION_BY_MIME_TYPE.get(mimeType) ?? null;
}
