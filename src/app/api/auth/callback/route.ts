import { NextResponse } from "next/server";
import { createSSRSassClient } from "@/lib/supabase/server";

const DEFAULT_REDIRECT = "/app/properties";

/**
 * Solo permite redirects relativos dentro de la propia app.
 * Bloquea URLs absolutas y protocol-relative ("//evil.com") para
 * prevenir open redirect a través del parámetro `redirect`, que
 * viaja en la URL pública del email y por tanto no es de confianza.
 */
function resolveSafeRedirect(rawRedirect: string | null): string {
    if (!rawRedirect) return DEFAULT_REDIRECT;

    let decoded: string;
    try {
        decoded = decodeURIComponent(rawRedirect);
    } catch {
        return DEFAULT_REDIRECT;
    }

    const isRelativePath = decoded.startsWith("/") && !decoded.startsWith("//");
    return isRelativePath ? decoded : DEFAULT_REDIRECT;
}

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const destination = resolveSafeRedirect(
        requestUrl.searchParams.get("redirect"),
    );

    if (code) {
        const supabase = await createSSRSassClient();
        const client = supabase.getSupabaseClient();

        await supabase.exchangeCodeForSession(code);

        const { data: aal, error: aalError } =
            await client.auth.mfa.getAuthenticatorAssuranceLevel();

        if (aalError) {
            console.error("Error checking MFA status:", aalError);
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }

        if (aal.nextLevel === "aal2" && aal.nextLevel !== aal.currentLevel) {
            // Propagamos el destino original para que, tras completar el
            // segundo factor, el usuario siga acabando donde se esperaba.
            const twoFaUrl = new URL("/auth/2fa", request.url);
            twoFaUrl.searchParams.set("redirect", destination);
            return NextResponse.redirect(twoFaUrl);
        }

        return NextResponse.redirect(new URL(destination, request.url));
    }

    return NextResponse.redirect(new URL("/auth/login", request.url));
}
