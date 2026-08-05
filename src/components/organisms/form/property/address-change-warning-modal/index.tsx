"use client";

import FancyIcon from "@/components/atoms/icon/fancy-icon";
import IconInfo from "@/components/atoms/icon/info";
import Typography from "@/components/atoms/typography";
import Modal from "@/components/organisms/modal";

type Props = {
    t: (key: string) => string;
    open: boolean;
    onClose: () => void; // backdrop click / Escape — no decide nada
    onKeep: () => void; // botón "Mantener"
    onDelete: () => void; // botón "Eliminar"
};

export default function AddressChangeWarningModal({
    t,
    open,
    onClose,
    onKeep,
    onDelete,
}: Props) {
    return (
        <Modal
            open={open}
            icon={<FancyIcon icon={<IconInfo color="white" />} color="info" />}
            onClose={onClose}
            title={t("addressChangeWarning.title")}
            description={t("addressChangeWarning.description")}
            destructiveButtonLabel={t("addressChangeWarning.deleteButton")}
            destructiveButtonAction={onDelete}
            secondaryButtonLabel={t("addressChangeWarning.keepButton")}
            secondaryButtonAction={onKeep}
        >
            <Typography weight="bold" className="px-3 py-2">
                {t("addressChangeWarning.pregunta")}
            </Typography>
        </Modal>
    );
}
