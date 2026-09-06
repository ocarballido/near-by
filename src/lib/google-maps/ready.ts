"use client";

// Puerto fiel del bootstrap loader oficial de Google para "Dynamic
// Library Import", documentado en:
// https://developers.google.com/maps/documentation/javascript/load-maps-js-api
//
// Cargar la URL de la API directamente como <script src="..."> (lo que
// hacía la versión anterior de este archivo) NUNCA instala
// `google.maps.importLibrary` — ese método está pensado para <gmp-map>,
// no para llamadas a importLibrary(). Este bootstrap es el único
// mecanismo oficial que sí lo instala.

let bootstrapInstalled = false;

function installGoogleMapsBootstrapLoader(apiKey: string): void {
    if (bootstrapInstalled) return;
    bootstrapInstalled = true;

    (function (bootstrapParams: Record<string, unknown>) {
        let scriptLoadPromise: Promise<void> | undefined;
        const requestedLibraries = new Set<string>();

        const googleNs = ((window as any).google ??= {});
        const mapsNs = (googleNs.maps ??= {});

        const ensureScriptLoading = (): Promise<void> =>
            scriptLoadPromise ??
            (scriptLoadPromise = new Promise<void>((resolve, reject) => {
                const script = document.createElement("script");
                const params = new URLSearchParams();

                params.set("libraries", [...requestedLibraries].join(","));
                for (const key in bootstrapParams) {
                    params.set(
                        key.replace(/[A-Z]/g, (c) => `_${c[0].toLowerCase()}`),
                        String(bootstrapParams[key]),
                    );
                }
                params.set("callback", "google.maps.__ib__");

                script.src = `https://maps.googleapis.com/maps/api/js?${params}`;
                mapsNs.__ib__ = resolve;
                script.onerror = () =>
                    reject(
                        new Error(
                            "The Google Maps JavaScript API could not load.",
                        ),
                    );
                // Reenvía el nonce de CSP si vuestro proyecto usa uno —
                // el propio snippet oficial de Google contempla este caso.
                script.nonce =
                    document.querySelector<HTMLScriptElement>("script[nonce]")
                        ?.nonce ?? "";
                document.head.append(script);
            }));

        if (mapsNs.importLibrary) {
            console.warn(
                "The Google Maps JavaScript API only loads once. Ignoring:",
                bootstrapParams,
            );
            return;
        }

        mapsNs.importLibrary = (libraryName: string, ...rest: unknown[]) => {
            requestedLibraries.add(libraryName);
            return ensureScriptLoading().then(() =>
                mapsNs.importLibrary(libraryName, ...rest),
            );
        };
    })({
        key: apiKey,
        v: "weekly",
    });
}

export function waitForGoogleMapsReady(): Promise<void> {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        return Promise.reject(
            new Error("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"),
        );
    }

    installGoogleMapsBootstrapLoader(apiKey);

    return Promise.resolve();
}
