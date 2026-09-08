import { GOOGLE_MAPS_DIRECTION_URL } from "@/config/config-constants";

export interface PropertyDataRow {
    description: string | null;
    name: string | null;
    type: string;
    sub_category_id: string;
    featured?: boolean | null;
    must_visit?: boolean | null;
    address?: string | null;
    latitude?: number | null;
    longitude?: number | null;
}

export interface PropertyDataRow {
    description: string | null;
    name: string | null;
    type: string;
    sub_category_id: string;
    featured?: boolean | null;
    must_visit?: boolean | null;
}

export interface PropertySchedule {
    check_in_time: string | null;
    check_in_date: string | null;
    check_out_time: string | null;
    check_out_date: string | null;
}

export interface PropertyDetailRow {
    name: string;
    guidelines: string | null;
    instructions: string | null;
}

export interface ChatbotMessages {
    infoNotFound: string;
    locationsNotFound: string;
    locationsPrefix: string;
    fallback: string;
    scheduleNotFound: string;
    checkIn: string;
    checkOut: string;
    featuredNotFound: string;
    mustVisitNotFound: string;
    featuredPrefix: string;
    mustVisitPrefix: string;
}

export type ResponseKind =
    | "info"
    | "location"
    | "schedule"
    | "featured"
    | "must_visit"
    | "detail";

// Nueva función — usa coordenadas si existen (más preciso), o la
// dirección como respaldo. Nunca la genera el LLM: aquí es el único sitio
// del código que construye URLs de Maps.
function buildMapsUrl(row: PropertyDataRow): string | null {
    if (row.latitude != null && row.longitude != null) {
        return `${GOOGLE_MAPS_DIRECTION_URL}${row.latitude},${row.longitude}`;
    }
    if (row.address) {
        return `${GOOGLE_MAPS_DIRECTION_URL}${encodeURIComponent(row.address)}`;
    }
    return null;
}

// Para la vía narrada por LLM (generateGroundedReply): un pie de página
// con los enlaces de los lugares que se le pasaron como hechos, ya que su
// texto libre no se puede trocear de forma fiable por lugar mencionado.
export function buildMapsFooter(rows: PropertyDataRow[]): string {
    const lines = rows
        .filter((r) => r.name)
        .map((r) => {
            const url = buildMapsUrl(r);
            return url ? `📍 ${r.name}: ${url}` : null;
        })
        .filter((l): l is string => l !== null);

    return lines.length > 0 ? `\n\n${lines.join("\n")}` : "";
}

function buildScheduleResponse(
    schedule: PropertySchedule,
    messages: ChatbotMessages,
): string | null {
    const { check_in_time, check_in_date, check_out_time, check_out_date } =
        schedule;

    if (
        !check_in_time &&
        !check_out_time &&
        !check_in_date &&
        !check_out_date
    ) {
        return null;
    }

    const lines: string[] = [];

    if (check_in_time || check_in_date) {
        const parts = [check_in_date, check_in_time]
            .filter(Boolean)
            .join(" · ");
        lines.push(`${messages.checkIn}: ${parts}`);
    }

    if (check_out_time || check_out_date) {
        const parts = [check_out_date, check_out_time]
            .filter(Boolean)
            .join(" · ");
        lines.push(`${messages.checkOut}: ${parts}`);
    }

    return lines.join("\n");
}

function buildInfoResponse(
    rows: PropertyDataRow[],
    messages: ChatbotMessages,
): string {
    const row = rows[0];
    if (!row?.description) return messages.infoNotFound;
    return row.description;
}

// buildLocationResponse — añade el enlace en la misma línea de cada sitio
function buildLocationResponse(
    rows: PropertyDataRow[],
    messages: ChatbotMessages,
): string {
    if (rows.length === 0) return messages.locationsNotFound;

    const lines = rows
        .filter((r) => r.name)
        .map((r) => {
            const url = buildMapsUrl(r);
            return url ? `• ${r.name} — ${url}` : `• ${r.name}`;
        })
        .join("\n");

    return `${messages.locationsPrefix}\n\n${lines}`;
}

// buildFlaggedLocationResponse — mismo tratamiento
function buildFlaggedLocationResponse(
    rows: PropertyDataRow[],
    kind: "featured" | "must_visit",
    messages: ChatbotMessages,
): string {
    if (rows.length === 0) {
        return kind === "featured"
            ? messages.featuredNotFound
            : messages.mustVisitNotFound;
    }

    const prefix =
        kind === "featured"
            ? messages.featuredPrefix
            : messages.mustVisitPrefix;

    const lines = rows
        .filter((r) => r.name)
        .map((r) => {
            const url = buildMapsUrl(r);
            return url ? `• ${r.name} — ${url}` : `• ${r.name}`;
        })
        .join("\n");

    return `${prefix}\n\n${lines}`;
}

/**
 * Contenido de property_details (Barbacoa, Piscina...) — ya viene
 * redactado con voz de anfitrión desde el propio panel del propietario,
 * así que se sirve tal cual, sin pasar por el LLM. `instructions` responde
 * al "¿puedo/cómo lo uso?"; `guidelines` son las normas de etiqueta — se
 * muestran las dos, instrucciones primero.
 */
export function buildDetailResponse(
    detail: PropertyDetailRow | null,
    messages: ChatbotMessages,
): string {
    if (!detail) return messages.infoNotFound;

    const parts = [detail.instructions, detail.guidelines].filter(
        (p): p is string => Boolean(p),
    );

    if (parts.length === 0) return messages.infoNotFound;

    return parts.join("\n\n");
}

export function buildResponse(
    kind: ResponseKind,
    rows: PropertyDataRow[],
    messages: ChatbotMessages,
    schedule?: PropertySchedule,
): string {
    if (kind === "detail") {
        // 'detail' se resuelve con buildDetailResponse, llamada directamente
        // desde route.ts — la forma de sus datos (PropertyDetailRow) no
        // encaja con PropertyDataRow[]. Si esto se ejecuta, hay un error de
        // enrutado en quien llama.
        console.error(
            "buildResponse: 'detail' no se maneja aquí, usa buildDetailResponse",
        );
        return messages.infoNotFound;
    }

    if (kind === "featured" || kind === "must_visit") {
        return buildFlaggedLocationResponse(rows, kind, messages);
    }

    if (kind === "schedule") {
        if (schedule) {
            const scheduleResponse = buildScheduleResponse(schedule, messages);
            if (scheduleResponse) return scheduleResponse;
        }
        if (rows.length > 0) return buildInfoResponse(rows, messages);
        return messages.scheduleNotFound;
    }

    if (kind === "info") return buildInfoResponse(rows, messages);
    return buildLocationResponse(rows, messages);
}
