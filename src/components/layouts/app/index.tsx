"use client";

import { useLoading } from "@/lib/context/LoadingContext";

import Spinner from "@/components/atoms/spinner";
import { SpinnerPortal } from "@/components/atoms/spinner/spinner-portal";
import AppBar from "@/components/organisms/appbar";
import PaywallModal from "@/components/templates/paywall-modal";
import { SidebarProvider } from "@/lib/context/SidebarContext";
import { PropertyMenuProvider } from "@/lib/context/PropertyMenuContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { loading } = useLoading();

    return (
        <>
            {loading && (
                <SpinnerPortal>
                    <Spinner position="fixed" />
                </SpinnerPortal>
            )}
            <SidebarProvider>
                <PropertyMenuProvider>
                    <div className="flex flex-col items-stretch w-full h-dvh font-body overflow-hidden">
                        <PaywallModal />
                        <AppBar isLogged />
                        {children}
                    </div>
                </PropertyMenuProvider>
            </SidebarProvider>
        </>
    );
}
