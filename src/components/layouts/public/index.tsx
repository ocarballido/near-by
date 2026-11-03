"use client";

import { useLoading } from "@/lib/context/LoadingContext";

import Spinner from "@/components/atoms/spinner";
import { SpinnerPortal } from "@/components/atoms/spinner/spinner-portal";
import PublicPageBanner from "@/components/molecules/public-page-banner";
import EngagementModal from "@/components/organisms/engagement-modal";

export default function PublicLayout({
    children,
    isLoggedIn,
}: {
    children: React.ReactNode;
    isLoggedIn: boolean;
}) {
    const { loading } = useLoading();

    return (
        <>
            {loading && (
                <SpinnerPortal>
                    <Spinner position="fixed" />
                </SpinnerPortal>
            )}
            <EngagementModal isLoggedIn={isLoggedIn} />
            {/* El banner va dentro de la columna h-dvh: si se sumara a ella,
                empujaría el nav del pie fuera de la pantalla en mobile */}
            <div className="flex flex-col w-full h-dvh overflow-hidden">
                <PublicPageBanner
                    authHref="/auth/magic-link"
                    isLoggedIn={isLoggedIn}
                />
                <div className="flex flex-col items-stretch w-full grow min-h-0 font-body overflow-hidden">
                    {children}
                </div>
            </div>
        </>
    );
}
