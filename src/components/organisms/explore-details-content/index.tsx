import ExploreDetailsEditor from "@/components/organisms/explore-details-editor";
import { PropertyDetailRow } from "@/types/property-details";
import type { DetailFieldsetState } from "@/components/molecules/explore-detail-fieldset";

type ExploreDetailsContentProps = {
    initialFieldsets: DetailFieldsetState[];
    propertyId: string;
};

function rowToFieldset(row: PropertyDetailRow): DetailFieldsetState {
    return {
        localId: row.id,
        dbId: row.id,
        name: row.name,
        instructions: row.instructions ?? "",
        guidelines: row.guidelines ?? "",
        predefinedKey: row.predefined_key,
        orderIndex: row.order_index,
        isDirty: false,
    };
}

export { rowToFieldset };

export default function ExploreDetailsContent({
    initialFieldsets,
    propertyId,
}: ExploreDetailsContentProps) {
    return (
        <ExploreDetailsEditor
            propertyId={propertyId}
            initialFieldsets={initialFieldsets}
        />
    );
}
