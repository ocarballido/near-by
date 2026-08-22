export type TimeWindowPill = {
    id: string;
    subCategoryIds: readonly string[];
    items: {
        id: string;
        name: string;
        address: string;
        description?: string;
        image_url?: string;
        latitude?: number;
        longitude?: number;
        type?: "info" | "location";
        featured: boolean;
        must_visit: boolean;
    }[];
};

export type TimeWindowWidgetData = {
    zone: "iberia" | "default";
    activeWindowId: string | null;
    hourDecimal: number;
    pills: TimeWindowPill[];
};
