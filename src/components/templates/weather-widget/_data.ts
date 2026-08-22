// components/templates/weather-widget/_data.ts

const WMO_ICONS: Record<number, string> = {
    // Despejado
    0: "clear-day",

    // Parcialmente nublado
    1: "partly-cloudy-day",
    2: "partly-cloudy-day",
    3: "overcast",

    // Niebla
    45: "fog",
    48: "fog",

    // Llovizna
    51: "drizzle",
    53: "drizzle",
    55: "drizzle",

    // Llovizna engelante
    56: "sleet",
    57: "sleet",

    // Lluvia
    61: "rain",
    63: "rain",
    65: "rain",

    // Lluvia engelante
    66: "sleet",
    67: "sleet",

    // Nieve
    71: "snow",
    73: "snow",
    75: "snow",

    // Granos de nieve
    77: "snow",

    // Chubascos de lluvia
    80: "rain",
    81: "rain",
    82: "thunderstorms-rain",

    // Chubascos de nieve
    85: "snow",
    86: "snow",

    // Granizo
    96: "hail",
    99: "hail",

    // Tormentas
    95: "thunderstorms",
};

const getIcon = (code: number): string => WMO_ICONS[code] ?? "overcast";

const WEEKDAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export type WeatherDay = {
    date: string;
    weekdayIndex: number;
    icon: string;
    maxTemp: number;
    minTemp: number;
    precipitationProbability: number;
};

export type WeatherData = {
    currentTemp: number;
    currentIcon: string;
    currentPrecipitation: number;
    timezone: string;
    days: WeatherDay[];
};

export async function fetchWeather(
    lat: number,
    lng: number,
): Promise<WeatherData | null> {
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
        url.searchParams.set("current", "temperature_2m,weathercode");
        url.searchParams.set(
            "daily",
            "temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max",
        );
        url.searchParams.set("timezone", "auto");
        url.searchParams.set("forecast_days", "7");

        const res = await fetch(url.toString(), {
            next: { revalidate: 3600 },
        });

        if (!res.ok) return null;

        const data = await res.json();

        if (
            !data?.current?.temperature_2m ||
            !data?.daily?.time?.length ||
            !data?.timezone
        ) {
            return null;
        }

        const currentTemp = Math.round(data.current.temperature_2m);
        const currentIcon = getIcon(data.current.weathercode);
        const currentPrecipitation =
            data.daily.precipitation_probability_max?.[0] ?? 0;

        const days: WeatherDay[] = data.daily.time.map(
            (date: string, i: number) => ({
                date,
                weekdayIndex: new Date(`${date}T12:00:00`).getDay(),
                icon: getIcon(data.daily.weathercode[i]),
                maxTemp: Math.round(data.daily.temperature_2m_max[i]),
                minTemp: Math.round(data.daily.temperature_2m_min[i]),
                precipitationProbability:
                    data.daily.precipitation_probability_max?.[i] ?? 0,
            }),
        );

        return {
            currentTemp,
            currentIcon,
            currentPrecipitation,
            timezone: data.timezone,
            days,
        };
    } catch {
        return null;
    }
}
