"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLoading } from "@/lib/context/LoadingContext";

import { deleteDetail } from "@/app/actions/properties/delete-detail";

import ExploreDetailCard from "@/components/molecules/card/explore-detail-card";
import ButtonLink from "@/components/molecules/button-link";
import Modal from "@/components/organisms/modal";
import Alert from "@/components/molecules/alert";
import IconDelete from "@/components/atoms/icon/delete";
import type { PropertyDetailRow } from "@/types/property-details";
import IconEdit from "@/components/atoms/icon/edit";

type ExploreDetailsViewProps = {
    propertyId: string;
    categoryId: string;
    subCategoryId: string;
    details: PropertyDetailRow[];
};

export default function ExploreDetailsView({
    propertyId,
    categoryId,
    subCategoryId,
    details: initialDetails,
}: ExploreDetailsViewProps) {
    const t = useTranslations();
    const router = useRouter();
    const { openLoading, closeLoading } = useLoading();

    const [details, setDetails] = useState<PropertyDetailRow[]>(initialDetails);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string>("");
    const [alert, setAlert] = useState<{
        type: "error" | "success";
        message: string;
    } | null>(null);

    const handleDeleteClick = (id: string) => {
        setSelectedId(id);
        setIsModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        setIsModalOpen(false);
        openLoading();
        setAlert(null);

        const result = await deleteDetail(selectedId);

        closeLoading();

        if (result.error) {
            setAlert({ type: "error", message: result.error });
            return;
        }

        setDetails((prev) => prev.filter((d) => d.id !== selectedId));
        setAlert({ type: "success", message: t("Eliminado") });
        setSelectedId("");
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            {alert && (
                <Alert
                    open
                    type={alert.type}
                    title={alert.type === "error" ? t("Error") : t("Eliminado")}
                    message={alert.message}
                    dismissible
                    hideTime={2000}
                />
            )}

            <Modal
                title={t("deleteDetail.title")}
                message={t("deleteDetail.description")}
                open={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedId("");
                }}
                destructiveButtonAction={handleDeleteConfirm}
                destructiveButtonLabel={t("Eliminar")}
                primaryButtonAction={() => setIsModalOpen(false)}
                primaryButtonLabel={t("Cancelar")}
                icon={<IconDelete color="error" />}
            />

            <div className="flex justify-start">
                <ButtonLink
                    label={t("Editar")}
                    iconLeft={<IconEdit />}
                    color="primary"
                    href={`/app/details/${propertyId}/${categoryId}/${subCategoryId}`}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {details.map((detail) => (
                    <ExploreDetailCard
                        key={detail.id}
                        detail={detail}
                        onDelete={handleDeleteClick}
                    />
                ))}
            </div>
        </div>
    );
}
