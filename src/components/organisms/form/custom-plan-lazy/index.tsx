"use client";

import dynamic from "next/dynamic";

// El formulario (react-hook-form + timeline) solo se usa en la pestaña
// Itinerario. next/dynamic solo separa el chunk si se llama desde un Client
// Component; desde page.tsx (Server Component) se cargaba en toda la guía
const ItineraryFormLazy = dynamic(
    () => import("@/components/organisms/form/custom-plan"),
);

export default ItineraryFormLazy;
