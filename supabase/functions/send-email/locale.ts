export function extractLocale(redirectTo: string): string | null {
    try {
        const url = new URL(redirectTo);

        // 1) Nivel superior: ?locale=es
        const topLevel = url.searchParams.get("locale");
        if (topLevel) return topLevel;

        // 2) Fallback: dentro de un ?redirect=... anidado y urlencoded
        const nestedRedirect = url.searchParams.get("redirect");
        if (nestedRedirect) {
            const nestedParams = new URLSearchParams(
                decodeURIComponent(nestedRedirect).split("?")[1] ?? "",
            );
            return nestedParams.get("locale");
        }

        return null;
    } catch {
        return null;
    }
}
