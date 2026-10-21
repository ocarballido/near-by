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
            <PublicPageBanner
                authHref="/auth/magic-link"
                isLoggedIn={isLoggedIn}
            />
            <EngagementModal isLoggedIn={isLoggedIn} />
            <div className="flex flex-col items-stretch w-full h-dvh font-body overflow-hidden">
                {children}
            </div>
        </>
    );
}
