export async function fetchPropertyTimezone(
    lat: number,
    lng: number,
): Promise<string | null> {
    if (
        typeof lat !== "number" ||
        typeof lng !== "number" ||
        isNaN(lat) ||
        isNaN(lng) ||
        lat < -90 ||
        lat > 90 ||
        lng < -180 ||
        lng > 180
    ) {
        return null;
    }

    try {
        const url = new URL("https://api.open-meteo.com/v1/forecast");
        url.searchParams.set("latitude", String(lat));
        url.searchParams.set("longitude", String(lng));
        url.searchParams.set("current", "temperature_2m");
        url.searchParams.set("timezone", "auto");
        url.searchParams.set("forecast_days", "1");

        const res = await fetch(url.toString(), {
            next: { revalidate: 2592000 }, // 30 días — el timezone de una propiedad no cambia
        });

        if (!res.ok) return null;

        const data = await res.json();

        if (!data?.timezone) return null;

        return data.timezone as string;
    } catch {
        return null;
    }
}
