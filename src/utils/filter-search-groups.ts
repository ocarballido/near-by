// Filtro del buscador de grupos (p. ej. categorías → subcategorías).
// Regla: cada palabra de la búsqueda debe ser el inicio de alguna palabra
// de la etiqueta del item o de la de su grupo, sin distinguir mayúsculas
// ni acentos ("ninos" encuentra "Niños", "comida rap" "Comida rápida").
// Por eso, si la búsqueda coincide con el nombre del grupo, se muestran
// todos sus items. Los grupos sin items que coincidan desaparecen.

import { stripDiacritics } from "@/utils/strip-diacritics";

// Solo con la forma mínima: sirve para cualquier modelo que la cumpla
type SearchableGroup = {
    label?: string;
    items: { label: string }[];
};

// Sin tildes con stripDiacritics, como el chatbot. En las etiquetas del
// catálogo (5 idiomas) solo quedan como signos espacios, guiones y
// apóstrofos, que actúan de separadores
const SEPARATORS = /[^a-z0-9]+/;
const SEPARATORS_GLOBAL = /[^a-z0-9]+/g;

function normalize(text: string): string {
    return stripDiacritics(text.toLowerCase());
}

function splitWords(normalized: string): string[] {
    return normalized.split(SEPARATORS).filter(Boolean);
}

// Las partes sueltas ("wi", "fi") y cada trozo entre espacios sin signos
// ("wifi"), para que "wifi" encuentre "Wi-Fi"
function getLabelWords(label: string): string[] {
    const normalized = normalize(label);
    const compactChunks = normalized
        .split(/\s+/)
        .map((chunk) => chunk.replace(SEPARATORS_GLOBAL, ""))
        .filter(Boolean);

    return [...splitWords(normalized), ...compactChunks];
}

export function filterSearchGroups<TGroup extends SearchableGroup>(
    groups: TGroup[],
    query: string,
): TGroup[] {
    const queryWords = splitWords(normalize(query));
    if (queryWords.length === 0) return [];

    return groups.flatMap((group) => {
        const groupWords = group.label ? getLabelWords(group.label) : [];

        const items = group.items.filter((item) => {
            const words = [...groupWords, ...getLabelWords(item.label)];
            return queryWords.every((queryWord) =>
                words.some((word) => word.startsWith(queryWord)),
            );
        });

        return items.length > 0 ? [{ ...group, items }] : [];
    });
}
