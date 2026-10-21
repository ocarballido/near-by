"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { usePathname, useRouter } from "@/i18n/routing";
import { PILOT_PROPERTY_ID } from "@/config/config-constants";

import SimpleModal from "@/components/organisms/simple-modal";
import Button from "@/components/molecules/button";
import IconApartment from "@/components/atoms/icon/apartment";

const SHOW_DELAY_MS = 20_000;
const SS_KEY = "engagement_modal_shown";

function wasShownThisSession(): boolean {
    try {
        return sessionStorage.getItem(SS_KEY) === "1";
    } catch {
        return false;
    }
}

function setShownThisSession() {
    try {
        sessionStorage.setItem(SS_KEY, "1");
    } catch {}
}

type EngagementModalProps = {
    isLoggedIn: boolean;
};

const EngagementModal = ({ isLoggedIn }: EngagementModalProps) => {
    const t = useTranslations();
    const pathname = usePathname();
    const router = useRouter();

    const [open, setOpen] = useState(false);

    // usePathname de next-intl no trae el locale: "/public/<propertyId>/..."
    const isPilotPage = pathname.split("/")[2] === PILOT_PROPERTY_ID;

    // Vive en el layout público: navegar entre secciones de la guía no
    // reinicia el contador, así que los 20 s son de navegación total
    useEffect(() => {
        if (isLoggedIn || !isPilotPage) return;
        if (wasShownThisSession()) return;

        const timer = setTimeout(() => {
            setShownThisSession();
            setOpen(true);
        }, SHOW_DELAY_MS);

        return () => clearTimeout(timer);
    }, [isLoggedIn, isPilotPage]);

    const handleCtaClick = () => {
        setOpen(false);
        router.push("/auth/magic-link");
    };

    if (isLoggedIn || !isPilotPage) return null;

    return (
        <SimpleModal
            open={open}
            onClose={() => setOpen(false)}
            title={t("engagementModalTitle")}
            closeButtonAriaLabel={t("engagementModalCloseAriaLabel")}
            size="max-w-[440px]"
            background={
                // Exportado de Figma ya fusionado (elipses + imagen difuminada con blend)
                <Image
                    className="object-cover"
                    src="/static/img/engagement-modal/background.png"
                    fill
                    sizes="440px"
                    quality={90}
                    alt=""
                />
            }
        >
            <div className="flex flex-col items-center gap-6 p-4 m-0">
                <p className="text-center font-body font-medium text-base leading-5 text-gray-600">
                    {t("engagementModalBody")}
                </p>
                <div className="relative aspect-square w-[312px] max-w-full">
                    <Image
                        className="object-contain"
                        src="/static/img/engagement-modal/house-construction.png"
                        fill
                        sizes="312px"
                        alt=""
                    />
                </div>
                <Button
                    className="min-h-10"
                    iconLeft={<IconApartment />}
                    label={t("engagementModalCta")}
                    onClick={handleCtaClick}
                />
                <p className="rounded-2xl bg-primary-50 p-4 text-center font-body font-normal text-sm leading-5 text-gray-600">
                    {t("engagementModalReassurance")}
                </p>
            </div>
        </SimpleModal>
    );
};

export default EngagementModal;
