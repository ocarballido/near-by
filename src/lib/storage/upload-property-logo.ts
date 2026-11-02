import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types";
import { MAX_LOGO_SIZE } from "@/config/config-constants";
import { uploadPublicImage } from "@/lib/storage/upload-public-image";

export type UploadPropertyLogoResult =
    | { ok: true; logoUrl: string | null }
    | { ok: false; errorState: { errors: { logo: string[] } } };

// Sin GIF: el logo es un asset estático de marca, no contenido de galería
const VALID_LOGO_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export async function uploadPropertyLogo(args: {
    db: SupabaseClient<Database>;
    userId: string;
    logoFile: File | null;
}): Promise<UploadPropertyLogoResult> {
    const { db, userId, logoFile } = args;

    if (!logoFile || logoFile.size <= 0) {
        return { ok: true, logoUrl: null };
    }

    // MAX_LOGO_SIZE debe coincidir con file_size_limit del bucket property-logos
    const res = await uploadPublicImage({
        db,
        bucket: "property-logos",
        userId,
        prefix: "logo",
        file: logoFile,
        maxSize: MAX_LOGO_SIZE,
        allowedMimeTypes: VALID_LOGO_TYPES,
    });

    if (res.ok) return { ok: true, logoUrl: res.publicUrl };

    // Claves de messages/*.json: las traduce el formulario ({kb} y {got} los
    // pone él con MAX_LOGO_SIZE y el tamaño del fichero)
    const errorKeys = {
        too_large: "propertyLogoTooLarge",
        invalid_format: "propertyLogoInvalidFormat",
        upload_failed: "propertyLogoUploadError",
    };

    return {
        ok: false,
        errorState: { errors: { logo: [errorKeys[res.reason]] } },
    };
}
