"use client";

import { useState } from "react";
import { useLoading } from "@/lib/context/LoadingContext";
import { usePaywall } from "@/lib/context/PaywallContext";
import { useTranslations } from "use-intl";
import { useGlobal } from "@/lib/context/GlobalContext";

import { deleteProperty } from "@/app/actions/properties/delete-property";

import {
    CATEGORIES_SUB_CATEGORIES,
    type PropertyTier,
} from "@/config/config-constants";

import House from "@/components/molecules/card/house";
import Modal from "@/components/organisms/modal";
import PropertyTierModal from "@/components/organisms/property-tier-modal";
import IconDelete from "@/components/atoms/icon/delete";
import Alert from "@/components/molecules/alert";
import NewPropertyCard from "@/components/molecules/new-property-card";

// type Property = {
//     address: string;
//     slug: string;
//     image_url?: string;
//     name: string;
//     id: string;
//     hasLocation: boolean;
//     hasInfo: boolean;
//     checkInDate?: string;
//     checkInTime?: string;
//     checkOutDate?: string;
//     checkOutTime?: string;
//     tier: PropertyTier;
// };

// type PropertiesContentProps = {
//     properties: Property[];
// };

type Property = {
    address: string;
    slug: string;
    image_url?: string;
    name: string;
    id: string;
    hasLocation: boolean;
    hasInfo: boolean;
    checkInDate?: string;
    checkInTime?: string;
    checkOutDate?: string;
    checkOutTime?: string;
    tier: PropertyTier;
};

// TEMPORAL: mock para revisar visualmente los 3 tiers en el navegador.
// Datos inventados — ELIMINAR este array y volver a usar la prop `properties`
// real cuando termines de ajustar estilos.
const MOCK_TIER_PROPERTIES: Property[] = [
    {
        id: "mock-gold",
        name: "Casa Mock Gold",
        slug: "casa-mock-gold",
        address: "Calle Falsa 123, Madrid",
        hasLocation: true,
        hasInfo: true,
        checkInTime: "15:00",
        checkOutTime: "11:00",
        tier: "gold",
    },
    {
        id: "mock-platinum",
        name: "Casa Mock Platinum",
        slug: "casa-mock-platinum",
        address: "Avenida Inventada 45, Barcelona",
        hasLocation: true,
        hasInfo: true,
        checkInTime: "16:00",
        checkOutTime: "10:00",
        tier: "platinum",
    },
    {
        id: "mock-diamond",
        name: "Casa Mock Diamond",
        slug: "casa-mock-diamond",
        address: "Plaza Ficticia 7, Valencia",
        hasLocation: true,
        hasInfo: true,
        checkInTime: "14:00",
        checkOutTime: "12:00",
        tier: "diamond",
    },
];

type PropertiesContentProps = {
    properties: Property[];
};

type AlertState = {
    type: "error" | "success";
    message: string;
};

const PropertiesContent = ({ properties }: PropertiesContentProps) => {
    const t = useTranslations();

    const { decrementPropertyCount } = usePaywall();

    const [isOpen, setIsOpen] = useState(false);
    const [isTierModalOpen, setIsTierModalOpen] = useState(false);
    const [alert, setAlert] = useState<AlertState | null>(null);
    const [selectedProperty, setSelectedProperty] = useState<string>("");
    const { loading, openLoading, closeLoading } = useLoading();
    const { user } = useGlobal();

    const handleDelete = async (propertyId: string) => {
        if (loading) return;

        setIsOpen(false);

        openLoading();

        setAlert(null);

        try {
            await deleteProperty(propertyId);

            decrementPropertyCount();

            setAlert({
                type: "success",
                message: "Propiedad eliminada correctamente",
            });
        } catch (err: unknown) {
            const msg =
                err instanceof Error
                    ? err.message
                    : "Error eliminando la propiedad";
            setAlert({ type: "error", message: msg });
        } finally {
            closeLoading();
        }
    };

    return (
        <>
            {alert && (
                <Alert
                    open
                    type={alert.type}
                    title={alert.type === "error" ? t("Error") : t("Eliminado")}
                    message={t(alert.message)}
                    dismissible
                    hideTime={2000}
                />
            )}
            <Modal
                title={t("Eliminar propiedad")}
                description={t(
                    "Estás a punto de eliminar una de tus propiedades",
                )}
                message={t("¿Estás seguro que deseas continuar?")}
                open={isOpen}
                onClose={() => {
                    setIsOpen(false);
                    setSelectedProperty("");
                }}
                destructiveButtonAction={() => handleDelete(selectedProperty)}
                destructiveButtonLabel={t("Eliminar")}
                primaryButtonAction={() => setIsOpen(false)}
                primaryButtonLabel={t("Cancelar")}
                icon={<IconDelete color="error" />}
            />
            <PropertyTierModal
                open={isTierModalOpen}
                onClose={() => setIsTierModalOpen(false)}
            />
            {/* {properties.map((property) => (
                <House
                    key={property?.id}
                    name={property?.name}
                    image={property?.image_url || null}
                    href={`/app/properties/${property?.id}/${CATEGORIES_SUB_CATEGORIES.LODGING.id}/${CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.MANUAL.id}`}
                    address={property?.address}
                    propertyId={property?.id}
                    hasInfo={property?.hasInfo}
                    hasLocation={property?.hasLocation}
                    tier={property?.tier}
                    onOpenTierModal={() => setIsTierModalOpen(true)}
                    handleDelete={() => {
                        setIsOpen(true);
                        setSelectedProperty(property?.id);
                    }}
                    checkInDate={property?.checkInDate}
                    checkInTime={property?.checkInTime}
                    checkOutDate={property?.checkOutDate}
                    checkOutTime={property?.checkOutTime}
                    distinctId={user?.id ?? ""}
                />
            ))} */}
            {/* TEMPORAL: usando MOCK_TIER_PROPERTIES en vez de `properties` para ver los 3 tiers */}
            {MOCK_TIER_PROPERTIES.map((property) => (
                <House
                    key={property?.id}
                    name={property?.name}
                    image={property?.image_url || null}
                    href={`/app/properties/${property?.id}/${CATEGORIES_SUB_CATEGORIES.LODGING.id}/${CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.MANUAL.id}`}
                    address={property?.address}
                    propertyId={property?.id}
                    hasInfo={property?.hasInfo}
                    hasLocation={property?.hasLocation}
                    tier={property?.tier}
                    onOpenTierModal={() => setIsTierModalOpen(true)}
                    handleDelete={() => {
                        setIsOpen(true);
                        setSelectedProperty(property?.id);
                    }}
                    checkInDate={property?.checkInDate}
                    checkInTime={property?.checkInTime}
                    checkOutDate={property?.checkOutDate}
                    checkOutTime={property?.checkOutTime}
                    distinctId={user?.id ?? ""}
                />
            ))}
            <NewPropertyCard />
        </>
    );
};

export default PropertiesContent;
