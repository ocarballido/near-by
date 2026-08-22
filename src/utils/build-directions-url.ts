import { GOOGLE_MAPS_DIRECTION_URL } from "@/config/config-constants";

export function buildDirectionsUrl(lat: number, lng: number): string {
    return `${GOOGLE_MAPS_DIRECTION_URL}${lat},${lng}`;
}
