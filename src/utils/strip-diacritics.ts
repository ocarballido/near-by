// Quita las tildes y demás marcas: "Niños" → "Ninos", "été" → "ete".
// NFD separa cada letra acentuada en su base más la marca combinante, que
// después se elimina. Lo usan el buscador de categorías y el chatbot
const COMBINING_MARKS = /[\u0300-\u036f]/g;

export function stripDiacritics(text: string): string {
    return text.normalize("NFD").replace(COMBINING_MARKS, "");
}
