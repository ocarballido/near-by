"use client";

import { useEffect, useState } from "react";

import TimeWindowWidget from "@/components/molecules/time-window-widget";
import TimeWindowModal from "@/components/molecules/time-window-modal";
import { trackClientEvent } from "@/lib/analytics/trackClient";
import { PILOT_PROPERTY_ID } from "@/config/config-constants";
import type {
    TimeWindowWidgetData,
    TimeWindowPill,
} from "@/types/time-window-widget";

type Props = {
    data: TimeWindowWidgetData;
    propertyId: string;
    anonId: string;
};

export default function TimeWindowSection({ data, propertyId, anonId }: Props) {
    const [selectedPill, setSelectedPill] = useState<TimeWindowPill | null>(
        null,
    );

    // Una impresión por sesión del navegador y propiedad: el widget se
    // repite en todas las secciones de la guía y no debe contar cada
    // navegación. Al emitirse en cliente, los bots que no ejecutan JS
    // (vistas previas de enlaces) quedan fuera. La propiedad piloto no
    // cuenta: sus visitas son de la demo, no de huéspedes reales.
    useEffect(() => {
        if (propertyId === PILOT_PROPERTY_ID) return;

        const storageKey = `time_window_widget_shown:${propertyId}`;

        try {
            if (sessionStorage.getItem(storageKey)) return;
            sessionStorage.setItem(storageKey, "1");
        } catch {
            // Sin sessionStorage (modo privado estricto): se envía igualmente
        }

        void trackClientEvent({
            event: "time_window_widget_shown",
            distinctId: anonId,
            props: { property_id: propertyId },
        });
    }, [propertyId, anonId]);

    const handleSelectPill = (pill: TimeWindowPill) => {
        const source = selectedPill ? "modal" : "widget";

        void trackClientEvent({
            event: "time_window_pill_clicked",
            distinctId: anonId,
            props: { property_id: propertyId, pill_id: pill.id, source },
        });

        setSelectedPill(pill);
    };

    const handleClose = () => {
        setSelectedPill(null);
    };

    return (
        <>
            <TimeWindowWidget data={data} onSelectPill={handleSelectPill} />

            <TimeWindowModal
                data={data}
                selectedPill={selectedPill}
                onSelectPill={handleSelectPill}
                onClose={handleClose}
                propertyId={propertyId}
                anonId={anonId}
            />
        </>
    );
}
