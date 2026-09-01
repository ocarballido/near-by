"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types";
import { MAX_LOGO_SIZE } from "@/config/config-constants";

export type UploadPropertyLogoResult =
    | { ok: true; logoUrl: string | null }
    | { ok: false; errorState: { errors: { logo: string[] } } };

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

    // Validar tamaño (debe coincidir con file_size_limit del bucket property-logos)
    if (logoFile.size > MAX_LOGO_SIZE) {
        return {
            ok: false,
            errorState: {
                errors: {
                    logo: [
                        `El logo no debe superar los ${(
                            MAX_LOGO_SIZE / 1024
                        ).toFixed(0)} KB. Tamaño actual: ${(
                            logoFile.size / 1024
                        ).toFixed(2)} KB`,
                    ],
                },
            },
        };
    }

    // Validar tipo (sin GIF: el logo es un asset estático de marca, no contenido de galería)
    if (
        !VALID_LOGO_TYPES.includes(
            logoFile.type as (typeof VALID_LOGO_TYPES)[number],
        )
    ) {
        return {
            ok: false,
            errorState: {
                errors: {
                    logo: ["El archivo debe ser una imagen (JPEG, PNG o WebP)"],
                },
            },
        };
    }

    const fileExt = logoFile.name.split(".").pop() ?? "png";
    const fileName = `${userId}/logo_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await db.storage
        .from("property-logos")
        .upload(fileName, logoFile, {
            cacheControl: "3600",
            upsert: false,
        });

    if (uploadError) {
        console.error("Error al subir logo:", uploadError);
        return {
            ok: false,
            errorState: {
                errors: {
                    logo: [
                        "Error al subir el logo. Por favor, inténtalo de nuevo.",
                    ],
                },
            },
        };
    }

    const {
        data: { publicUrl },
    } = db.storage.from("property-logos").getPublicUrl(fileName);

    return { ok: true, logoUrl: publicUrl };
}
