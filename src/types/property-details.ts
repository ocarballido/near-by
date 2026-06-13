// Tipo que representa una fila de property_details en DB
export type PropertyDetailRow = {
    id: string;
    property_id: string;
    name: string;
    instructions: string | null;
    guidelines: string | null;
    image_url: string | null;
    predefined_key: string | null;
    order_index: number;
    created_at: string;
    updated_at: string;
};

// Input para crear o actualizar un detalle
export type UpsertPropertyDetailInput = {
    id?: string;
    property_id: string;
    name: string;
    instructions: string | null;
    guidelines: string | null;
    image_url: string | null;
    predefined_key: string | null;
    order_index: number;
};
